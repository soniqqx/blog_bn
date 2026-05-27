import type { AdminBlogListQuery } from "../blog/blog.types";
import { validateBlogListQuery } from "../blog/blog.validator";
import { AppError } from "../../lib/errors";
import type { BlogUpdateInput } from "../blog/blog.types";

export const validateAdminBlogListQuery = (query: unknown): AdminBlogListQuery => {
  const base = validateBlogListQuery(query);
  const raw = query as Record<string, unknown>;

  let isPublished: AdminBlogListQuery["isPublished"];
  if (raw.isPublished !== undefined) {
    if (raw.isPublished !== "true" && raw.isPublished !== "false") {
      throw new AppError(400, "isPublished must be true or false.");
    }
    isPublished = raw.isPublished;
  }

  return {
    ...base,
    isPublished,
  };
};

export const validateAdminUpdateBlogBody = (body: unknown): BlogUpdateInput => {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be an object.");
  }

  const raw = body as Record<string, unknown>;
  const result: BlogUpdateInput = {};

  const assignOptionalString = (key: keyof BlogUpdateInput): void => {
    const value = raw[key as string];
    if (value === undefined) {
      return;
    }
    if (typeof value !== "string" || value.trim() === "") {
      throw new AppError(400, `${String(key)} must be a non-empty string.`);
    }
    result[key] = value.trim() as never;
  };

  assignOptionalString("title");
  assignOptionalString("slug");
  assignOptionalString("excerpt");
  assignOptionalString("content");
  assignOptionalString("coverImageUrl");

  if (raw.images !== undefined) {
    if (!Array.isArray(raw.images)) {
      throw new AppError(400, "images must be an array.");
    }
    if (raw.images.length > 6) {
      throw new AppError(400, "images cannot be more than 6.");
    }

    const mappedImages = raw.images.map((image, index) => {
      if (typeof image !== "object" || image === null) {
        throw new AppError(400, `images[${index}] must be an object.`);
      }

      const entry = image as Record<string, unknown>;
      if (typeof entry.imageUrl !== "string" || entry.imageUrl.trim() === "") {
        throw new AppError(400, `images[${index}].imageUrl must be a non-empty string.`);
      }

      if (entry.sortOrder === undefined) {
        throw new AppError(400, `images[${index}].sortOrder is required.`);
      }
      const parsed = Number(entry.sortOrder);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(400, `images[${index}].sortOrder must be a positive integer.`);
      }

      return {
        imageUrl: entry.imageUrl.trim(),
        sortOrder: parsed,
      };
    });

    const sortOrderSet = new Set(mappedImages.map((image) => image.sortOrder));
    if (sortOrderSet.size !== mappedImages.length) {
      throw new AppError(400, "images.sortOrder must not contain duplicates.");
    }

    const expectedSortOrders = Array.from({ length: mappedImages.length }, (_v, idx) => idx + 1);
    const actualSortOrders = [...mappedImages.map((image) => image.sortOrder)].sort((a, b) => a - b);
    const isSequential = expectedSortOrders.every((value, index) => value === actualSortOrders[index]);
    if (!isSequential) {
      throw new AppError(400, "images.sortOrder must be sequential starting from 1.");
    }

    const isInCorrectOrder = mappedImages.every((image, index) => image.sortOrder === index + 1);
    if (!isInCorrectOrder) {
      throw new AppError(400, "images must be ordered by sortOrder.");
    }

    result.images = mappedImages;
  }

  if (Object.keys(result).length === 0) {
    throw new AppError(400, "At least one updatable field is required.");
  }

  return result;
};

export const validateAdminUpdateBlogStatusBody = (body: unknown): { isPublished: boolean } => {
  if (typeof body !== "object" || body === null) {
    throw new AppError(400, "Request body must be an object.");
  }

  const raw = body as Record<string, unknown>;
  if (typeof raw.isPublished !== "boolean") {
    throw new AppError(400, "isPublished must be boolean.");
  }

  return {
    isPublished: raw.isPublished,
  };
};
