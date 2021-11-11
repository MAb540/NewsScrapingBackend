import { findFromChannelData, insertManyIntoNews } from "../utils/dbHelpers.js";

async function AryNewsScraper(browser, channelData, News) {
  const page = await browser.newPage();
  const channelName = await findFromChannelData(channelData, "Ary");

  try {
    await page.goto("https://arynews.tv/en/", {
      waitUntil: "load",
      timeout: 0,
    });
  } catch (err) {
    console.log(err);
  }


  try {
    await page.waitForSelector(
      "div.tdc-row.stretch_row_1200.td-stretch-content",
      {
        visible: true,
      }
    );
  } catch (err) {
    console.error(err);
  }

  const topNews = await topNewsHelper(page, channelName);

  const newsList1 = await page.evaluate((channelName) => {
    let newsObj = document.querySelectorAll("#tdi_75 > div");

    let newsArray = Object.values(newsObj).slice(1, 6);

    let nList = newsArray.map((news) => {
      let newsDiv = news.querySelector(
        "div > div.td-image-container > div.td-module-thumb > a"
      );
      let newsLink = newsDiv.getAttribute("href");
      let newsTitle = newsDiv.getAttribute("title");
      let newsImage = newsDiv
        .querySelector("span")
        .getAttribute("data-img-url");

      return {
        newsLink,
        newsTitle,
        newsImage,
        nameOfChannel: channelName._id,
      };
    });

    return nList;
  }, channelName);

  const newsList2 = await page.evaluate((channelName) => {
    let mainNewsDiv = document.querySelector("#tdi_141");

    let newsDivs = mainNewsDiv.getElementsByClassName(
      "td_module_flex td_module_flex_1 td_module_wrap td-animation-stack"
    );

    let newsArray = Object.values(newsDivs);

    let nnList = newsArray.map((news) => {
      let newsDiv = news.querySelector("div > div > div > a");

      let newsTitle = newsDiv.getAttribute("title");
      let newsLink = newsDiv.getAttribute("href");
      let newsImage = newsDiv
        .querySelector("span")
        .getAttribute("data-img-url");

      return {
        newsLink,
        newsTitle,
        newsImage,
        nameOfChannel: channelName._id,
      };
    });
    return nnList;
  }, channelName);

  await page.close();

  const newsList = [topNews, ...newsList1,...newsList2];
  

  try {
    await insertManyIntoNews(News, newsList);
  } catch (err) {
    console.log(err);
  }
}

async function topNewsHelper(page, channelName) {
  return await page.evaluate((channelName) => {
    let newLink = document.querySelector(
      "#tdi_75 > div.td_module_flex.td_module_flex_1.td_module_wrap.td-animation-stack > div > div.td-image-container > div > a"
    );
    let imgSrc = newLink.querySelector("span").getAttribute("data-img-url");

    return {
      newsLink: newLink.getAttribute("href"),
      newsTitle: newLink.getAttribute("title"),
      newsImage: imgSrc,
      nameOfChannel: channelName._id,
    };
  }, channelName);
}

