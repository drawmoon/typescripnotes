import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

async function main() {
  const browser = await launch({
    headless: true, // 在使用 `pdf` 函数时，需要将 `headless` 设置为 `true`，否则它将无法工作，你将得到 `Protocol error (Page.printToPDF): PrintToPDF is not implemented` 的报错
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  try {
    await page.goto('https://www.example.com', {
      waitUntil: 'domcontentloaded',
    });

    // 你可以保存文件到指定位置
    await page.pdf({ path: 'example.pdf', format: 'A4' });

    // 也可以得到一个二进制数据
    const buf = await page.pdf({ format: 'A4' });
    writeFileSync('example1.pdf', buf);
  } finally {
    await page.close();
  }

  await browser.close();
}

main();
