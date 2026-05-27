import { AppError } from "../../lib/errors";
import { blogRepository } from "../blog/blog.repository";
import { blogService } from "../blog/blog.service";
import type {
  AdminBlogListQuery,
  BlogListResult,
  BlogStatusUpdateResult,
  BlogUpdateInput,
  BlogWithImages,
} from "../blog/blog.types";

export const adminBlogService = {
  async getBlogs(query: AdminBlogListQuery): Promise<BlogListResult> {
    const isPublished =
      query.isPublished === "true"
        ? true
        : query.isPublished === "false"
        ? false
        : undefined;

    return blogRepository.findBlogs(blogService.buildListParams(query, isPublished));
  },

  async updateBlog(id: number, data: BlogUpdateInput): Promise<BlogWithImages> {
    const existing = await blogRepository.findBlogById(id);
    if (!existing) {
      throw new AppError(404, "Blog not found.");
    }

    if (data.slug !== undefined) {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugPattern.test(data.slug)) {
        throw new AppError(400, "slug must be lowercase and match pattern a-z0-9-");
      }

      if (data.slug !== existing.slug) {
        const duplicated = await blogRepository.findBlogBySlug(data.slug);
        if (duplicated) {
          throw new AppError(409, "slug already exists.");
        }
      }
    }

    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      coverImageUrl?: string;
      images?: {
        deleteMany: Record<string, never>;
        create: Array<{ imageUrl: string; sortOrder: number }>;
      };
    } = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
    };

    if (data.images !== undefined) {
      updateData.images = {
        deleteMany: {},
        create: data.images.map((image) => ({
          imageUrl: image.imageUrl,
          sortOrder: image.sortOrder,
        })),
      };
    }

    return blogRepository.updateBlog(id, updateData);
  },

  async updateBlogStatus(id: number, status: boolean): Promise<BlogStatusUpdateResult> {
    if (typeof status !== "boolean") {
      throw new AppError(400, "isPublished must be boolean.");
    }
    const existing = await blogRepository.findBlogById(id);

    if (!existing) {
      throw new AppError(404, "Blog not found.");
    }

    const postedAt = status
        ? existing.postedAt ?? new Date()
        : existing.postedAt;

    return blogRepository.updateBlogStatus(id, status, postedAt);
  },
  
};
