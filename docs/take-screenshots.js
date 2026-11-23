const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
    defaultViewport: { width: 1280, height: 850 },
  });

  try {
    const page = await browser.newPage();

    // 1. Home page
    console.log('Capturing Home Page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_homepage.png') });

    // 2. Recipes Page
    console.log('Capturing Recipes Page...');
    await page.goto('http://localhost:5173/resep', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_recipes_page.png') });

    // 3. Manage Recipes Page (Kelola Resep CRUD)
    console.log('Capturing Manage Recipes Page...');
    await page.goto('http://localhost:5173/kelola-resep', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_kelola_resep_page.png') });

    // 4. Fill form to add new recipe (POST action preview)
    console.log('Filling form and capturing POST action...');
    await page.type('input[name="title"]', 'Sate Ayam Madura Istimewa');
    await page.type('textarea[name="description"]', 'Sate ayam empuk bumbu kacang gurih khas Madura dengan kecap manis dan bawang goreng.');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_tambah_resep_form.png') });

    // Submit form
    console.log('Submitting recipe to NestJS backend...');
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_resep_berhasil_ditambahkan.png') });

    // 5. Recipe Detail Page
    console.log('Capturing Recipe Detail Page...');
    await page.goto('http://localhost:5173/resep/nasi-goreng-spesial', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_detail_resep_page.png') });

    console.log('All browser screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
