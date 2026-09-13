"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SearchResults, SearchResultItem } from "@/lib/vault/search";
import { DetailHeader } from "@/components/ui/DetailHeader";
import { Search, ExternalLink, FileText, CheckSquare, Folder, Layers, Target, Compass } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface SearchViewProps {
  initialResults: SearchResults;
  initialQuery?: string;
  initialFullText?: boolean;
}

export function SearchView({
  initialResults,
  initialQuery = "",
  initialFullText = false,
}: SearchViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [fullText, setFullText] = useState(initialFullText);
  const [results, setResults] = useState<SearchResults>(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!query.trim()) {
      setResults({
        query: "",
        fullText,
        totalMatches: 0,
        tasks: [],
        projects: [],
        contents: [],
        goals: [],
        notes: [],
        sources: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&fullText=${fullText}`
        );
        const data: SearchResults = await res.json();
        startTransition(() => {
          setResults(data);
          setIsLoading(false);
        });
      } catch {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query, fullText]);

  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text-primary pb-20">
      <DetailHeader
        eyebrow="AIOS"
        titre="Global search"
        actions={
          results.totalMatches > 0 ? (
            <span className="px-xs2 py-1 rounded-full text-caption font-bold bg-brand/15 text-brand-text border border-brand/30">
              {results.totalMatches} result{results.totalMatches > 1 ? "s" : ""}
            </span>
          ) : null
        }
      >
        <main className="px-container space-y-md pt-sm">
          {/* Barre de recherche */}
          <div className="space-y-xs">
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search a task, a project, a note..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-sm py-2.5 rounded-xl bg-surface border border-border text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm"
              />
              <div className="absolute left-3 top-3 text-text-tertiary">
                <Icon icon={Search} size={18} />
              </div>
              {isLoading && (
                <div className="absolute right-3 top-3 text-caption text-brand-text animate-pulse">
                  Searching...
                </div>
              )}
            </div>

            {/* Geste explicite pour le plein texte */}
            <label className="flex items-center gap-xs text-caption text-text-secondary cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={fullText}
                onChange={(e) => setFullText(e.target.checked)}
                className="rounded border-border text-brand focus:ring-brand"
              />
              <span>Full-text search in file bodies (second gesture)</span>
            </label>
          </div>

          {/* Résultats groupés */}
          {query.trim() === "" ? (
            <div className="p-lg rounded-xl border border-dashed border-border-strong bg-surface text-center space-y-xs">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-2 text-text-tertiary mx-auto">
                <Icon icon={Search} size={20} />
              </div>
              <h3 className="text-body font-bold text-text-primary">
                Instant search
              </h3>
              <p className="text-caption text-text-secondary max-w-xs mx-auto">
                Type the first letters to search titles and metadata across the vault.
              </p>
            </div>
          ) : results.totalMatches === 0 && !isLoading ? (
            <div className="p-lg rounded-xl border border-dashed border-border-strong bg-surface text-center space-y-xs">
              <h3 className="text-body font-bold text-text-primary">
                No results for &quot;{query}&quot;
              </h3>
              <p className="text-caption text-text-secondary max-w-xs mx-auto">
                {!fullText
                  ? "Try enabling full-text search in the body."
                  : "No file matches this term."}
              </p>
            </div>
          ) : (
            <div className="space-y-md">
              {/* 1. Tâches */}
              {results.tasks.length > 0 && (
                <SearchGroupSection
                  label="Tasks"
                  icon={CheckSquare}
                  items={results.tasks}
                />
              )}

              {/* 2. Projets */}
              {results.projects.length > 0 && (
                <SearchGroupSection
                  label="Projects"
                  icon={Folder}
                  items={results.projects}
                />
              )}

              {/* 3. Contenus */}
              {results.contents.length > 0 && (
                <SearchGroupSection
                  label="Content"
                  icon={Layers}
                  items={results.contents}
                />
              )}

              {/* 4. Goals */}
              {results.goals.length > 0 && (
                <SearchGroupSection
                  label="Goals"
                  icon={Target}
                  items={results.goals}
                />
              )}

              {/* 5. Notes */}
              {results.notes.length > 0 && (
                <SearchGroupSection
                  label="Notes"
                  icon={FileText}
                  items={results.notes}
                />
              )}

              {/* 6. Sources */}
              {results.sources.length > 0 && (
                <SearchGroupSection
                  label="Sources"
                  icon={Compass}
                  items={results.sources}
                />
              )}
            </div>
          )}
        </main>
      </DetailHeader>
    </div>
  );
}

function SearchGroupSection({
  label,
  icon,
  items,
}: {
  label: string;
  icon: any;
  items: SearchResultItem[];
}) {
  return (
    <section className="space-y-xs">
      <div className="flex items-center justify-between pb-2xs">
        <span className="text-eyebrow text-text-secondary flex items-center gap-1.5">
          <Icon icon={icon} size={14} className="text-brand-text" />
          {label}
        </span>
        <span className="text-caption text-text-tertiary">
          {items.length}
        </span>
      </div>

      <div className="space-y-xs">
        {items.map((item) => (
          // Un vrai `<a>` (pill Obsidian) vit à l'intérieur de cette carte :
          // la rendre en `<Link>` imbriquait un `<a>` dans un `<a>`, nesting
          // HTML invalide qui fait échouer l'hydratation React (même classe
          // de bug que GroupRow). `router.push` sur un `<div>` cliquable
          // évite l'imbrication tout en gardant la navigation.
          <SearchResultCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}

function SearchResultCard({ item }: { item: SearchResultItem }) {
  const router = useRouter();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(item.url)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(item.url);
      }}
      className="press p-sm rounded-lg bg-surface border border-border hover-supported:border-border-strong transition-colors block cursor-pointer"
    >
      <div className="flex items-start justify-between gap-xs">
        <span className="text-body-sm font-semibold text-text-primary truncate">
          {item.name}
        </span>
        <div className="flex items-center gap-xs shrink-0">
          <span className="text-[10px] uppercase font-bold text-text-tertiary border border-border px-1.5 py-0.2 rounded bg-surface-2">
            {item.type}
          </span>
          <a
            href={item.obsidianUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="press text-text-tertiary hover-supported:text-text-primary p-0.5"
            title="Open in Obsidian"
          >
            <Icon icon={ExternalLink} size={12} />
          </a>
        </div>
      </div>

      {/* Dépendances visibles : goal, projet parent, statut */}
      <div className="flex items-center gap-xs flex-wrap mt-xs text-caption text-text-secondary">
        {item.goal && (
          <span className="px-1.5 py-0.2 rounded bg-brand/10 text-brand-text border border-brand/20 font-medium">
            Goal: {item.goal}
          </span>
        )}
        {item.project && (
          <span className="px-1.5 py-0.2 rounded bg-surface-2 text-text-secondary border border-border font-medium">
            Project: {item.project}
          </span>
        )}
        {item.status && (
          <span className="px-1.5 py-0.2 rounded bg-surface-2 text-text-tertiary border border-border">
            {item.status}
          </span>
        )}
      </div>

      {/* Extrait snippet pour plein texte */}
      {item.snippet && (
        <p className="text-caption text-text-tertiary mt-xs pt-xs border-t border-border/50 italic">
          {item.snippet}
        </p>
      )}
    </div>
  );
}
