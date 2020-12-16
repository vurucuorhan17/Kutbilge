const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BilateralCoopSchema = mongoose.Schema({
    title: { type:String, required:true},
    content: { type:String, required:true},
    date: {type:Date, default:Date.now},
    bilateral_coop_caption: {
        type: String
    },
    bilateral_coop_images: [
        {
            type: String
        }
    ]
});

module.exports = mongoose.model("bilateralcoops",BilateralCoopSchema);