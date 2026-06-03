type OpenApiSchema = Record<string, unknown>;

const ref = (name: string): OpenApiSchema => ({ $ref: `#/components/schemas/${name}` });

const successEnvelope = (data: OpenApiSchema): OpenApiSchema => ({
  type: "object",
  required: ["success", "message", "data"],
  properties: {
    success: { type: "boolean", example: true },
    message: { type: "string" },
    data,
  },
});

const jsonResponse = (description: string, schema: OpenApiSchema, example?: unknown) => ({
  description,
  content: {
    "application/json": {
      schema,
      ...(example !== undefined ? { example } : {}),
    },
  },
});

const errorResponse = (description: string, example?: unknown) =>
  jsonResponse(description, ref("ErrorResponse"), example);

const schemas = {
  ErrorResponse: {
    type: "object",
    required: ["success", "message"],
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string" },
      details: {},
    },
  },
  PaginationMeta: {
    type: "object",
    required: [
      "totalItems",
      "totalPages",
      "currentPage",
      "pageSize",
      "hasNextPage",
      "hasPreviousPage",
    ],
    properties: {
      totalItems: { type: "integer", example: 25 },
      totalPages: { type: "integer", example: 3 },
      currentPage: { type: "integer", example: 1 },
      pageSize: { type: "integer", example: 10 },
      hasNextPage: { type: "boolean", example: true },
      hasPreviousPage: { type: "boolean", example: false },
    },
  },
  Blog: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      slug: { type: "string", example: "hello-world" },
      title: { type: "string", example: "Hello World" },
      excerpt: { type: "string", example: "สรุปเนื้อหาบทความ" },
      content: { type: "string", example: "เนื้อหาบทความเต็ม" },
      coverImageUrl: { type: "string", example: "https://example.com/cover.jpg" },
      isPublished: { type: "boolean", example: true },
      postedAt: { type: "string", format: "date-time", nullable: true, example: "2026-05-28T10:00:00.000Z" },
      viewCount: { type: "integer", example: 42 },
      createdAt: { type: "string", format: "date-time", example: "2026-05-28T09:00:00.000Z" },
      updatedAt: { type: "string", format: "date-time", example: "2026-05-28T10:00:00.000Z" },
    },
  },
  BlogImage: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      blogId: { type: "integer", example: 1 },
      imageUrl: { type: "string", example: "https://example.com/image-1.jpg" },
      sortOrder: { type: "integer", example: 1 },
      createdAt: { type: "string", format: "date-time", example: "2026-05-28T09:00:00.000Z" },
    },
  },
  BlogWithImages: {
    allOf: [{ $ref: "#/components/schemas/Blog" }, {
      type: "object",
      properties: {
        images: {
          type: "array",
          items: { $ref: "#/components/schemas/BlogImage" },
        },
      },
    }],
  },
  BlogStatusUpdate: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      isPublished: { type: "boolean", example: true },
      postedAt: { type: "string", format: "date-time", nullable: true, example: "2026-05-28T10:00:00.000Z" },
      updatedAt: { type: "string", format: "date-time", example: "2026-05-28T10:00:00.000Z" },
    },
  },
  PaginatedBlogs: {
    type: "object",
    required: ["items", "pagination"],
    properties: {
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/Blog" },
      },
      pagination: { $ref: "#/components/schemas/PaginationMeta" },
    },
  },
  Comment: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      blogId: { type: "integer", example: 1 },
      authorName: { type: "string", example: "สมชาย" },
      message: { type: "string", example: "บทความดีมาก" },
      status: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"], example: "APPROVED" },
      createdAt: { type: "string", format: "date-time", example: "2026-05-28T10:00:00.000Z" },
      moderatedAt: { type: "string", format: "date-time", nullable: true, example: "2026-05-28T11:00:00.000Z" },
      moderatedByAdminId: { type: "integer", nullable: true, example: 1 },
    },
  },
  PaginatedComments: {
    type: "object",
    required: ["items", "pagination"],
    properties: {
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/Comment" },
      },
      pagination: { $ref: "#/components/schemas/PaginationMeta" },
    },
  },
  LoginData: {
    type: "object",
    required: ["token", "admin"],
    properties: {
      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
      admin: {
        type: "object",
        required: ["id", "username"],
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "admin" },
        },
      },
    },
  },
};

const sampleBlog = {
  id: 1,
  slug: "hello-world",
  title: "Hello World",
  excerpt: "สรุปเนื้อหาบทความ",
  content: "เนื้อหาบทความเต็ม",
  coverImageUrl: "https://example.com/cover.jpg",
  isPublished: true,
  postedAt: "2026-05-28T10:00:00.000Z",
  viewCount: 42,
  createdAt: "2026-05-28T09:00:00.000Z",
  updatedAt: "2026-05-28T10:00:00.000Z",
};

const sampleBlogImage = {
  id: 1,
  blogId: 1,
  imageUrl: "https://example.com/image-1.jpg",
  sortOrder: 1,
  createdAt: "2026-05-28T09:00:00.000Z",
};

