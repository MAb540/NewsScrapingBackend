import pageScraper from "./pageScraper.js";

import puppeteer from "puppeteer";

async function scraperController() {
  try {
    console.log("Launching the browser");

    let browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });

    await pageScraper.NewsScraper(browser);
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
}

export default scraperController;
