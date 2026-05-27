import { Blog, BlogImage } from "@prisma/client";
import { PaginatedResult } from "../../utils/pagination";

export type BlogListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: "desc" | "asc";
  sortBy?: "createdAt" | "updatedAt" | "postedAt" | "viewCount";
};

export type BlogUpdateInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  images?: BlogImage[];
};

export type BlogListResult = PaginatedResult<Blog>;