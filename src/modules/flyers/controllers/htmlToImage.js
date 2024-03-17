import puppeteer from "puppeteer";

export default async (html = "") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const content = await page.$("body");

/**
 
width: 1080,
height: 1080,
 */

  //I started to use this parameters to improme image generation.
  //
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1
  });
  const imageBuffer = await content.screenshot({ omitBackground: true });

  await page.close();
  await browser.close();
  
  console.log('Case 2 - Width  :', page.viewport().width);  // Width  : 800
  console.log('Case 2 - Height :', page.viewport().height); // Height : 600

  return imageBuffer;
};