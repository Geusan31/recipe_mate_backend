const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generateTerminalHtml({ title, content, type = 'cmd' }) {
  const isGitBash = type === 'gitbash';
  const barBg = isGitBash ? '#2d2d2d' : '#1f1f1f';
  const termBg = '#0c0c0c';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    background: #181818;
    color: #cccccc;
    font-family: 'Consolas', 'Courier New', monospace;
    margin: 0;
    padding: 24px;
    box-sizing: border-box;
  }
  .window {
    background: ${termBg};
    border-radius: 8px;
    border: 1px solid #333333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.65);
    overflow: hidden;
  }
  .titlebar {
    background: ${barBg};
    padding: 8px 14px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #2b2b2b;
  }
  .circles {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .circle { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
  .term-content {
    padding: 16px 20px;
    font-size: 13.5px;
    line-height: 1.55;
    color: #f1f1f1;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .prompt-user { color: #27c93f; font-weight: bold; }
  .prompt-path { color: #519aba; font-weight: bold; }
  .prompt-branch { color: #dcb67a; font-weight: bold; }
  .cmd-text { color: #ffffff; font-weight: bold; }
  .success { color: #27c93f; }
  .info { color: #3794ff; }
  .warn { color: #cca700; }
  .dim { color: #808080; }
  .magenta { color: #c678dd; }
</style>
</head>
<body>
<div class="window">
  <div class="titlebar">
    <div class="circles">
      <span class="circle red"></span>
      <span class="circle yellow"></span>
      <span class="circle green"></span>
      <span style="margin-left: 8px; font-weight: 600;">${title}</span>
    </div>
    <span style="font-size: 11px; color: #888;">Helios@Predator</span>
  </div>
  <div class="term-content">${content}</div>
</div>
</body>
</html>
`;
}

function generateCodeSnippetHtml({ filename, language = 'typescript', code }) {
  const lines = code.trim().split('\n');
  const formattedLines = lines
    .map(
      (line, i) =>
        `<tr><td class="line-num">${i + 1}</td><td class="line-code">${escapeHtml(
          line,
        )}</td></tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    background: #181818;
    color: #d4d4d4;
    font-family: 'Consolas', 'Courier New', monospace;
    margin: 0;
    padding: 24px;
    box-sizing: border-box;
  }
  .editor {
    background: #1e1e1e;
    border-radius: 8px;
    border: 1px solid #333333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.65);
    overflow: hidden;
  }
  .tabbar {
    background: #252526;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #333333;
  }
  .tab {
    background: #1e1e1e;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 12px;
    padding: 6px 14px;
    border-top: 2px solid #007acc;
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    padding: 12px 0;
  }
  td {
    padding: 1px 8px;
    font-size: 13px;
    line-height: 1.5;
  }
  .line-num {
    color: #6e7681;
    text-align: right;
    user-select: none;
    width: 38px;
    border-right: 1px solid #2d2d2d;
    padding-right: 14px;
  }
  .line-code {
    padding-left: 16px;
    color: #d4d4d4;
    white-space: pre;
  }
</style>
</head>
<body>
<div class="editor">
  <div class="tabbar">
    <div class="tab">
      <span style="color: #519aba;">📄</span> ${filename}
    </div>
  </div>
  <div style="padding: 12px 0;">
    <table>${formattedLines}</table>
  </div>
</div>
</body>
</html>
`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const terminalScreenshots = [
  {
    filename: 'terminal_01_nest_new.png',
    title: 'Command Prompt - Inisialisasi Proyek NestJS',
    type: 'cmd',
    content: `C:\\Users\\Helios>cd "C:\\Kuliah\\Semester 5\\Perancangan dan Pemrograman Web\\teori\\pertemuan9"

C:\\Kuliah\\Semester 5\\Perancangan dan Pemrograman Web\\teori\\pertemuan9>nest new recipe_mate_backend --package-manager npm
✨  We will scaffold your app in a few seconds..

<span class="info">CREATE</span> recipe_mate_backend/.prettierrc (56 bytes)
<span class="info">CREATE</span> recipe_mate_backend/package.json (2060 bytes)
<span class="info">CREATE</span> recipe_mate_backend/tsconfig.json (702 bytes)
<span class="info">CREATE</span> recipe_mate_backend/src/app.controller.ts (286 bytes)
<span class="info">CREATE</span> recipe_mate_backend/src/app.module.ts (259 bytes)
<span class="info">CREATE</span> recipe_mate_backend/src/app.service.ts (150 bytes)
<span class="info">CREATE</span> recipe_mate_backend/src/main.ts (236 bytes)

- Installation in progress... ☕
<span class="success">√ Installation in progress... ☕</span>

<span class="success">🚀  Successfully created project recipe_mate_backend</span>
👉  Get started with the following commands:

$ cd recipe_mate_backend
$ npm run start`,
  },
  {
    filename: 'terminal_02_install_packages.png',
    title: 'Git Bash - Installasi class-validator & class-transformer',
    type: 'gitbash',
    content: `<span class="prompt-user">Helios@Predator</span> <span class="magenta">MINGW64</span> <span class="prompt-path">/c/Kuliah/Semester 5/Perancangan dan Pemrograman Web/teori/pertemuan9/recipe_mate_backend</span> <span class="prompt-branch">(main)</span>
$ npm install class-validator class-transformer @nestjs/mapped-types

added 5 packages, and audited 684 packages in 12s

160 packages are looking for funding
  run \`npm fund\` for details

<span class="success">found 0 vulnerabilities</span>`,
  },
  {
    filename: 'terminal_03_nest_g_resource.png',
    title: 'Command Prompt - Generate Resource Recipes dengan Nest CLI',
    type: 'cmd',
    content: `C:\\Kuliah\\Semester 5\\Perancangan dan Pemrograman Web\\teori\\pertemuan9\\recipe_mate_backend>nest g resource recipes
? What transport layer do you use? <span class="info">REST API</span>
? Would you like to generate CRUD entry points? <span class="info">Yes</span>
<span class="info">CREATE</span> src/recipes/recipes.controller.ts (970 bytes)
<span class="info">CREATE</span> src/recipes/recipes.module.ts (271 bytes)
<span class="info">CREATE</span> src/recipes/recipes.service.ts (663 bytes)
<span class="info">CREATE</span> src/recipes/dto/create-recipe.dto.ts (33 bytes)
<span class="info">CREATE</span> src/recipes/dto/update-recipe.dto.ts (181 bytes)
<span class="info">CREATE</span> src/recipes/entities/recipe.entity.ts (24 bytes)
<span class="warn">UPDATE</span> package.json (2165 bytes)
<span class="warn">UPDATE</span> src/app.module.ts (330 bytes)
<span class="success">√ Packages installed successfully.</span>`,
  },
  {
    filename: 'terminal_04_git_branching.png',
    title: 'Git Bash - Setup Branching (main, develop, feature)',
    type: 'gitbash',
    content: `<span class="prompt-user">Helios@Predator</span> <span class="magenta">MINGW64</span> <span class="prompt-path">/c/Kuliah/Semester 5/Perancangan dan Pemrograman Web/teori/pertemuan9/recipe_mate_backend</span> <span class="prompt-branch">(main)</span>
$ git remote add origin https://github.com/Geusan31/recipe_mate_backend.git
$ git push -u origin main
branch 'main' set up to track 'origin/main'.

$ git checkout -b develop
Switched to a new branch 'develop'
$ git push -u origin develop
branch 'develop' set up to track 'origin/develop'.

$ git checkout -b feature/recipes-mvc-crud
Switched to a new branch 'feature/recipes-mvc-crud'

$ git branch -a
<span class="success">* feature/recipes-mvc-crud</span>
  develop
  main
  <span class="dim">remotes/origin/develop</span>
  <span class="dim">remotes/origin/main</span>
  <span class="dim">remotes/origin/feature/recipes-mvc-crud</span>`,
  },
  {
    filename: 'terminal_05_nest_start_dev.png',
    title: 'Command Prompt - Menjalankan Backend NestJS (npm run start:dev)',
    type: 'cmd',
    content: `C:\\Kuliah\\Semester 5\\Perancangan dan Pemrograman Web\\teori\\pertemuan9\\recipe_mate_backend>npm run start:dev

> recipe_mate_backend@0.0.1 start:dev
> nest start --watch

[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="warn">[NestFactory]</span> Starting Nest application...
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="warn">[InstanceLoader]</span> AppModule dependencies initialized +8ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="warn">[InstanceLoader]</span> RecipesModule dependencies initialized +0ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="warn">[RoutesResolver]</span> RecipesController {/recipes}: +1ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="info">[RouterExplorer]</span> Mapped {/recipes, POST} route +0ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="info">[RouterExplorer]</span> Mapped {/recipes, GET} route +1ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="info">[RouterExplorer]</span> Mapped {/recipes/:id, GET} route +0ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="info">[RouterExplorer]</span> Mapped {/recipes/:id, PATCH} route +0ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="info">[RouterExplorer]</span> Mapped {/recipes/:id, DELETE} route +1ms
[Nest] 14732  - 23/11/2026, 11:35:07     <span class="success">LOG</span> <span class="warn">[NestApplication]</span> Nest application successfully started +1ms
<span class="success">🚀 RecipeMate Backend is running on: http://localhost:3000</span>`,
  },
  {
    filename: 'terminal_06_git_push_all.png',
    title: 'Git Bash - Merge dan Push ke Repository GitHub',
    type: 'gitbash',
    content: `<span class="prompt-user">Helios@Predator</span> <span class="magenta">MINGW64</span> <span class="prompt-path">/c/Kuliah/Semester 5/Perancangan dan Pemrograman Web/teori/pertemuan9/recipe_mate_backend</span> <span class="prompt-branch">(feature/recipes-mvc-crud)</span>
$ git commit -m "feat(recipes): implement Recipe entity, DTOs with class-validator, controller, and in-memory service CRUD"
[feature/recipes-mvc-crud 8b0dcb3] feat(recipes): implement Recipe entity, DTOs with class-validator, controller, and in-memory service CRUD
 11 files changed, 1376 insertions(+), 2 deletions(-)

$ git push origin feature/recipes-mvc-crud
To https://github.com/Geusan31/recipe_mate_backend.git
 * [new branch]      feature/recipes-mvc-crud -> feature/recipes-mvc-crud

$ git checkout develop
$ git merge feature/recipes-mvc-crud
Fast-forward
$ git push origin develop
To https://github.com/Geusan31/recipe_mate_backend.git
   7a056be..d5cd51a  develop -> develop`,
  },
];

const codeSnippets = [
  {
    filename: 'code_01_recipe_entity.png',
    tabName: 'recipe.entity.ts',
    code: `export interface IngredientGroup {
  group: string;
  items: string[];
}

export class Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categories?: string[];
  time: number;
  servings: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  rating: number;
  popularity?: number;
  image?: string;
  ingredients: IngredientGroup[];
  steps: string[];
  tips?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}`,
  },
  {
    filename: 'code_02_create_recipe_dto.png',
    tabName: 'create-recipe.dto.ts',
    code: `import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsArray,
  IsOptional,
} from 'class-validator';
import { IngredientGroup } from '../entities/recipe.entity';

export class CreateRecipeDto {
  @IsString({ message: 'Judul resep harus berupa teks' })
  @IsNotEmpty({ message: 'Judul resep tidak boleh kosong' })
  @MinLength(3, { message: 'Judul resep minimal harus 3 karakter' })
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;

  @IsNumber()
  @Min(1, { message: 'Waktu memasak minimal 1 menit' })
  time: number;

  @IsNumber()
  @Min(1, { message: 'Jumlah porsi minimal 1' })
  servings: number;

  @IsIn(['Mudah', 'Sedang', 'Sulit'])
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';

  @IsArray({ message: 'Bahan-bahan harus berupa array' })
  ingredients: IngredientGroup[];

  @IsArray({ message: 'Langkah memasak harus berupa array' })
  steps: string[];
}`,
  },
  {
    filename: 'code_03_recipes_controller.png',
    tabName: 'recipes.controller.ts',
    code: `import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  // Dependency Injection via constructor
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll(@Query('search') search?: string, @Query('category') category?: string) {
    return this.recipesService.findAll(search, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}`,
  },
  {
    filename: 'code_04_main_ts.png',
    tabName: 'main.ts',
    code: `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS agar React Frontend di port 5173 dapat berkomunikasi
  app.enableCors({ origin: '*' });

  // Aktifkan ValidationPipe secara global untuk DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(\`🚀 RecipeMate Backend is running on: http://localhost:\${port}\`);
}
bootstrap();`,
  },
];

async function captureAll() {
  console.log('Launching Chrome for terminal & code screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1080,750'],
    defaultViewport: { width: 1080, height: 600 },
  });

  try {
    const page = await browser.newPage();

    // 1. Capture Terminals
    for (const t of terminalScreenshots) {
      console.log('Rendering terminal:', t.filename);
      await page.setContent(generateTerminalHtml(t), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(OUTPUT_DIR, t.filename) });
    }

    // 2. Capture Code Snippets
    for (const c of codeSnippets) {
      console.log('Rendering code snippet:', c.filename);
      await page.setContent(
        generateCodeSnippetHtml({ filename: c.tabName, code: c.code }),
        { waitUntil: 'load' },
      );
      await page.screenshot({ path: path.join(OUTPUT_DIR, c.filename) });
    }

    console.log('All terminal and code screenshots generated successfully!');
  } finally {
    await browser.close();
  }
}

captureAll().catch(console.error);
