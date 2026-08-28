import { chromium } from "playwright-core";
const [OUT, sel, w = "1600", h = "900"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto("http://localhost:3111/fr", { waitUntil: "load" });
await p.waitForTimeout(8000);
await p.evaluate(async () => {
  const s = innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += s) { window.scrollTo({top:y,behavior:"instant"}); await new Promise(r=>setTimeout(r,200)); }
  window.scrollTo({top:0,behavior:"instant"});
});
await p.waitForTimeout(1500);
const box = await p.evaluate((s) => { const el=document.querySelector(s); const r=el.getBoundingClientRect(); return {top:Math.round(r.top+scrollY), h:Math.round(r.height)}; }, sel);
await p.evaluate((y) => window.scrollTo({top:y,behavior:"instant"}), Math.max(0, box.top - 60));
await p.waitForTimeout(1400);
await p.screenshot({ path: `${OUT}/shot.png` });
console.log(sel, "height:", box.h);
await b.close();
