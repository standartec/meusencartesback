import puppeteer from "puppeteer";

export default async (html = "") => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const content = await page.$("body");

  // Ajuste as dimensões da viewport para gerar uma imagem menor
  await page.setViewport({
    width: 720, // Reduza a largura
    height: 720, // Reduza a altura
    deviceScaleFactor: 1
  });

  // Captura de tela em formato WebP
  const imageBuffer = await content.screenshot({ 
    omitBackground: true,
    type: 'webp',
    quality: 10 // Ajuste a qualidade da imagem (para WebP)
  });

  await page.close();
  await browser.close();
  
  console.log('Width  :', page.viewport().width);
  console.log('Height :', page.viewport().height);

  return imageBuffer;
};
