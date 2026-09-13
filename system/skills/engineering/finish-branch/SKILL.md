---
name: finish-branch
description: Retire a merged git branch — worktree, local branch, remote branch, stale refs. Manual only, invoked by name after a PR merge.
disable-model-invocation: true
---

# Finish Branch

Retire a merged branch completely: nothing of it survives except the commits already in `main`. Run by hand, right after a PR merges — never automatically.

## Steps

### 1. Confirm the merge

Check the PR is actually merged (`gh pr view <branch> --json state,mergedAt`, or `git log main --oneline | grep <branch>`). Done when you can point to the merge commit in `main`. Never retire a branch you haven't confirmed merged.

### 2. Remove the worktree, if any

`git worktree list` — if the branch is checked out in a worktree (this repo keeps one per branch under `.claude/worktrees/`), run `git worktree remove <path>` from the main checkout. Done when that path no longer appears in `git worktree list`. Skip this step only if the branch was never in a worktree — a plain `git branch -d` on a worktree-checked-out branch fails.

### 3. Delete the local branch

`git branch -d <branch>` (from the main checkout, not a worktree). Done when `git branch --list <branch>` is empty. Use `-D` only if you've independently verified the merge in step 1 and `-d` refuses.

### 4. Delete the remote branch and prune

GitHub usually auto-deletes the remote branch on merge — check first (`git branch -r | grep <branch>`). If it's still there: `git push origin --delete <branch>`. Then always `git fetch --prune` to clear stale remote-tracking refs. Done when `git branch -r` no longer lists the branch and `git fetch --prune` reports nothing to prune.

### 5. Sync main

`git checkout main && git pull`. Done when local `main` matches `origin/main`.
