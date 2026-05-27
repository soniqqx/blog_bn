import { Blog, BlogImage, Comment, CommentStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { buildPaginatedResult, buildPagination } from "../../utils/pagination";
import { BlogListParams, BlogListResult } from "./blog.types";

export const blogRepository = {
    async findBlogs(params: BlogListParams): Promise<BlogListResult> {
        const { pagination, search, sortBy, sortOrder, isPublished } = params;
        const { skip, take } = buildPagination(pagination);

        const where: Prisma.BlogWhereInput = {};

        if (typeof isPublished === "boolean") {
            where.isPublished = isPublished;
        }

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

    findBlogDetailBySlug(slug: string): Promise<(Blog & { images: BlogImage[]; comments: Comment[] }) | null> {
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

    findBlogById(id: number): Promise<Blog | null> {
        return prisma.blog.findUnique({
            where: { id },
        });
    },

    findBlogBySlug(slug: string): Promise<Blog | null> {
        return prisma.blog.findUnique({
            where: { slug },
        });
    },

    updateBlog(id: number, data: Prisma.BlogUpdateInput): Promise<Blog> {
        return prisma.blog.update({
            where: { id },
            data,
        });
    },

    updateBlogStatus(id: number, status: boolean, postedAt: Date | null): Promise<Blog> {
        return prisma.blog.update({
            where: { id },
            data: { 
                isPublished: status,
                postedAt
             },
        });
    },
};
