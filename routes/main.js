const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Category = require("../models/Categories");
const User = require("../models/User");
const Magazine = require("../models/Magazine");
const News = require("../models/News");
const BilateralCoop = require("../models/BilateralCoop");

router.get("/",(req,res) => {

        News.find({}).sort({$natural:-1}).then(news => {
            res.render("site/index",{news});
        });
        
});

router.get("/about",(req,res) => {
    res.render("site/about");
});

router.get("/symposiums",(req,res) => {

    Post.find({}).sort({$natural:-1})
    .then(posts => {
        res.render("site/symposium",{ posts });
    })
    
});

router.get("/news",(req,res) => {

    const postPerPage = 4;
    const page = req.query.page || 1;

    News.find({})
    .sort({$natural: -1})
    .skip((postPerPage * page) - postPerPage)
    .limit(postPerPage)
    .then((news) => {
        News.countDocuments()
        .then((newsCount) => {
            res.render("site/news",{
                news,
                current: parseInt(page),
                pages: Math.ceil(newsCount/postPerPage)
            });
        });

    });

});

router.get("/management",(req,res) => {
    res.render("site/management");
});

router.get("/magazines",(req,res) => {
    Magazine.find({}).sort({$natural: -1})
    .then(magazines => {
        res.render("site/magazine",{magazines});
    });
});


router.get("/bilateralcoops",(req,res) => {
    BilateralCoop.find({})
    .then((bilateralcoops) => {
        res.render("site/bilateralcoops",{bilateralcoops});
    })
});

router.get("/bilateralcoops/:id",(req,res) => {
    BilateralCoop.findById(req.params.id)
    .then((singleBilateral) => {
        res.render("site/singleBilateral",{singleBilateral});
    })
})

module.exports = router;