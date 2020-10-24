const express = require("express");
const router = express.Router();

const User = require("../models/User");
const News = require("../models/News");

const path = require("path");

router.get("/new",(req,res) => {
    
    if(!req.session.userId)
    {
        res.redirect("/users/login");
    }
    res.render("admin/addNews");
    
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search",(req,res) => {
    if(req.query.look)
    {
        const regex = new RegExp(escapeRegex(req.query.look), 'gi');
        News.find({"title":regex}).sort({$natural:-1}).then(news => {
            res.render("site/news",{news});
        });
    }
})


router.get("/:id",(req,res) => {
    News.findById(req.params.id).then(singleNews => {

        News.find({}).sort({$natural:-1}).then(news => {
            res.render("site/singleNews",{singleNews,news});
        });

    });
});

router.post("/addNews", async (req,res) => {

    const news_images = req.files.news_images;

    const news = await new News({
        ...req.body
    });

    await news.save();

    news_images.map((file,i) => {
        file.mv(path.resolve(__dirname, "../public/img/newsimages", file.name));

        News.findByIdAndUpdate(news._id,{
            $push: {
                news_images: `/img/newsimages/${file.name}`
            }
        }).then(result => console.log(result));
        
    });

    await news.save().then(param => res.redirect("/admin"));

});

module.exports = router;