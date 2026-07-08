import GithubSlugger from "github-slugger";
import type { TocItem } from "@/components/blog";

/**
 * Builds a table of contents from markdown/MDX headings. Ids are generated with
 * github-slugger in document order — the exact algorithm rehype-slug uses — so
 * the TOC anchors match the ids rendered on the headings.
 */
export function extractToc(
  markdown: string,
  levels: (2 | 3)[] = [2]
): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trimEnd();

    // Toggle fenced code blocks so `# comments` inside code aren't treated as headings.
    if (/^(```|~~~)/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    // Strip inline markdown emphasis/links from the visible label.
    const label = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    // Every heading must be slugged (even skipped levels) to stay in sync with
    // rehype-slug's running counter for duplicate headings.
    const id = slugger.slug(label);

    if (levels.includes(level)) {
      items.push({ id, label, level });
    }
  }

  return items;
}
