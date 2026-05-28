# Simple Blog Backend (TypeScript + Prisma)

โปรเจกต์นี้เป็นระบบ Backend สำหรับ Blog แบบง่าย พัฒนาด้วย Express + TypeScript + Prisma + MySQL  
รองรับการแสดง Blog, รายละเอียด Blog, Admin Panel สำหรับจัดการเนื้อหา Blog และ Comment

## เทคโนโลยีที่ใช้

- Node.js + Express + TypeScript
- Prisma ORM
- MySQL (Docker Compose)

## Feature
### ฝั่ง Public
- ดูรายการ Blog ทั้งหมด (เฉพาะที่ publish แล้ว)
- ค้นหาจากชื่อ/ข้อความบทความ
- Pagination (ค่าเริ่มต้น 10 รายการต่อหน้า)
- ดูรายละเอียด Blog ตาม `slug`
- แสดงคอมเมนต์เฉพาะที่ `APPROVED`
- ส่งคอมเมนต์ใหม่ (สถานะเริ่มต้นเป็น `PENDING`)
  
### ฝั่ง Admin (ต้อง Login)
- ดูรายการ Blog ทั้งหมด (ทั้ง published / unpublished)
- แก้ไขข้อมูล Blog (ยกเว้น `postedAt` และ `viewCount`)
- แก้ไข URL Slug
- Publish / Unpublish
- ดูรายการคอมเมนต์ และเลือก Approve/Reject

## System Design & Decisions

### 1. Architecture Pattern
โปรเจกต์นี้ใช้แนวทาง Layered Architecture แบ่งเป็น:
- Controller: รับ request และส่ง response
- Service: จัดการ business logic
- Repository: ติดต่อ database ผ่าน Prisma
- Validator: ตรวจสอบความถูกต้องของข้อมูล

แนวทางนี้ช่วยให้ระบบแยกความรับผิดชอบชัดเจน และง่ายต่อการ maintain และ scale ในอนาคต

---

### 2. Public vs Admin Separation
ระบบแยก endpoint ระหว่าง Public และ Admin อย่างชัดเจน:
- Public API: ใช้สำหรับผู้ใช้งานทั่วไป (อ่าน blog, comment)
- Admin API: ใช้สำหรับจัดการข้อมูลทั้งหมดของระบบ

เพื่อป้องกันการปนกันของ business logic และเพิ่มความปลอดภัย

---

### 3. Blog Publishing Strategy
ระบบใช้ `isPublished` เป็นตัวควบคุมการแสดงผลของ blog:
- Blog สามารถถูกสร้างและแก้ไขได้ตลอดเวลา
- การเผยแพร่ควบคุมด้วย `isPublished`
- Public API จะดึงเฉพาะ blog ที่ `isPublished = true`
- การ publish/unpublish เป็นการเปลี่ยน state ของ visibility โดยไม่กระทบ content
---

### 4. Comment Moderation Flow
Comment ทุกอันจะมี status:
- PENDING (เริ่มต้น)
- APPROVED (แสดงบน public)
- REJECTED (ไม่แสดง)

เพื่อควบคุม content ก่อนแสดงสู่ public

---

### 5. Image Handling Strategy
ระบบเก็บ `sortOrder` เพื่อควบคุมลำดับการแสดงผลของรูปภาพเพิ่มเติมใน blog

แนวทางการ update ใช้แบบ replace-all strategy:
- เมื่อมีการแก้ไขรูป ต้องส่งรายการรูปทั้งหมดใหม่
- ระบบจะลบของเดิมและสร้างใหม่ตามลำดับ `sortOrder`

เพื่อลดความซับซ้อนของ logic การ reorder

---

### 6. View Count Strategy
จำนวนผุ้ชม จะเพิ่มเมื่อเรียก GET /blogs/:slug สำเร็จ
เพื่อวัดการเข้าชมแบบง่าย

---

