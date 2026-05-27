import { Blog, BlogImage } from "@prisma/client";
import { PaginatedResult } from "../../utils/pagination";
import { PaginationParams } from "../../utils/pagination";

export type BlogListQuery = {
  page?: number | string;
  pageSize?: number | string;
  search?: string;
  sortOrder?: "desc" | "asc";
  sortBy?: "createdAt" | "updatedAt" | "postedAt" | "viewCount";
};

export type AdminBlogListQuery = BlogListQuery & {
  isPublished?: "true" | "false";
};

export type BlogSortBy = "createdAt" | "updatedAt" | "postedAt" | "viewCount";
export type BlogSortOrder = "desc" | "asc";

export type BlogListParams = {
  pagination: PaginationParams;
  search: string;
  sortBy: BlogSortBy;
  sortOrder: BlogSortOrder;
  isPublished?: boolean;
};

export type BlogUpdateInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  images?: BlogImageInput[];
};

export type BlogImageInput = {
  imageUrl: string;
  sortOrder: number;
};

export type BlogListResult = PaginatedResult<Blog>;
export type BlogWithImages = Blog & { images: BlogImage[] };
export type BlogStatusUpdateResult = Pick<Blog, "id" | "isPublished" | "postedAt" | "updatedAt">;