// GitHub Search API は検索結果の先頭 1000 件までしか返さない（page * per_page <= 1000）。
// PER_PAGE = 20 なので指定できる最大ページは 50 になる。
// https://docs.github.com/en/rest/search/search#about-search
export const PER_PAGE = 20;
export const MAX_RESULTS = 1000;
export const MAX_PAGE = 50;
