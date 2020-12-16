const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
    title: { type:String, required:true},
    author: {type:Schema.Types.ObjectId,ref:"users"},
    content: { type:String, required:true},
    date: {type:Date, default:Date.now},
    post_images: [
        {
            type: String
        }
    ],
    category: {type:Schema.Types.ObjectId,ref:"categories"},
    pdf_link: {
        type:String
    }
});

module.exports = mongoose.model("Post",PostSchema)