const samplePagination = {
  totalItems: 25,
  totalPages: 3,
  currentPage: 1,
  pageSize: 10,
  hasNextPage: true,
  hasPreviousPage: false,
};

const sampleComment = {
  id: 1,
  blogId: 1,
  authorName: "สมชาย",
  message: "บทความดีมาก",
  status: "APPROVED",
  createdAt: "2026-05-28T10:00:00.000Z",
  moderatedAt: "2026-05-28T11:00:00.000Z",
  moderatedByAdminId: 1,
};

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Blog API",
    version: "1.0.0",
    description: "เอกสาร API สำหรับระบบ Blog Backend",
  },
  servers: [
    {
      url: process.env.NODE_ENV === "development" ? "http://localhost:3000"
        : process.env.APP_URL,
      description: "Local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas,
  },
  paths: {
    "/health": {
      get: {
        summary: "ตรวจสอบสถานะระบบ",
        responses: {
          "200": jsonResponse(
            "OK",
            {
              type: "object",
              required: ["success", "message"],
              properties: {
                success: { type: "boolean", example: true },
                message: { type: "string", example: "ok" },
              },
            },
            { success: true, message: "ok" },
          ),
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "เข้าสู่ระบบ",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  username: { type: "string", example: "admin" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          "200": jsonResponse(
            "Login success",
            successEnvelope(ref("LoginData")),
            {
              success: true,
              message: "Login success.",
              data: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                admin: { id: 1, username: "admin" },
              },
            },
          ),
          "401": errorResponse("Invalid credentials", {
            success: false,
            message: "Invalid username or password.",
          }),
        },
      },
    },
    "/api/blogs": {
      get: {
        summary: "ดึงรายการ blog ฝั่งผู้ใช้งาน",
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "pageSize", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "sortOrder", schema: { type: "string", enum: ["asc", "desc"] } },
          {
            in: "query",
            name: "sortBy",
            schema: { type: "string", enum: ["createdAt", "updatedAt", "postedAt", "viewCount"] },
          },
        ],
        responses: {
          "200": jsonResponse(
            "Blogs fetched",
            successEnvelope(ref("PaginatedBlogs")),
            {
              success: true,
              message: "Blogs fetched successfully.",
              data: {
                items: [sampleBlog],
                pagination: samplePagination,
              },
            },
          ),
        },
      },
    },
    "/api/blogs/{slug}": {
      get: {
        summary: "ดึงรายละเอียด blog ตาม slug",
        parameters: [{ in: "path", name: "slug", required: true, schema: { type: "string" } }],
        responses: {
          "200": jsonResponse(
            "Blog fetched",
            successEnvelope(ref("BlogWithImages")),
            {
              success: true,
              message: "Blog fetched successfully.",
              data: {
                ...sampleBlog,
                viewCount: 43,
                images: [sampleBlogImage],
              },
            },
          ),
          "404": errorResponse("Blog not found", {
            success: false,
            message: "Blog not found.",
          }),
        },
      },
    },
    "/api/comments/blogs/{slug}": {
      get: {
        summary: "ดึงคอมเมนต์ที่ APPROVED ตาม slug",
        parameters: [
          { in: "path", name: "slug", required: true, schema: { type: "string" } },
          { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "pageSize", schema: { type: "integer", minimum: 1 } },
        ],
        responses: {
          "200": jsonResponse(
            "Comments fetched",
            successEnvelope(ref("PaginatedComments")),
            {
              success: true,
              message: "Comments fetched successfully.",
              data: {
                items: [sampleComment],
                pagination: samplePagination,
              },
            },
          ),
          "404": errorResponse("Blog not found", {
            success: false,
            message: "Blog not found.",
          }),
        },
      },
    },
    "/api/comments": {
      post: {
        summary: "สร้างคอมเมนต์ใหม่",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["blogId", "authorName", "message"],
                properties: {
                  blogId: { type: "integer", example: 1 },
                  authorName: { type: "string", example: "สมชาย" },
                  message: { type: "string", example: "บทความดีมาก" },
                },
              },
            },
          },
        },
        responses: {
          "201": jsonResponse(
            "Comment created",
            successEnvelope(ref("Comment")),
            {
              success: true,
              message: "Comment created successfully.",
              data: {
                ...sampleComment,
                status: "PENDING",
                moderatedAt: null,
                moderatedByAdminId: null,
              },
            },
          ),
          "400": errorResponse("Validation error", {
            success: false,
            message: "authorName must contain only Thai characters and numbers.",
          }),
        },
      },
    },
    "/api/admin/blogs": {
      get: {
        summary: "ดึงรายการ blog ฝั่งแอดมิน",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "pageSize", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "sortOrder", schema: { type: "string", enum: ["asc", "desc"] } },
          {
            in: "query",
            name: "sortBy",
            schema: { type: "string", enum: ["createdAt", "updatedAt", "postedAt", "viewCount"] },
          },
          { in: "query", name: "isPublished", schema: { type: "string", enum: ["true", "false"] } },
        ],
        responses: {
          "200": jsonResponse(
            "Admin blogs fetched",
            successEnvelope(ref("PaginatedBlogs")),
            {
              success: true,
              message: "Blogs fetched successfully.",
              data: {
                items: [sampleBlog],
                pagination: samplePagination,
              },
            },
          ),
          "401": errorResponse("Unauthorized", {
            success: false,
            message: "Unauthorized.",
          }),
        },
      },
    },
    "/api/admin/blogs/{slug}": {
      get: {
        summary: "ดึงรายละเอียด blog ตาม slug ฝั่งแอดมิน",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "path", name: "slug", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": jsonResponse(
            "Admin blog fetched",
            successEnvelope(ref("BlogWithImages")),
            {
              success: true,
              message: "Blog fetched successfully.",
              data: { ...sampleBlog, images: [sampleBlogImage] },
            },
          ),
          "404": errorResponse("Blog not found", {
            success: false,
            message: "Blog not found.",
          }),
          "401": errorResponse("Unauthorized", {
            success: false,
            message: "Unauthorized.",
          }),
        },
      },
    },
    "/api/admin/blogs/{id}": {
      put: {
        summary: "แก้ไข blog",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                minProperties: 1,
                properties: {
                  title: { type: "string" },
                  slug: { type: "string", example: "updated-slug" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  coverImageUrl: { type: "string" },
                  images: {
                    type: "array",
                    maxItems: 6,
                    items: {
                      type: "object",
                      required: ["imageUrl", "sortOrder"],
                      properties: {
                        imageUrl: { type: "string" },
                        sortOrder: { type: "integer", minimum: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": jsonResponse(
            "Blog updated",
            successEnvelope(ref("BlogWithImages")),
            {
              success: true,
              message: "Blog updated successfully.",
              data: {
                ...sampleBlog,
                slug: "updated-slug",
                images: [sampleBlogImage],
              },
            },
          ),
          "400": errorResponse("Validation error", {
            success: false,
            message: "images.sortOrder must be sequential starting from 1.",
          }),
          "401": errorResponse("Unauthorized", {
            success: false,
            message: "Unauthorized.",
          }),
          "404": errorResponse("Blog not found", {
            success: false,
            message: "Blog not found.",
          }),
          "409": errorResponse("Slug duplicated", {
            success: false,
            message: "slug already exists.",
          }),
        },
      },
    },
    "/api/admin/blogs/{id}/status": {
      patch: {
        summary: "เปลี่ยนสถานะ publish ของ blog",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isPublished"],
                properties: {
                  isPublished: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: {
          "200": jsonResponse(
            "Blog status updated",
            successEnvelope(ref("BlogStatusUpdate")),
            {
              success: true,
              message: "Blog published successfully.",
              data: {
                id: 1,
                isPublished: true,
                postedAt: "2026-05-28T10:00:00.000Z",
                updatedAt: "2026-05-28T10:00:00.000Z",
              },
            },
          ),
          "400": errorResponse("Validation error", {
            success: false,
            message: "isPublished must be boolean.",
          }),
          "401": errorResponse("Unauthorized", {
            success: false,
            message: "Unauthorized.",
          }),
          "404": errorResponse("Blog not found", {
            success: false,
            message: "Blog not found.",
          }),
        },
      },
    },
    "/api/admin/comments": {
      get: {
        summary: "ดึงคอมเมนต์ฝั่งแอดมิน",
        security: [{ bearerAuth: [] }],
        parameters: [
          { in: "query", name: "page", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "pageSize", schema: { type: "integer", minimum: 1 } },
          { in: "query", name: "status", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] } },
        ],
        responses: {
          "200": jsonResponse(
            "Comments fetched",
            successEnvelope(ref("PaginatedComments")),
            {
              success: true,
              message: "Comments fetched successfully.",
              data: {
                items: [{ ...sampleComment, status: "PENDING", moderatedAt: null, moderatedByAdminId: null }],
                pagination: samplePagination,
              },
            },
          ),
          "401": errorResponse("Unauthorized", {
            success: false,
            message: "Unauthorized.",
          }),
        },
      },
    },
    "/api/admin/comments/{id}/status": {
      patch: {
        summary: "อนุมัติ/ปฏิเสธคอมเมนต์",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["APPROVED", "REJECTED"], example: "APPROVED" },
                },
              },
            },
          },
        },
        responses: {
          "200": jsonResponse(
            "Comment status updated",
            successEnvelope(ref("Comment")),
            {
              success: true,
              message: "Comment status updated successfully.",
              data: sampleComment,
            },
          ),
          "400": errorResponse("Validation error", {
            success: false,
            message: "status must be APPROVED or REJECTED.",
          }),
          "401": errorResponse("Unauthorized", {
            success: false,
            message: "Unauthorized.",
          }),
          "404": errorResponse("Comment not found", {
            success: false,
            message: "Comment not found.",
          }),
          "409": errorResponse("Comment already moderated", {
            success: false,
            message: "Only pending comments can be moderated.",
          }),
        },
      },
    },
  },
};
