import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ProjectItem, TaskItem } from "./types";
import { extractWikilinkSlug } from "./wikilinks";
import { readGlobalViewData } from "./global";
import { readTask } from "./tasks";
import { readDayPlan, type DayPlanResult } from "./dayplan";
import { readInboxData } from "./inbox";
import { getDailyNotePath, getLocalDateString } from "./dates";
import { isTaskClosed } from "./task-status";
import {
  extractWikilinksWithExistence,
  splitMarkdownSections,
  type WikilinkReference,
} from "./details";


export interface DailyProposal {
  /** Slug de la tâche proposée, extrait du wikilink du frontmatter. */
  taskSlug: string;
  /** La tâche résolue, ou `null` si le wikilink pointe dans le vide. */
  task: TaskItem | null;
  /** La raison de la recommandation, en clair, écrite par le rituel. */
  why: string | null;
}

export interface DailyJournalSection {
  title: string;
  body: string;
}

export interface DailyViewData {
  hasDailyNote: boolean;
  dateStr: string;
  activeProjects: ProjectItem[];
  /** Slug de la tâche portant le focus du jour, ou `null`. */
  focusSlug: string | null;
  /** `due` exactement égal à aujourd'hui. Ne dépend PAS du rituel. */
  todayTasks: TaskItem[];
  /** Retards (`due` passée) puis `doing` sans `due` du jour. Ne dépend PAS du rituel. */
  lateAndDoingTasks: TaskItem[];
  /** Propositions du rituel, en lecture seule. Vide si le rituel n'a pas tourné. */
  proposals: DailyProposal[];
  /**
   * Le corps de la daily note, découpé par titres de niveau 2, dans l'ordre du
   * fichier. Écrit par le rituel du matin et par `/update-brain` ; l'app ne
   * fait que le lire.
   */
  journal: DailyJournalSection[];
  /** Wikilinks du corps, avec leur existence, pour les rendre cliquables. */
  journalWikilinks: WikilinkReference[];
  /** Lien `obsidian://` vers la daily note, `null` si elle n'existe pas. */
  obsidianUrl: string | null;
  dayPlan: DayPlanResult;
  unprocessedInboxCount: number;
}


export function readDailyViewData(vaultPath: string, now: Date = new Date()): DailyViewData {
  const dateStr = getLocalDateString(now);

  // 1. Lire tous les projets et tâches via le gateway global
  const globalData = readGlobalViewData(vaultPath, now);
  const onGroup = globalData.groups.find((g) => g.status === "on");
  const activeProjects = onGroup ? onGroup.projects : [];

  // 2. Lire la daily note du jour. Elle porte UNIQUEMENT ce que le rituel du
  //    matin y écrit : le focus et les propositions. Les sections « tâches du
  //    jour » et « en retard / en cours » n'en dépendent pas et s'affichent
  //    même si le rituel n'a jamais tourné.
  const dailyFilePath = getDailyNotePath(vaultPath, dateStr);
  let hasDailyNote = false;
  let focusSlug: string | null = null;
  let rawProposals: RawProposal[] = [];
  let journal: DailyJournalSection[] = [];
  let journalWikilinks: WikilinkReference[] = [];
  let obsidianUrl: string | null = null;

  if (fs.existsSync(dailyFilePath)) {
    try {
      hasDailyNote = true;
      const raw = fs.readFileSync(dailyFilePath, "utf-8");
      const { data, content } = matter(raw);
      focusSlug = extractWikilinkSlug(data.focus);
      rawProposals = Array.isArray(data.proposals) ? (data.proposals as RawProposal[]) : [];
      journal = splitMarkdownSections(content);
      journalWikilinks = extractWikilinksWithExistence(content, vaultPath);
      obsidianUrl = `obsidian://open?vault=${encodeURIComponent(path.basename(vaultPath))}&file=${encodeURIComponent(path.relative(vaultPath, dailyFilePath))}`;
    } catch {
      // Une daily note illisible ne doit pas vider la vue : les tâches
      // viennent de projects/tasks, pas d'ici.
    }
  }

  // 3. Toutes les tâches ouvertes du vault, lues à plat et non à travers les
  //    projets : une tâche sans `project:` n'apparaît dans les `openTasks`
  //    d'aucun projet, et une tâche due aujourd'hui reste due aujourd'hui même
  //    sous un projet en sommeil. Le filtre par pertinence se fait ensuite sur
  //    `due` et `status`, jamais sur le statut du projet parent.
  const allTasks = globalData.allTasks.filter((t) => !isTaskClosed(t.status));

  // 4. Deux ensembles disjoints.
  //    - Tâches du jour : `due` exactement aujourd'hui. La tâche de focus
  //      remonte en tête, parce que c'est celle que le rituel a fait valider.
  //    - En retard et en cours : `due` passée d'abord, puis les `doing` que
  //      rien ne date. Un bloc unique, les pills distinguent les deux cas.
  const todayTasks = sortForDaily(
    allTasks.filter((t) => t.due === dateStr),
    focusSlug,
  );

  const lateTasks = sortForDaily(
    allTasks.filter((t) => t.due !== null && t.due < dateStr),
    focusSlug,
  );
  const doingTasks = sortForDaily(
    allTasks.filter((t) => t.status === "doing" && (t.due === null || t.due > dateStr)),
    focusSlug,
  );
  const lateAndDoingTasks = [...lateTasks, ...doingTasks];

  // 5. Résoudre les propositions. Une proposition dont la tâche a déjà une
  //    `due` du jour a été validée : elle vit désormais dans « tâches du
  //    jour », l'afficher deux fois ferait croire à une action restante.
  const proposals: DailyProposal[] = [];
  for (const raw of rawProposals) {
    const taskSlug = extractWikilinkSlug(raw?.task);
    if (!taskSlug) continue;
    const record = readTask(vaultPath, taskSlug);
    if (record && record.due === dateStr) continue;
    proposals.push({
      taskSlug,
      task: record ?? null,
      why: typeof raw?.why === "string" && raw.why.trim().length > 0 ? raw.why.trim() : null,
    });
  }

  // 6. La tâche de focus, si le rituel en a fait valider une.
  const focusTask = focusSlug ? (readTask(vaultPath, focusSlug) ?? null) : null;

  // 7. Le planning de la journée. Les trous se voient proposer une tâche parmi
  //    celles réellement en jeu aujourd'hui.
  const dayPlan = readDayPlan(vaultPath, now, [...todayTasks, ...lateAndDoingTasks]);

  const inboxData = readInboxData(vaultPath);

  return {
    hasDailyNote,
    dateStr,
    activeProjects,
    focusSlug: focusTask ? focusSlug : null,
    todayTasks,
    lateAndDoingTasks,
    proposals,
    journal,
    journalWikilinks,
    obsidianUrl,
    dayPlan,
    unprocessedInboxCount: inboxData.unprocessedCount,
  };
}

interface RawProposal {
  task?: unknown;
  why?: unknown;
}

/**
 * Ordre commun aux deux listes de la Daily : le focus en tête, puis les
 * non-bloquées (`doing` avant `todo`), les bloquées en dernier. Une tâche
 * bloquée reste visible mais ne doit jamais ouvrir une liste.
 */
function sortForDaily(tasks: TaskItem[], focusSlug: string | null): TaskItem[] {
  const rank = (t: TaskItem): number => {
    if (t.slug === focusSlug) return 0;
    if (t.isBlocked) return 3;
    return t.status === "doing" ? 1 : 2;
  };
  return [...tasks].sort((a, b) => rank(a) - rank(b));
}
