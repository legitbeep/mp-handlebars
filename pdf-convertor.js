const puppeteer = require("puppeteer");

const generatePDF = async (html) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-accelerated-2d-canvas",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });
  page.emulateMediaType("screen");

  // Set margin (in inches) for each page
  // const marginInches = 0.5; // You can adjust this value as needed
  // const marginPixels = marginInches * 96; // 1 inch = 96 pixels (for A4 format)

  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
    // margin: {
    //   top: marginPixels,
    //   bottom: marginPixels,
    // },
  });
  await browser.close();
  return buffer;
};
module.exports = { generatePDF };