async function GeoNewsScraper(browser, channelData, News) {
  const page = await browser.newPage();

  const channelName = await findFromChannelData(channelData, "Geo");

  try {
    await page.goto("https://www.geo.tv/", {
      waitUntil: "networkidle2",
    });
  } catch (err) {
    console.log("some error occured : ", err.stack);
  }

  try {
    await page.waitForSelector(".home_main_content", {
      visible: true,
    });
  } catch (err) {
    console.log(err);
  }

  let news1 = await page.$$eval(
    ".home_main_content > div.m_c_left > ul > li",
    (li, channelName) => {
      function helper(l, path, attribute) {
        return l.querySelector(path).getAttribute(attribute);
      }

      const nn = li.map((l) => {
        let newsLink = l.querySelector(".heading > a").getAttribute("href");
        let newsImage = helper(l, ".m_pic > a > img", "data-src");
        let newsTitle = helper(l, ".heading > a", "title");
        let newsDescription = l.querySelector(".m_except > p").textContent;
        return {
          newsLink,
          newsTitle,
          newsImage,
          newsDescription,
          nameOfChannel: channelName._id,
        };
      });
      return nn;
    },
    channelName
  );

  const news2 = await page.$$eval(
    ".m_c_right > ul > li",
    (li, channelName) => {
      function helper(l, path, attribute) {
        return l.querySelector(path).getAttribute(attribute);
      }

      const newsList = li.map((l) => {
        let newsLink = helper(l, "article > a", "href");
        let newsTitle = helper(l, "article > a", "title");
        let newsImage = helper(
          l,
          "article > .m_pic > a > picture > img",
          "data-src"
        );

        return {
          newsLink,
          newsTitle,
          newsImage,
          nameOfChannel: channelName._id,
        };
      });
      return newsList;
    },
    channelName
  );

  await page.close();

  const newsList = [...news1, ...news2];

  try {
    await insertManyIntoNews(News, newsList);
  } catch (err) {
    console.log(err);
  }
}

async function BolNewsScraper(browser, channelData, News) {
  const page = await browser.newPage();

  const channelName = await findFromChannelData(channelData, "Bol");

  try {
    await page.goto("https://www.bolnews.com", {
      waitUntil: "networkidle2",
    });
  } catch (err) {
    console.log(err);
  }
  try {
    await page.waitForSelector(".col-lg-6", {
      visible: true,
    });
  } catch (err) {
    console.log(err);
  }

  const topNews1 = await page.$eval(
    "div.bigbox.borderbtm > a",
    (a, channelName) => {
      function helper(a, childNum, tagName) {
        return a.children[childNum].getElementsByTagName(tagName)[0];
      }
      let newsLink = a.href;
      let { src: newsImage } = helper(a, 0, "img");

      let { textContent: newsTitle } = helper(a, 1, "h2");
      let { textContent: newsDescription } = helper(a, 1, "p");
      return {
        newsLink,
        newsTitle,
        newsDescription,
        newsImage,
        nameOfChannel: channelName._id,
      };
    },
    channelName
  );

  const topNews2 = await page.$$eval(
    ".col-lg-6 > div.catesmallbox > a",
    (a, channelName) => {
      function helper(aa, childNum, tagName) {
        return aa.firstElementChild.children[childNum].getElementsByTagName(
          tagName
        )[0].textContent;
      }
      const newsList = a.map((aa) => {
        let newsLink = aa.href;
        let newsImage = aa.firstElementChild.children[0]
          .getElementsByTagName("img")[0]
          .getAttribute("data-src");

        let newsTitle = helper(aa, 1, "h3");
        let newsDescription = helper(aa, 1, "p");
        return {
          newsLink,
          newsTitle,
          newsDescription,
          newsImage,
          nameOfChannel: channelName._id,
        };
      });
      return newsList;
    },
    channelName
  );

  const topNews3 = await page.$$eval(
    ".col-lg-3 > div.horizpost > a",
    (a, channelName) => {
      function helper(aa, childNum, tagName) {
        return aa.children[childNum].getElementsByTagName(tagName)[0]
          .textContent;
      }

      const newsList = a.map((aa) => {
        let newsLink = aa.href;
        let newsImage = aa.children[0]
          .getElementsByTagName("img")[0]
          .getAttribute("data-src");

        let newsTitle = helper(aa, 1, "h5");
        let newsDescription = helper(aa, 1, "p");
        return {
          newsLink,
          newsTitle,
          newsDescription,
          newsImage,
          nameOfChannel: channelName._id,
        };
      });

      return newsList;
    },
    channelName
  );
  await page.close();
  await browser.close();

  let newsList = [topNews1, ...topNews2, ...topNews3];

  try {
    await insertManyIntoNews(News, newsList);
  } catch (err) {
    console.log(err);
  }
}

export { AryNewsScraper, GeoNewsScraper, BolNewsScraper };
