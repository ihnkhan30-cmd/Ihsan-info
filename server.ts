import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { initialData } from './src/data/initialData.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded assets
const UPLOADS_DIR = path.join(process.cwd(), 'public/assets/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/assets/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Database storage file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function initDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing database file:', err);
  }
}

initDatabase();

function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading database file, returning initialData:', e);
  }
  return initialData;
}

function writeDatabase(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing to database file:', e);
    return false;
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// GET portfolio content
app.get('/api/content', (req, res) => {
  const data = readDatabase();
  res.json(data);
});

// POST save entire content or partial section
app.post('/api/content', (req, res) => {
  const current = readDatabase();
  const updated = { ...current, ...req.body };
  const ok = writeDatabase(updated);
  if (ok) {
    res.json({ success: true, data: updated });
  } else {
    res.status(500).json({ error: 'Failed to write data' });
  }
});

// POST upload avatar image (base64 data URL or custom URL)
app.post('/api/upload-avatar', (req, res) => {
  try {
    const { imageBase64, avatarUrl } = req.body;
    let finalUrl = avatarUrl;

    if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.startsWith('data:image/')) {
      const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const rawExt = matches[1].toLowerCase();
        const ext = rawExt.includes('png') ? 'png' : rawExt.includes('webp') ? 'webp' : 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `avatar-${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        fs.writeFileSync(filePath, buffer);

        // Also copy to dist if available for production
        const distUploads = path.join(process.cwd(), 'dist/assets/uploads');
        if (fs.existsSync(distUploads)) {
          fs.writeFileSync(path.join(distUploads, fileName), buffer);
        }

        finalUrl = `/assets/uploads/${fileName}`;
      } else {
        finalUrl = imageBase64;
      }
    }

    if (!finalUrl) {
      return res.status(400).json({ error: 'No valid image provided' });
    }

    const current = readDatabase();
    current.profile = {
      ...current.profile,
      avatarUrl: finalUrl,
    };
    writeDatabase(current);

    res.json({ success: true, avatarUrl: finalUrl });
  } catch (error: any) {
    console.error('Error handling avatar upload:', error);
    res.status(500).json({ error: error.message || 'Failed to upload avatar' });
  }
});

// POST reset to factory initial data
app.post('/api/content/reset', (req, res) => {
  writeDatabase(initialData);
  res.json({ success: true, data: initialData });
});

// AI Translation endpoint
app.post('/api/ai/translate', async (req, res) => {
  const { bengaliText, context = 'general portfolio content', fieldName = '' } = req.body;

  if (!bengaliText || typeof bengaliText !== 'string' || !bengaliText.trim()) {
    return res.status(400).json({ error: 'bengaliText is required' });
  }

  const ai = getAI();

  // If Gemini API is available, perform high-fidelity translation
  if (ai) {
    try {
      const systemInstruction = `You are an elite multilingual academic linguist and translator specializing in Bengali, English, and Modern Standard Arabic.
Your task is to translate the user's Bengali source text into:
1. English: natural, professional international academic English suitable for a prestigious personal brand platform.
2. Arabic: professional Modern Standard Arabic (فصحى معاصرة رصينة) suitable for Arabic language scholars and academics.

Strict Translation Rules:
- Preserve names: Ihsanul Haque Khan / إحسان الحق خان.
- Preserve institution names: Islamic University, Kushtia (الجامعة الإسلامية، كوشتيا); Tamirul Millat Kamil Madrasa (معهد تعمير الملة الفاضل); Mandari Islamia Alim Madrasa (معهد مانداري الإسلامي العالي).
- Preserve degree names: Dakhil (الداخلية), Alim (العالمية), Bachelor of Arts (Honors) in Arabic Language & Literature (بكالوريوس مرتبة الشرف في اللغة العربية وآدابها).
- Preserve all dates, GPA numbers (e.g., 4.70/5.00, 4.86/5.00, 3.88/4.00), awards, URLs, emails, phone numbers.
- DO NOT translate proper nouns or personal names incorrectly.
- Output strictly valid JSON matching this schema:
{
  "en": "English translation here",
  "ar": "Arabic translation here"
}`;

      const prompt = `Context: ${context}
Field: ${fieldName}
Source Bengali text:
"""
${bengaliText}
"""

Translate into English and Arabic following all instructions. Return strictly JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);

      return res.json({
        en: parsed.en || '',
        ar: parsed.ar || '',
        aiGenerated: true,
      });
    } catch (error: any) {
      console.error('Gemini API translation error:', error);
      // Fall through to heuristic translation fallback
    }
  }

  // Graceful heuristic fallback if API key not present or transient error
  return res.json({
    en: `[English translation of: ${bengaliText.slice(0, 100)}...]`,
    ar: `[ترجمة عربية لـ: ${bengaliText.slice(0, 100)}...]`,
    aiGenerated: false,
    note: 'GEMINI_API_KEY can be added in Settings for full neural translation.',
  });
});

