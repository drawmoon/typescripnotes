import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

async function main() {
  const browser = await launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  try {
    await page.goto('https://www.example.com', {
      waitUntil: 'domcontentloaded',
    });

    // 你可以保存文件到指定位置
    await page.screenshot({ path: 'example.png', type: 'png' });

    // 也可以得到一个二进制数据
    const buf = await page.screenshot({ encoding: 'binary', type: 'png' });
    writeFileSync('example1.png', buf);
  } finally {
    await page.close();
  }

  await browser.close();
}

main();
