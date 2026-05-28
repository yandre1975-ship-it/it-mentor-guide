// Lightweight content loader for future SSG migration
// Currently loads markdown files; in production this will be replaced by Astro collections

export interface MarkdownTerm {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  relatedTerms: string[];
  prerequisites: string[];
  content: string;
}

export async function loadMarkdownTerms(): Promise<MarkdownTerm[]> {
  // Placeholder: in Astro SSG this becomes getCollection('terms')
  return [];
}
