const mongoose = require("mongoose");

const IndexSchema = mongoose.Schema({
    
    birim: {type:String,required:true},
    birim_image: {type:String,required:true},
    birim_aciklama: {type:String,required:true},
    lider: {type:String,required:true},
    lider_aciklama: {type:String,required:true},
    lider_resim: {type:String,required:true}
});

module.exports = mongoose.model("Index",IndexSchema);