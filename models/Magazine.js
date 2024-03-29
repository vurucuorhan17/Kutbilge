const mongoose = require("mongoose");

const MagazineSchema = mongoose.Schema({
    magazine_info: {
        type: String
    },
    magazine_link: {
        type: String
    },
    magazine_image: {
        type: String
    },
    magazine_pdf_link: {
        type: String
    }
});

module.exports = mongoose.model("magazines",MagazineSchema);