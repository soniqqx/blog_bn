import bcrypt from "bcryptjs";
import { CommentStatus } from "@prisma/client";

import { prisma } from "../src/lib/prisma";

const main = async (): Promise<void> => {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: { passwordHash, isActive: true },
    create: {
      username: "admin",
      passwordHash,
      isActive: true,
    },
  });

  // Clear dependent tables first so the seed stays idempotent.
  await prisma.comment.deleteMany();
  await prisma.blogImage.deleteMany();
  await prisma.blog.deleteMany();

  const firstBlog = await prisma.blog.create({
    data: {
      slug: "welcome-to-simple-blog",
      title: "Welcome to Simple Blog",
      excerpt: "Kick-off post introducing the new TypeScript + Prisma blog backend.",
      content:
        "This is the first seeded article. It demonstrates how blog records are inserted together with images and comments in development.",
      coverImageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      isPublished: true,
      viewCount: 128,
    },
  });

  const secondBlog = await prisma.blog.create({
    data: {
      slug: "draft-feature-roadmap",
      title: "Draft: Feature Roadmap",
      excerpt: "Planning upcoming features such as search, tags, and analytics.",
      content:
        "This seeded draft post is intentionally unpublished so admin flows can be tested for publish controls.",
      coverImageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      isPublished: false,
      postedAt: null,
      viewCount: 17,
    },
  });

  await prisma.blogImage.createMany({
    data: [
      {
        blogId: firstBlog.id,
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
        sortOrder: 1,
      },
      {
        blogId: firstBlog.id,
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        sortOrder: 2,
      },
      {
        blogId: secondBlog.id,
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
        sortOrder: 1,
      },
    ],
  });

  await prisma.comment.createMany({
    data: [
      {
        blogId: firstBlog.id,
        authorName: "Alice",
        message: "Great first post. Looking forward to more technical articles.",
        status: CommentStatus.APPROVED,
        moderatedAt: new Date(),
        moderatedByAdminId: admin.id,
      },
      {
        blogId: firstBlog.id,
        authorName: "Bob",
        message: "Could you share the project setup steps in more detail?",
        status: CommentStatus.PENDING,
      },
      {
        blogId: secondBlog.id,
        authorName: "Eve",
        message: "This roadmap looks too broad for one sprint.",
        status: CommentStatus.REJECTED,
      },
    ],
  });

  console.log("Seeded admin, blogs, images, and comments successfully.");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Failed to seed database", error);
    await prisma.$disconnect();
    process.exit(1);
  });
