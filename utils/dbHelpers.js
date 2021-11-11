async function findFromNewsWithId(model, newsId) {
  let result = await model
    .findById({ _id: newsId }, "-__v -updatedAt ")
    .populate("nameOfChannel", "nameOfChannel");

  return result;
}

async function findFromNews(model, page, limit) {
  const startIndex = (page - 1) * limit;

  let results = await paginate(page, limit, model);

  let result = await model
    .find({}, "-__v -updatedAt -nameOfChannel")
    .limit(limit)
    .skip(startIndex);

  results.result = result;

  return results;
}

async function findFromNewsWithChannelId(model, channelId, page, limit) {
  const startIndex = (page - 1) * limit;

  let results = await paginate(page, limit, model);

  let result = await model
    .find({ nameOfChannel: channelId }, "-__v -updatedAt")
    .limit(limit)
    .skip(startIndex);

  results.result = result;

  return results;
}

async function paginate(page, limit, model) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let results = {};

  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
      limit: limit,
    };
  }

  if (endIndex < (await model.countDocuments())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  return results;
}

async function findFromChannelData(model, nameOfChannel) {
  let result;
  if (nameOfChannel !== undefined) {
    result = await model.find({ nameOfChannel }, "_id");
    return result[0];
  }
  result = await model.find({}, "-__v -createdAt -updatedAt");
  return result;
}

async function insertManyIntoNews(model, records) {
  let news = await model.insertMany(records);
  return news;
}

async function DeleteFromNewsWithId(model, newsId) {
  let deletedRecord = await model.deleteOne({ _id: newsId });
  return deletedRecord;
}

async function findFromChannelAndNews(modelChannel, modelNews) {
  const channels = await findFromChannelData(modelChannel);

  let NewsObj = [];

  for (let channel of channels) {
    let totalNoOfNews = await modelNews
      .find({ nameOfChannel: channel })
      .countDocuments();

    let lastNewsDateTime = await modelNews
      .findOne({ nameOfChannel: channel }, "createdAt")
      .sort({ createdAt: -1 });

    let test = {
      _id: channel._id,
      nameOfChannel: channel.nameOfChannel,
      totalNoOfNews,
      lastNewsDateTime,
    };

    NewsObj.push(test);
  }
  return NewsObj;
}

export {
  findFromChannelData,
  insertManyIntoNews,
  findFromNewsWithChannelId,
  findFromNews,
  findFromNewsWithId,
  DeleteFromNewsWithId,
  findFromChannelAndNews,
};
