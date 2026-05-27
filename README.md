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

## Assumption และข้อจำกัด
- ระบบนี้โฟกัส Backend API เป็นหลัก (ไม่ได้ทำ Frontend จริง)
- วันที่โพสต์ (postedAt) จะถูกกำหนดตอน publish ครั้งแรก และคงค่าเดิมเมื่อ unpublish/re-publish
- จำนวนเข้าชม (viewCount) ทุกครั้งที่เรียกดูรายละเอียด blog ผ่าน API GET /blogs/:slug สำเร็จ
- คอมเมนต์ใหม่ทุกอันเป็น PENDING และจะแสดงหน้า public เมื่อ APPROVED เท่านั้น
- ข้อความคอมเมนต์ validate ให้เป็น “ภาษาไทย + ตัวเลข + ช่องว่าง” เท่านั้น
- การอัปเดตรูปเพิ่มเติมของบทความใช้แนวทาง replace-all คือ หากต้องการแก้ไขรูปเพิ่มเติม ผู้ใช้งานต้องส่งรายการรูปทั้งหมดใหม่ทุกครั้ง ระบบจะลบข้อมูลรูปเดิมและสร้างรายการใหม่แทนการอัปเดตเฉพาะบางรูป แนวทางนี้ถูกเลือกเพื่อให้การจัดการลำดับรูป (sortOrder) มีความเรียบง่ายและลดความซับซ้อนของ logic ในการ reorder รูปภาพ
- ระบบการจัดการสิทธิ์ยังเป็นระดับ admin เป็นหลัก (ยังไม่ขยายเป็นหลายบทบาทเต็มรูปแบบ)

## Future Improvements
- เพิ่ม integration/e2e tests สำหรับ endpoint สำคัญ
- เพิ่ม audit log (เช่น ใครแก้ blog อะไรเมื่อไร)
- ปรับ image update เป็นแบบ diff update (ไม่ต้อง replace ทั้งชุด)
- เพิ่มให้ระบบสามารถรับรองได้หลายบทบาทมากขึ้น
- เพิ่ม CI pipeline (lint/test/build) ก่อน deploy

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

## Endpoints

- `GET /health`
- `POST /api/auth/login` (พร้อมใช้งาน)
- `GET /api/blogs` (โครงสร้างเริ่มต้น อาจคืนค่า `501` ในบางกรณี)
- `POST /api/comments` (โครงสร้างเริ่มต้น อาจคืนค่า `501` ในบางกรณี)
- `GET /api/admin/blogs` (โครงสร้างเริ่มต้น อาจคืนค่า `501` ในบางกรณี)
- `GET /api/admin/comments` (โครงสร้างเริ่มต้น อาจคืนค่า `501` ในบางกรณี)

```
