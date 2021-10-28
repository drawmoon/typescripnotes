import { Cluster } from 'puppeteer-cluster';

async function main() {
  const cluster = await Cluster.launch({
    maxConcurrency: 2,
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    puppeteerOptions: {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1920, height: 1080 },
    },
  });

  const task = async ({ page }) => {
    await page.goto('https://www.example.com', {
      waitUntil: 'domcontentloaded',
    });

    await page.screenshot({ path: '../example.png', type: 'png' });
  };

  try {
    await cluster.execute(task);
  } finally {
    await cluster.idle();
  }
}

main();
