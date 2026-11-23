# RecipeMate Backend (NestJS + MVC)

Backend REST API untuk aplikasi **RecipeMate**, dibangun menggunakan framework **NestJS** dengan pola arsitektur **MVC (Model-View-Controller)** sebagai pemenuhan **Tugas 9 Praktikum Perancangan dan Pemrograman Web (PPW)**.

- **Nama Mahasiswa:** Geusan Edurais Aria Daffa
- **NIM:** 103122400026
- **Kelas:** SE-08-01
- **Program Studi:** S1 Software Engineering, Telkom University Purwokerto
- **Repository Backend:** [https://github.com/Geusan31/recipe_mate_backend](https://github.com/Geusan31/recipe_mate_backend)
- **Repository Frontend:** [https://github.com/Geusan31/recipe_mate](https://github.com/Geusan31/recipe_mate)

---

## 🎯 Fitur & Pemenuhan Tugas 9

1. **Entitas Data Utama (`Recipe`):**
   - Didefinisikan dalam [src/recipes/entities/recipe.entity.ts](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/src/recipes/entities/recipe.entity.ts) dengan lebih dari 5 field bertipe bervariasi (`id`, `slug`, `title`, `description`, `category`, `time`, `servings`, `difficulty`, `rating`, `ingredients`, `steps`, `createdAt`, `updatedAt`).
2. **DTO & class-validator:**
   - Didefinisikan dalam [src/recipes/dto/create-recipe.dto.ts](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/src/recipes/dto/create-recipe.dto.ts) dan [src/recipes/dto/update-recipe.dto.ts](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/src/recipes/dto/update-recipe.dto.ts).
   - Menggunakan 8 aturan validasi: `@IsString()`, `@IsNotEmpty()`, `@MinLength(3)`, `@IsNumber()`, `@Min(1)`, `@Max(5)`, `@IsIn(['Mudah', 'Sedang', 'Sulit'])`, `@IsArray()`.
3. **Service (In-Memory Array CRUD):**
   - Didefinisikan dalam [src/recipes/recipes.service.ts](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/src/recipes/recipes.service.ts).
   - Menyediakan operasi lengkap `create`, `findAll`, `findOne`, `update`, `remove`.
4. **Controller & Dependency Injection:**
   - Didefinisikan dalam [src/recipes/recipes.controller.ts](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/src/recipes/recipes.controller.ts).
   - Menggunakan DI murni pada constructor untuk mengakses `RecipesService`.
   - Mengimplementasikan seluruh HTTP method: `GET`, `POST`, `PATCH`, `DELETE`.
5. **Penanganan Error (Built-in Exceptions):**
   - `NotFoundException` (404) ketika ID/slug resep tidak ditemukan.
   - `ConflictException` (409) ketika terdapat duplikasi judul/slug resep.
   - `BadRequestException` (400) ketika validasi class-validator gagal.
6. **Global Validation & CORS:**
   - Diaktifkan di [src/main.ts](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/src/main.ts) (`app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` dan `app.enableCors()`).
7. **Pengujian REST Client:**
   - File siap uji di [test-requests.http](file:///c:/Kuliah/Semester%205/Perancangan%20dan%20Pemrograman%20Web/teori/pertemuan9/recipe_mate_backend/test-requests.http).
8. **Integrasi Frontend React:**
   - Tersambung live ke `recipe_mate` di port 5173 dengan halaman manajemen CRUD lengkap di `/kelola-resep`.

---

## 📁 Struktur Folder Proyek

```text
recipe_mate_backend/
├── docs/
│   ├── screenshots/                    # Tangkapan layar bukti pengujian Tugas 9
│   │   ├── 00_folder_structure.png
│   │   ├── 01_homepage.png
│   │   ├── 02_recipes_page.png
│   │   ├── 03_kelola_resep_page.png
│   │   ├── 04_tambah_resep_form.png
│   │   ├── 05_resep_berhasil_ditambahkan.png
│   │   ├── 06_detail_resep_page.png
│   │   ├── 07_rest_client_get_all.png
│   │   ├── 08_rest_client_get_one.png
│   │   ├── 09_rest_client_post_create.png
│   │   ├── 10_rest_client_validation_error.png
│   │   ├── 11_rest_client_conflict_error.png
│   │   ├── 12_rest_client_not_found_error.png
│   │   ├── 13_rest_client_patch_update.png
│   │   └── 14_rest_client_delete_remove.png
├── src/
│   ├── recipes/
│   │   ├── dto/
│   │   │   ├── create-recipe.dto.ts
│   │   │   └── update-recipe.dto.ts
│   │   ├── entities/
│   │   │   └── recipe.entity.ts
│   │   ├── recipes.controller.ts
│   │   ├── recipes.data.ts
│   │   ├── recipes.module.ts
│   │   └── recipes.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test-requests.http
├── package.json
└── README.md
```

---

## 🚀 Cara Menjalankan Backend

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan development server:**
   ```bash
   npm run start:dev
   ```
   Server backend akan aktif di: `http://localhost:3000`

3. **Jalankan frontend React (di folder `recipe_mate`):**
   ```bash
   cd ../recipe_mate
   npm run dev
   ```
   Frontend aktif di: `http://localhost:5173`
