#!/usr/bin/env node
// scripts/render-logo-video.mjs
//
// Renderiza a animação do logotipo Yumit Hub quadro a quadro (determinístico) e gera o MP4.
// Pré-requisitos: servidor estático servindo a pasta public/ na porta 4173 e ffmpeg no PATH.
//
//   npx serve public -l 4173        (ou: cd public && python3 -m http.server 4173)
//   npx -p playwright-core node scripts/render-logo-video.mjs dark  /tmp/frames-dark
//   ffmpeg -framerate 60 -i /tmp/frames-dark/f%04d.png -c:v libx264 -preset slow -crf 17 \
//     -pix_fmt yuv420p -movflags +faststart public/brand/video/yumit-hub-logo-motion-dark.mp4
//
// Argumentos: <tema: dark|light> <pasta de saída dos frames>. Define CHROME_PATH para usar
// outro binário do Chromium (padrão: o Chromium instalado pelo Playwright).
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [,, theme, outDir] = process.argv;
const FPS = 60, W = 1920, H = 1080;
const ENTER_END = 3350;      // ms: fim da sequência de entrada (1×)
const HOLD = 2000;           // ms parado com glow
const EXIT_START = ENTER_END + HOLD;
const EXIT_END = EXIT_START + 1800;
const TAIL = 400;            // ms de respiro no final
const SPARKS_AT = 1550;
const TOTAL = EXIT_END + TAIL;
const LEAD = 400;            // ms de fundo vazio antes de começar

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:4173/brand/yumit-logo-motion/index.html?autoplay=0&ui=0&theme=${theme}`);
await page.waitForFunction(() => window.yumitLogo);
await page.addStyleTag({ content: 'body{transition:none!important} .logo{width:min(1500px,78vw)!important}' });

await page.evaluate(() => {
  const root = document.querySelector('.logo');
  const motion = window.yumitLogo;
  motion.clearTimers();
  let sparked = false;
  window.__seek = (state, local, wantSparks) => {
    if (root.dataset.state !== state) {
      root.dataset.state = state;
      if (state !== 'enter') { motion.clearSparks(); }
    }
    if (wantSparks && !sparked) { sparked = true; motion.burstSparks(18); }
    for (const a of root.getAnimations({ subtree: true })) {
      a.pause();
      a.currentTime = local;
    }
  };
});

const frames = Math.round(((LEAD + TOTAL) / 1000) * FPS);
for (let i = 0; i < frames; i++) {
  const T = (i * 1000) / FPS - LEAD;
  if (T < 0) {
    await page.evaluate(() => window.__seek('hidden', 0, false));
  } else if (T < ENTER_END) {
    await page.evaluate(([t, s]) => window.__seek('enter', t, s), [T, T >= SPARKS_AT]);
  } else if (T < EXIT_START) {
    await page.evaluate((t) => window.__seek('shown', t, false), T - ENTER_END);
  } else if (T < EXIT_END) {
    await page.evaluate((t) => window.__seek('exit', t, false), T - EXIT_START);
  } else {
    await page.evaluate(() => window.__seek('hidden', 0, false));
  }
  await page.screenshot({ path: `${outDir}/f${String(i).padStart(4, '0')}.png`, type: 'png' });
  if (i % 60 === 0) console.log(`${theme}: frame ${i}/${frames}`);
}
console.log(`${theme}: done, ${frames} frames`);
await browser.close();
