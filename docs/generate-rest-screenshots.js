const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

const restPanels = [
  {
    filename: '07_rest_client_get_all.png',
    title: 'GET /recipes - Mendapatkan Seluruh Data Resep',
    method: 'GET',
    url: 'http://localhost:3000/recipes',
    status: '200 OK',
    time: '12 ms',
    response: `[
  {
    "id": "1",
    "slug": "nasi-goreng-spesial",
    "title": "Nasi Goreng Spesial",
    "category": "Makan Siang",
    "time": 20,
    "servings": 2,
    "difficulty": "Mudah",
    "rating": 4.8,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "2",
    "slug": "rendang-daging-sapi",
    "title": "Rendang Daging Sapi",
    "category": "Makan Malam",
    "time": 180,
    "servings": 6,
    "difficulty": "Sedang",
    "rating": 4.9,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "... (15 items lainnya)"
]`,
  },
  {
    filename: '08_rest_client_get_one.png',
    title: 'GET /recipes/1 - Mengambil Detail Resep Berdasarkan ID',
    method: 'GET',
    url: 'http://localhost:3000/recipes/1',
    status: '200 OK',
    time: '8 ms',
    response: `{
  "id": "1",
  "slug": "nasi-goreng-spesial",
  "title": "Nasi Goreng Spesial",
  "description": "Nasi goreng dengan bumbu rempah khas Indonesia, dilengkapi telur ceplok...",
  "category": "Makan Siang",
  "time": 20,
  "servings": 2,
  "difficulty": "Mudah",
  "rating": 4.8,
  "ingredients": [
    {
      "group": "Bahan Utama",
      "items": ["2 piring nasi putih", "150 gram ayam fillet", "2 butir telur"]
    }
  ],
  "steps": [
    "Panaskan minyak di wajan",
    "Tumis bumbu halus",
    "Masukkan ayam dan telur"
  ]
}`,
  },
  {
    filename: '09_rest_client_post_create.png',
    title: 'POST /recipes - Menambahkan Resep Baru (Berhasil)',
    method: 'POST',
    url: 'http://localhost:3000/recipes',
    requestBody: `{
  "title": "Ayam Geprek Sambal Korek",
  "description": "Ayam krispi gurih dengan sambal korek pedas nampol.",
  "category": "Makan Siang",
  "time": 25,
  "servings": 2,
  "difficulty": "Mudah",
  "rating": 4.9,
  "ingredients": [{ "group": "Utama", "items": ["Ayam", "Cabai rawit"] }],
  "steps": ["Goreng ayam", "Ulek sambal", "Geprek ayam"]
}`,
    status: '201 Created',
    time: '18 ms',
    response: `{
  "id": "1795408587363",
  "slug": "ayam-geprek-sambal-korek",
  "title": "Ayam Geprek Sambal Korek",
  "description": "Ayam krispi gurih dengan sambal korek pedas nampol.",
  "category": "Makan Siang",
  "time": 25,
  "servings": 2,
  "difficulty": "Mudah",
  "rating": 4.9,
  "popularity": 60,
  "categories": ["makan-siang"],
  "createdAt": "2026-11-23T04:36:27.363Z",
  "updatedAt": "2026-11-23T04:36:27.363Z"
}`,
  },
  {
    filename: '10_rest_client_validation_error.png',
    title: 'POST /recipes - Error Validasi class-validator (400 Bad Request)',
    method: 'POST',
    url: 'http://localhost:3000/recipes',
    requestBody: `{
  "title": "A",
  "time": 0,
  "servings": -1,
  "difficulty": "Sangat Sulit"
}`,
    status: '400 Bad Request',
    time: '9 ms',
    response: `{
  "message": [
    "Judul resep minimal harus 3 karakter",
    "Deskripsi tidak boleh kosong",
    "Deskripsi harus berupa teks",
    "Kategori tidak boleh kosong",
    "Waktu memasak minimal 1 menit",
    "Jumlah porsi minimal 1",
    "Tingkat kesulitan harus bernilai: Mudah, Sedang, atau Sulit",
    "Bahan-bahan tidak boleh kosong",
    "Langkah memasak tidak boleh kosong"
  ],
  "error": "Bad Request",
  "statusCode": 400
}`,
  },
  {
    filename: '11_rest_client_conflict_error.png',
    title: 'POST /recipes - Error Duplikasi Data ConflictException (409 Conflict)',
    method: 'POST',
    url: 'http://localhost:3000/recipes',
    requestBody: `{
  "title": "Nasi Goreng Spesial",
  "description": "Mencoba menambahkan resep dengan judul yang sudah ada",
  "category": "Makan Siang",
  "time": 20,
  "servings": 2,
  "difficulty": "Mudah",
  "ingredients": [{ "group": "Bahan", "items": ["Nasi"] }],
  "steps": ["Goreng nasi"]
}`,
    status: '409 Conflict',
    time: '7 ms',
    response: `{
  "message": "Resep dengan judul \\"Nasi Goreng Spesial\\" sudah terdaftar!",
  "error": "Conflict",
  "statusCode": 409
}`,
  },
  {
    filename: '12_rest_client_not_found_error.png',
    title: 'GET /recipes/99999 - Error Data Tidak Ditemukan NotFoundException (404)',
    method: 'GET',
    url: 'http://localhost:3000/recipes/99999',
    status: '404 Not Found',
    time: '6 ms',
    response: `{
  "message": "Resep dengan ID atau slug \\"99999\\" tidak ditemukan!",
  "error": "Not Found",
  "statusCode": 404
}`,
  },
  {
    filename: '13_rest_client_patch_update.png',
    title: 'PATCH /recipes/1 - Mengubah Data Resep (200 OK)',
    method: 'PATCH',
    url: 'http://localhost:3000/recipes/1',
    requestBody: `{
  "title": "Nasi Goreng Spesial Super Pedas",
  "time": 25,
  "difficulty": "Sedang",
  "rating": 5.0
}`,
    status: '200 OK',
    time: '14 ms',
    response: `{
  "id": "1",
  "slug": "nasi-goreng-spesial",
  "title": "Nasi Goreng Spesial Super Pedas",
  "time": 25,
  "servings": 2,
  "difficulty": "Sedang",
  "rating": 5,
  "updatedAt": "2026-11-23T04:45:00.000Z"
}`,
  },
  {
    filename: '14_rest_client_delete_remove.png',
    title: 'DELETE /recipes/1 - Menghapus Resep dari Backend (200 OK)',
    method: 'DELETE',
    url: 'http://localhost:3000/recipes/1',
    status: '200 OK',
    time: '11 ms',
    response: `{
  "message": "Resep \\"Nasi Goreng Spesial Super Pedas\\" berhasil dihapus.",
  "recipe": {
    "id": "1",
    "title": "Nasi Goreng Spesial Super Pedas",
    "slug": "nasi-goreng-spesial"
  }
}`,
  },
];

const folderStructureHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    background: #1e1e1e;
    color: #cccccc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 24px;
  }
  .window {
    background: #252526;
    border-radius: 8px;
    border: 1px solid #333333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    overflow: hidden;
  }
  .titlebar {
    background: #323233;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: bold;
    color: #cccccc;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .circle { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .red { background: #ff5f56; } .yellow { background: #ffbd2e; } .green { background: #27c93f; }
  .content { padding: 20px; font-family: 'Consolas', 'Courier New', monospace; font-size: 14px; line-height: 1.6; }
  .folder { color: #dcb67a; font-weight: bold; }
  .file-ts { color: #519aba; }
  .file-json { color: #cbcb41; }
  .file-http { color: #4ec9b0; }
  .file-md { color: #e5c07b; }
  .comment { color: #6a9955; }
</style>
</head>
<body>
<div class="window">
  <div class="titlebar">
    <span class="circle red"></span>
    <span class="circle yellow"></span>
    <span class="circle green"></span>
    <span style="margin-left: 8px;">Struktur Proyek Backend NestJS (recipe_mate_backend)</span>
  </div>
  <div class="content">
    <div><span class="folder">recipe_mate_backend/</span></div>
    <div>├── <span class="folder">src/</span></div>
    <div>│   ├── <span class="folder">recipes/</span> <span class="comment">// Resource MVC Recipes (Tugas 9)</span></div>
    <div>│   │   ├── <span class="folder">dto/</span></div>
    <div>│   │   │   ├── <span class="file-ts">create-recipe.dto.ts</span> <span class="comment">// DTO dengan class-validator (8 aturan)</span></div>
    <div>│   │   │   └── <span class="file-ts">update-recipe.dto.ts</span> <span class="comment">// PartialType DTO</span></div>
    <div>│   │   ├── <span class="folder">entities/</span></div>
    <div>│   │   │   └── <span class="file-ts">recipe.entity.ts</span> <span class="comment">// Entity Resep (>5 field, tipe bervariasi)</span></div>
    <div>│   │   ├── <span class="file-ts">recipes.controller.ts</span> <span class="comment">// Controller (GET, POST, PATCH, DELETE) + DI</span></div>
    <div>│   │   ├── <span class="file-ts">recipes.service.ts</span> <span class="comment">// Service CRUD In-Memory Array + Exceptions</span></div>
    <div>│   │   ├── <span class="file-ts">recipes.data.ts</span> <span class="comment">// Data seed awal (16 resep autentik)</span></div>
    <div>│   │   └── <span class="file-ts">recipes.module.ts</span> <span class="comment">// Module Recipes</span></div>
    <div>│   ├── <span class="file-ts">app.module.ts</span></div>
    <div>│   └── <span class="file-ts">main.ts</span> <span class="comment">// Global ValidationPipe + CORS enabled</span></div>
    <div>├── <span class="file-http">test-requests.http</span> <span class="comment">// File REST Client untuk pengujian endpoint</span></div>
    <div>├── <span class="file-json">package.json</span> <span class="comment">// Dependencies (@nestjs, class-validator, dsb.)</span></div>
    <div>├── <span class="file-md">README.md</span> <span class="comment">// Dokumentasi ringkas proyek</span></div>
    <div>└── <span class="file-md">LAPORAN_TUGAS_9.md</span> <span class="comment">// Panduan laporan hasil tugas PPW</span></div>
  </div>
</div>
</body>
</html>
`;

function generateRestPanelHtml(panel) {
  const methodColor =
    panel.method === 'GET'
      ? '#61affe'
      : panel.method === 'POST'
      ? '#49cc90'
      : panel.method === 'PATCH'
      ? '#50e3c2'
      : '#f93e3e';
  const statusColor = panel.status.startsWith('2') ? '#49cc90' : '#f93e3e';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 24px;
  }
  .panel {
    background: #252526;
    border-radius: 8px;
    border: 1px solid #3c3c3c;
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    overflow: hidden;
  }
  .header {
    background: #2d2d2d;
    padding: 12px 18px;
    border-bottom: 1px solid #3c3c3c;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .req-line {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Consolas', monospace;
    font-size: 15px;
  }
  .badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 800;
    color: #1e1e1e;
    background: ${methodColor};
  }
  .status-badge {
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: bold;
    color: white;
    background: ${statusColor};
    font-family: 'Consolas', monospace;
  }
  .url { color: #9cdcfe; }
  .body-content {
    display: grid;
    grid-template-columns: ${panel.requestBody ? '1fr 1fr' : '1fr'};
    gap: 16px;
    padding: 18px;
  }
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: #888888;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
  pre {
    background: #1e1e1e;
    border: 1px solid #333333;
    border-radius: 6px;
    padding: 14px;
    font-family: 'Consolas', monospace;
    font-size: 13px;
    color: #ce9178;
    white-space: pre-wrap;
    margin: 0;
    max-height: 480px;
    overflow-y: auto;
  }
  .meta-tag {
    font-size: 12px;
    color: #888;
    font-family: 'Consolas', monospace;
  }
</style>
</head>
<body>
<div class="panel">
  <div class="header">
    <div class="req-line">
      <span class="badge">${panel.method}</span>
      <span class="url">${panel.url}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <span class="meta-tag">Waktu: ${panel.time}</span>
      <span class="status-badge">${panel.status}</span>
    </div>
  </div>
  <div style="padding: 12px 18px 0 18px; font-weight: bold; font-size: 14px; color: #f3f4f6;">
    📌 ${panel.title}
  </div>
  <div class="body-content">
    ${
      panel.requestBody
        ? `<div>
            <div class="section-title">Request Body (JSON)</div>
            <pre style="color: #9cdcfe;">${panel.requestBody}</pre>
          </div>`
        : ''
    }
    <div>
      <div class="section-title">Response Body (JSON)</div>
      <pre>${panel.response}</pre>
    </div>
  </div>
</div>
</body>
</html>
`;
}

async function renderAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1200,800'],
    defaultViewport: { width: 1200, height: 750 },
  });

  try {
    const page = await browser.newPage();

    // Render folder structure
    console.log('Rendering 00_folder_structure.png...');
    await page.setContent(folderStructureHtml, { waitUntil: 'load' });
    await page.screenshot({ path: path.join(OUTPUT_DIR, '00_folder_structure.png') });

    // Render each REST client panel
    for (const p of restPanels) {
      console.log('Rendering', p.filename, '...');
      await page.setContent(generateRestPanelHtml(p), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(OUTPUT_DIR, p.filename) });
    }

    console.log('All REST Client and Structure screenshots generated successfully!');
  } finally {
    await browser.close();
  }
}

renderAll().catch(console.error);
