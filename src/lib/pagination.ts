export type PageItem = number | "ellipsis";

// 表示するのは 1・最終ページ・現在ページの前後 1 つ。
// 間が 2 ページ以上空いたところに省略記号を挟む。
export function getPageItems(current: number, totalPages: number): PageItem[] {
  const candidates = new Set<number>([
    1,
    totalPages,
    current - 1,
    current,
    current + 1,
  ]);

  const pages = [...candidates]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];

  for (let index = 0; index < pages.length; index++) {
    if (index > 0 && pages[index] - pages[index - 1] >= 2) {
      items.push("ellipsis");
    }
    items.push(pages[index]);
  }

  return items;
}