### 7. Assumption on Admin Role
ระบบออกแบบให้มี admin role เพียงระดับเดียว
ยังไม่รองรับ RBAC (Role-Based Access Control)

## Assumptions & ข้อจำกัด

### Blog
- วันที่โพสต์ ถูกกำหนดตอน publish ครั้งแรกและไม่สามารถเปลี่ยนแปลงได้
- จำนวนผู้ชม เพิ่มเมื่อเรียก GET /blogs/:slug สำเร็จ
- admin สามารถแก้ไข blog ได้ทั้ง published และ unpublished
- slug เปลี่ยนแล้วมีผลทันที และไม่มี redirect

### Comment
- comment ทุกอันเริ่มต้นที่ PENDING
- แสดงเฉพาะ APPROVED เท่านั้น
- ไม่จำเป็นต้อง login เพื่อ comment
- validate เฉพาะภาษาไทย ตัวเลข และช่องว่าง

### Image
- ใช้ replace-all strategy ในการ update images

### System
- ระบบมี role เดียวคือ admin

## Future Improvements
- เพิ่ม integration/e2e tests สำหรับ endpoint สำคัญ
- เพิ่มระบบ Redirect เมื่อมีการเปลี่ยน slug
- เพิ่ม audit log (เช่น ใครแก้ blog อะไรเมื่อไร)
- ปรับ image update เป็นแบบ diff update (ไม่ต้อง replace ทั้งชุด)
- เพิ่มให้ระบบสามารถรับรองได้หลาย role มากขึ้น
- เพิ่ม CI pipeline (lint/test/build) ก่อน deploy

## วิธีเริ่มต้นใช้งาน

1. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

2. คัดลอกไฟล์ environment:

   ```bash
   copy .env.example .env
   ```

3. เริ่มต้น MySQL:

   ```bash
   docker compose up -d
   ```

4. สร้าง Prisma Client และซิงก์ schema:

   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```

5. รัน API server:

   ```bash
   npm run dev
   ```

## โครงสร้างโปรเจกต์

```text
src/
  app.ts
  server.ts
  config/
    env.ts
    logger.ts
  lib/
    prisma.ts
    errors.ts
    response.ts
  middlewares/
    auth.middleware.ts
    error.middleware.ts
    validate.middleware.ts
    rate-limit.middleware.ts
  modules/
    auth/
      auth.controller.ts
      auth.service.ts
      auth.repository.ts
      auth.validator.ts
      auth.routes.ts
      auth.types.ts
    blog/
      blog.controller.ts
      blog.service.ts
      blog.repository.ts
      blog.validator.ts
      blog.routes.ts
      blog.types.ts
    comment/
      comment.controller.ts
      comment.service.ts
      comment.repository.ts
      comment.validator.ts
      comment.routes.ts
      comment.types.ts
    admin/
      admin-blog.controller.ts
      admin-blog.service.ts
      admin-blog.validator.ts
      admin-comment.controller.ts
      admin-comment.service.ts
      admin-comment.validator.ts
      admin.routes.ts
  routes/
    index.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  integration/
  unit/
```

## Endpoints

### Public
- `GET /health`  
- `GET /api/blogs` 
- `GET /api/blogs/:slug` 
- `POST /api/comments` 
- `GET /api/comments/blogs/:slug` 
### Admin
- `POST /api/auth/login` 
- `GET /api/admin/blogs` 
- `GET /api/admin/blogs/:slug`
- `PUT /api/admin/blogs/:id`
- `PATCH /api/admin/blogs/:id/status`
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:id/status`

## API Documentation (Swagger)

- http://localhost:3000/docs สำหรับหน้า Swagger UI
- http://localhost:3000/docs-json สำหรับไฟล์ OpenAPI JSON

## Build สำหรับ production

```bash
npm run build
npm start
```

## คำสั่ง Prisma

- `npm run prisma:generate`
- `npm run prisma:push`
- `npm run prisma:migrate`
- `npm run prisma:seed`
