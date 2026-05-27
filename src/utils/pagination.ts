export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};

const parsePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const resolvePagination = (
  page: unknown,
  pageSize: unknown,
  options?: { defaultPage?: number; defaultPageSize?: number; maxPageSize?: number },
): PaginationParams => {
  const defaultPage = options?.defaultPage ?? 1;
  const defaultPageSize = options?.defaultPageSize ?? 10;
  const maxPageSize = options?.maxPageSize ?? 100;

  const safePage = parsePositiveInt(page, defaultPage);
  const safePageSize = Math.min(parsePositiveInt(pageSize, defaultPageSize), maxPageSize);

  return { page: safePage, pageSize: safePageSize };
};

export const buildPagination = ({ page, pageSize }: PaginationParams): { skip: number; take: number } => {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};

export const buildPaginationMeta = (
  totalItems: number,
  params: PaginationParams,
): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / params.pageSize));
  const currentPage = Math.min(params.page, totalPages);

  return {
    totalItems,
    totalPages,
    currentPage,
    pageSize: params.pageSize,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export const buildPaginatedResult = <T>(
  items: T[],
  totalItems: number,
  params: PaginationParams,
): PaginatedResult<T> => {
  return {
    items,
    pagination: buildPaginationMeta(totalItems, params),
  };
};
