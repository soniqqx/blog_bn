import { Blog, BlogImage, Comment, CommentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { buildPaginatedResult, buildPagination, resolvePagination } from "../../utils/pagination";
import { BlogListQuery, BlogListResult, BlogUpdateInput } from "./blog.types";

export const blogRepository = {
    async findAllBlogs(query: BlogListQuery): Promise<BlogListResult> {
        const pagination = resolvePagination(query.page, query.pageSize);
        const { skip, take } = buildPagination(pagination);

        const search = typeof query.search === "string" ? query.search.trim() : "";
        const sortOrder: "asc" | "desc" = query.sortOrder === "asc" ? "asc" : "desc";
        const allowedSortBy = new Set(["createdAt", "updatedAt", "postedAt", "viewCount"]);
        const sortBy = allowedSortBy.has(String(query.sortBy)) ? String(query.sortBy) : "postedAt";

        const where: Prisma.BlogWhereInput = {
            isPublished: true,
        };

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { excerpt: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const orderBy = {
            [sortBy]: sortOrder,
        } as Prisma.BlogOrderByWithRelationInput;

        const [items, totalItems] = await Promise.all([
            prisma.blog.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            prisma.blog.count({ where }),
        ]);

        return buildPaginatedResult(items, totalItems, pagination);
    },

    findBlogBySlug(slug: string): Promise<(Blog & { images: BlogImage[]; comments: Comment[] }) | null> {
        return prisma.blog.findUnique({
            where: { slug },
            include: {
                images: true,
                comments: {
                    where: { status: CommentStatus.APPROVED as CommentStatus },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    },

    updateBlog(id: number, data: Partial<Blog>): Promise<Blog> {
        return prisma.blog.update({
            where: { id },
            data,
        });
    },

    updateBlogStatus(id: number, status: boolean): Promise<Blog> {
        return prisma.blog.update({
            where: { id },
            data: { 
                isPublished: status,
                postedAt: status ? new Date() : null
             },
        });
    },
};
