import puppeteer from "puppeteer";

export default async (html = "") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const content = await page.$("body");

  //I started to use this parameters to improme image generation.
  await page.setViewport({
    width: 1440,
    height: 900,
    deviceScaleFactor: 2
  });
  const imageBuffer = await content.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();

  return imageBuffer;
};