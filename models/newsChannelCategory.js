import mongoose from "mongoose";

const Schema = mongoose.Schema;

const channelDataSchema = new Schema(
  {
    nameOfChannel: {
      type: String,
      minLength: 2,
      maxLength: 10,
    },

    imgageOfChannel: {
      type: String,
    },

    descriptionOfChannel: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const channelData = mongoose.model("channelDatas", channelDataSchema);

export default channelData;
