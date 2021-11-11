import { AryNewsScraper, GeoNewsScraper, BolNewsScraper } from "./Scrapers.js";
import channelData from "../models/newsChannelCategory.js";
import News from "../models/newsSchema.js";

const scraperObject = {
  async NewsScraper(browser) {
    AryNewsTimer(browser);
    GeoNewsTimer(browser);
    BolNewsTimer(browser);
  },
};

function AryNewsTimer(browser) {
  AryNewsScraper(browser, channelData, News);
}

function BolNewsTimer(browser) {
  setTimeout(() => {
    BolNewsScraper(browser, channelData, News);
    console.log(
      "After Execution of bol news Scraper",
      new Date().toLocaleTimeString()
    );
  }, 60000);
}

function GeoNewsTimer(browser) {
  setTimeout(() => {
    GeoNewsScraper(browser, channelData, News);

    console.log(
      "After Execution of Geo news Scraper",
      new Date().toLocaleTimeString()
    );
  }, 30000);
}

export default scraperObject;