// AI SEO Assistant endpoint
app.post('/api/ai/seo-assist', async (req, res) => {
  const { title, content, category } = req.body;
  const ai = getAI();

  if (ai) {
    try {
      const prompt = `Based on this personal academic portfolio article/page:
Title: ${title}
Category: ${category}
Excerpt/Content: ${content?.slice(0, 500)}

Generate SEO metadata for Bengali, English, and Arabic.
Return strictly JSON with:
{
  "slug": {
    "bn": "seo-friendly-slug-in-english-letters-or-transliteration",
    "en": "english-slug-kebab-case",
    "ar": "arabic-slug-kebab-case"
  },
  "seoTitle": {
    "bn": "Bangla SEO Title under 60 chars",
    "en": "English SEO Title under 60 chars",
    "ar": "Arabic SEO Title under 60 chars"
  },
  "seoDescription": {
    "bn": "Bangla Meta Description under 155 chars",
    "en": "English Meta Description under 155 chars",
    "ar": "Arabic Meta Description under 155 chars"
  },
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "focusKeyword": "Primary focus keyword"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json(parsed);
    } catch (err) {
      console.error('SEO Assist error:', err);
    }
  }

  const cleanSlug = (title || 'article')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return res.json({
    slug: {
      bn: cleanSlug,
      en: cleanSlug,
      ar: cleanSlug,
    },
    seoTitle: {
      bn: `${title} | ইহসানুল হক খান`,
      en: `${title} | Ihsanul Haque Khan`,
      ar: `${title} | إحسان الحق خان`,
    },
    seoDescription: {
      bn: `${content?.slice(0, 140) || title} - ইহসানুল হক খানের নিবন্ধ ও গবেষণা।`,
      en: `${content?.slice(0, 140) || title} - Scholarly insight by Ihsanul Haque Khan.`,
      ar: `${content?.slice(0, 140) || title} - مقال وبحث بقلم إحسان الحق خان.`,
    },
    keywords: ['Arabic Language', 'Ihsanul Haque Khan', 'Research', 'Islamic University'],
    focusKeyword: title,
  });
});

// AI Alt-text generator
app.post('/api/ai/alt-text', async (req, res) => {
  const { imageName, title = '', context = '' } = req.body;
  const ai = getAI();

  if (ai) {
    try {
      const prompt = `Generate accessible image alt text and caption for an academic portfolio image:
Filename: ${imageName}
Title: ${title}
Context: ${context}

Return strictly JSON:
{
  "altText": {
    "bn": "বর্ণনামূলক অল্ট টেক্সট বাংলায়",
    "en": "Descriptive accessible alt text in English",
    "ar": "نص وصفي بديل للصورة باللغة العربية"
  },
  "caption": {
    "bn": "ছবির ক্যাপশন বাংলায়",
    "en": "Image caption in English",
    "ar": "تسمية توضيحية للصورة بالعربية"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json(parsed);
    } catch (e) {
      console.error('Alt text error:', e);
    }
  }

  res.json({
    altText: {
      bn: `${title || imageName} - ইহসানুল হক খানের চিত্র গ্যালারি`,
      en: `${title || imageName} - Ihsanul Haque Khan Media Archive`,
      ar: `${title || imageName} - أرشيف وسائط إحسان الحق خان`,
    },
    caption: {
      bn: `${title || imageName}`,
      en: `${title || imageName}`,
      ar: `${title || imageName}`,
    },
  });
});

// Dynamic Sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://ihsanulhaque.com';
  const db = readDatabase();
  const articles = db.articles || [];

  const mainRoutes = ['', '/about', '/education', '/experience', '/activities', '/skills', '/awards', '/articles', '/contact'];
  const languages = ['bn', 'en', 'ar'];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  // Main routes
  mainRoutes.forEach((route) => {
    languages.forEach((lang) => {
      const pathUrl = `${baseUrl}/${lang}${route}`;
      xml += `  <url>\n`;
      xml += `    <loc>${pathUrl}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
      languages.forEach((altLang) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}${route}"/>\n`;
      });
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/bn${route}"/>\n`;
      xml += `  </url>\n`;
    });
  });

  // Articles
  articles.forEach((art: any) => {
    languages.forEach((lang) => {
      const slug = (art.slug && art.slug[lang]) || art.id;
      const pathUrl = `${baseUrl}/${lang}/articles/${encodeURIComponent(slug)}`;
      xml += `  <url>\n`;
      xml += `    <loc>${pathUrl}</loc>\n`;
      xml += `    <lastmod>${art.publishedAt || new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      languages.forEach((altLang) => {
        const altSlug = (art.slug && art.slug[altLang]) || art.id;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}/articles/${encodeURIComponent(altSlug)}"/>\n`;
      });
      xml += `  </url>\n`;
    });
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://ihsanulhaque.com';
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

// ==========================================
// VITE INTEGRATION / SPA SERVING
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
