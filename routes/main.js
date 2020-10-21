const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Category = require("../models/Categories");
const User = require("../models/User");
const Index = require("../models/Index");
const Magazine = require("../models/Magazine");

router.get("/",(req,res) => {

        Post.find({}).sort({$natural:-1}).then(posts => {
            Category.find({}).then(categories => {
                res.render("site/index",{posts:posts,categories:categories});
            })
        });
        
});

router.get("/about",(req,res) => {
    res.render("site/about");
});

router.get("/symposiums",(req,res) => {

    const postPerPage = 4;
    const page = req.query.page || 1;

    Post.find({}).populate({path:"author",model:User}).sort({$natural:-1})
    .skip((postPerPage * page) - postPerPage)
    .limit(postPerPage)
    .then(posts => {

        Post.countDocuments().then(postCount => {
            Category.aggregate([
                {
                    $lookup:{
                        from:'posts',
                        localField:'_id',
                        foreignField: 'category',
                        as: 'posts'
                    }
                },
                {
                    $project:{
                        _id: 1,
                        name: 1,
                        num_of_posts: {$size:'$posts'}
                    }
                }
            ]).then((categories) => {
                res.render("site/symposium",{
                    posts:posts,
                    categories:categories,
                    current: parseInt(page),
                    pages: Math.ceil(postCount/postPerPage)
                });
            });
        });
        
    })
    
});

router.get("/management",(req,res) => {
    res.render("site/management");
});

router.get("/magazines",(req,res) => {
    Magazine.aggregate([
        {
            $match: {}
        }
    ])
    .then(magazines => {
        res.render("site/magazine",{magazines});
    });
});

module.exports = router;