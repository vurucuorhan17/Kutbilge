const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = mongoose.Schema({
    title: { type:String, required:true},
    author: {type:Schema.Types.ObjectId,ref:"users"},
    content: { type:String, required:true},
    date: {type:Date, default:Date.now},
    news_images: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model("news",NewsSchema);