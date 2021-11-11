import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const newsSchema = new Schema({

    newsTitle:{
        type: String,
    },

    newsLink:{
        type:String,
    },

    newsImage:{
        type: String,
    },

    newsDescription:{
        type:String
    },

    nameOfChannel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channelDatas',
        required: true,
    }

},
    {
        timestamps:true
    }
)

const News = mongoose.model('News',newsSchema);

export default  News;