import channelData from "../models/newsChannelCategory.js";
import News from "../models/newsSchema.js";
import {
  findFromNewsWithChannelId,
  findFromChannelData,
  findFromChannelAndNews,
} from "../utils/dbHelpers.js";

const getChannels = async (req, res) => {
  if (req.query.dataStatus === "halfData") {
    try {
      let channels = await findFromChannelAndNews(channelData, News);
      res.status(200).json(channels);
    } catch (err) {
      console.error(err);
      next(err);
    }
  } else {
    try {
      const channels = await findFromChannelData(channelData);
      res.status(200).json(channels);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
};

const getAllNews = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const parametersCheck =
    req.params.channelname.length === 0 || req.params.channelname.length > 3;
  if (parametersCheck) {
  return res
    .status(400)
    .json({ message: "The requested name is not allowed to proceed" });
  }

  try {
    let channel = await findFromChannelData(
      channelData,
      req.params.channelname
    );

    if (channel === undefined) {
      return res
        .status(404)
        .json({ message: "requested name not found in database" });
    }

    try {
      await NewsArray(channel, page, limit, res);
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};



async function NewsArray(channel, page, limit, res) {
  let newsArray = await findFromNewsWithChannelId(
    News,
    channel._id,
    page,
    limit
  );
  res.status(200).json(newsArray);
}






export { getChannels, getAllNews };