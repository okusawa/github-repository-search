import { RepositoryCard } from "@/components/repository-card";
import type { SearchRepositoryItem } from "@/lib/github/schema";

type RepositoryListProps = {
  repositories: SearchRepositoryItem[];
};

export function RepositoryList({ repositories }: RepositoryListProps) {
  return (
    <ul className="flex flex-col gap-3" aria-label="Search results">
      {repositories.map((repository) => (
        <li key={repository.id}>
          <RepositoryCard repository={repository} />
        </li>
      ))}
    </ul>
  );
}
