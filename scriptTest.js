import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  try {
    await page.goto("https://arynews.tv/en/", {
      waitUntil: "networkidle2",
    });
  } catch (err) {
    console.log(err);
  }

  await page.waitForSelector("div.row.vc_row.vc_inner.vc_row-fluid", {
    visible: true,
  });

  const topNews = await page.$eval(
    "article > .item-inner > .featured.clearfix > a",
    (a) => {
      let link = a.getAttribute("href");
      let titleOfNews = a.getAttribute("title");
      let imageNews = JSON.parse(a.getAttribute("data-bs-srcset"));

      // extracting url of image bases on size from object imageNews
      let imageOfNews = `${imageNews.baseurl}${imageNews.sizes["750"]}`;

      return { link, titleOfNews, imageOfNews };
    }
  );

  const newsList1 = await page.$$eval(
    "div.listing.listing-blog.listing-blog-1.clearfix.columns-1.columns-1 > article",
    (articles) => {
      function helper(article, path, attribute) {
        return article.querySelector(path).getAttribute(attribute);
      }

      const nnList = articles.map((article) => {
        let link = helper(article, "div > div.featured.clearfix > a", "href");
        let titleOfNews = helper(
          article,
          "div > div.featured.clearfix > a",
          "title"
        );
        let imageNews = JSON.parse(
          helper(article, "div > div.featured.clearfix > a", "data-bs-srcset")
        );
        let descripOfNews = article
          .querySelector("div > div.post-summary")
          .textContent.substr(1);

        let imageOfNews = `${imageNews.baseurl}${imageNews.sizes["750"]}`;
        return { link, titleOfNews, descripOfNews, imageOfNews };
      });
      return nnList;
    }
  );

  const newsList2 = await page.$$eval(
    "div.listing.listing-thumbnail.listing-tb-2.clearfix.scolumns-2.bsw-5 > article",
    (articles) => {
      const nnList = articles.map((article) => {
        let link = article
          .querySelector("div > div.featured > a")
          .getAttribute("href");
        let titleOfNews = article
          .querySelector("div > div.featured > a")
          .getAttribute("title");
        let imageNews = JSON.parse(
          article
            .querySelector("div > div.featured > a")
            .getAttribute("data-bs-srcset")
        );

        let imageOfNews = `${imageNews.baseurl}${imageNews.sizes["750"]}`;
        return { link, titleOfNews, imageOfNews };
      });

      return nnList;
    }
  );

  const newsList = [topNews, ...newsList1, ...newsList2];

  console.log(newsList);

  await browser.close();
})();

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto("https://www.geo.tv/", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".home_main_content", {
    visible: true,
  });

    const news1 = await page.$$eval(".m_c_left > ul > li", (li) => {
      function helper(l, path, attribute) {
        return l.querySelector(path).getAttribute(attribute);
      }

      const newsList = li.map((l) => {
        let link = helper(l, ".heading > a", "href");
        let imageOfNews = helper(l, ".m_pic > a > img", "data-src");
        let titleOfNews = helper(l, ".heading > a", "title");
        let descripOfNews = l.querySelector(".m_except > p").textContent;

        return { link, titleOfNews,descripOfNews, imageOfNews   };
      });
      return newsList;
    });

  const news2 = await page.$$eval(".m_c_right > ul > li", (li) => {
    function helper(l, path, attribute) {
      return l.querySelector(path).getAttribute(attribute);
    }

    const newsList = li.map((l) => {
      let link = helper(l, "article > a", "href");
      let titleOfNews = helper(l, "article > a", "title");
      let imageOfNews = helper(
        l,
        "article > .m_pic > a > picture > img",
        "data-src"
      );

      return { link, titleOfNews, imageOfNews };
    });
    return newsList;
  });

  const newsList = [...news1,...news2];

  console.log(newsList);

  await browser.close();
})();

// (async () => {

//   const browser = await puppeteer.launch();

//   const page = await browser.newPage();

//   await page.goto("https://news.ycombinator.com", {
//     waitUntil: "networkidle2",
//   });

//   // await page.screenshot({path:'test.png'})
//   // await page.pdf({path: 'test.pdf',format: 'a4'});

//   await page.waitForSelector(".title", {
//     visible: true,
//   });

//   const data = await page.evaluate(() => {
//     const links = document.getElementsByClassName("storylink");

//     const urls = Array.from(links).map((l) => {
//       const link = l.href;
//       const value = l.textContent;

//       return { link, value };
//     });

//     return urls;
//   });

//   await browser.close();
// })();

// dunyanews scraping script

//   const topNews = await page.$eval('.mainSlider > .top_story',div =>{
//       let linkOfNews =  div.querySelector('a').getAttribute('href');
//       let imageOfNews =  div.querySelector('a > img').getAttribute('src');
//       let titleOfNews = div.querySelector('.ovrtexts > div > a > p').textContent;
//       let link = `https://dunyanews.tv/${linkOfNews.substr(11)}`; // removing /index.php/

//       return {link, titleOfNews ,imageOfNews}
//   })

//   const news = await page.$$eval('.mainSlider > div > .edwn > .edwn_inner',divs=>{

//       let newsList = divs.map(div =>{

//           let linkOfNews = div.querySelector('article > h2 > a').getAttribute('href');
//           let imageOfNews = div.querySelector('article > figure > a > img').getAttribute('src');
//           let titleOfNews = div.querySelector('article > h2 > a').textContent;
//           let descripOfNews = div.querySelector('article > div > p').textContent;
//           let link = `https://dunyanews.tv/${linkOfNews.substr(11)}`;

//           return {link,titleOfNews,descripOfNews,imageOfNews}

//       })
//       return newsList
//   })

// console.log(news);
