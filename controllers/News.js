import News from "../models/newsSchema.js";
import {
  findFromNews,
  findFromNewsWithId,
  DeleteFromNewsWithId,
} from "../utils/dbHelpers.js";




const getNews = async function (req, res) {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
    let newsArray = await findFromNews(News, page, limit);
    res.status(200).json(newsArray);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

const getOneNews = async function (req, res) {
  try {
    let result = await findFromNewsWithId(News, req.params.newsId);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};


const deleteNews = async function (req, res) {
    try {
      let result = await DeleteFromNewsWithId(News, req.params.newsId);
  
      if(result.deletedCount > 0){
        res
        .status(200)
        .json({ message: "News Deleted", deletedCount: result.deletedCount });
        return;
      }
        res
        .status(404)
        .json({ message: "News not Found" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }

export { getNews, getOneNews, deleteNews };
