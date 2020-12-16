const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const path = require("path");
const Categories = require("../models/Categories");
const User = require("../models/User");

router.get("/new",(req,res) => {
    
    if(!req.session.userId)
    {
        res.redirect("/users/login");
    }
    Categories.find({}).then(categories => {
        res.render("site/addpost",{categories:categories});
    });
    
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search",(req,res) => {
    if(req.query.look)
    {
        const regex = new RegExp(escapeRegex(req.query.look), 'gi');
        Post.find({"title":regex}).populate({path:"author",model:User}).sort({$natural:-1}).then(posts => {
            Categories.aggregate([
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
            ]).then(categories => {
                res.render("site/symposium",{posts:posts,categories:categories});
            });
        });
    }
})

router.get("/category/:categoryId",(req,res) => {
    Post.find({category:req.params.categoryId}).populate({path:"category",model:Categories}).populate({path:"author",model:User}).then(posts => {
        Categories.aggregate([
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
        ]).then(categories => {
            res.render("site/symposium",{posts:posts,categories:categories});
        });
    });
});

router.get("/:id",(req,res) => {
    Post.findById(req.params.id).populate({path:"author",model:User}).then(post => {
        Categories.aggregate([
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
        ]).then(categories => {
            Post.find({}).populate({path:"author",model:User}).sort({$natural:-1}).then(posts => {
                res.render("site/post",{post:post,categories:categories,posts:posts});
            });
        });
        
    });
});

router.post("/test",async (req,res) => {
    // res.send("TEST OK");

    const post_images = req.files.post_images;

    const post = await new Post({
        ...req.body
    });

    await post.save();

    if(Array.isArray(post_images))
    {
        post_images.map((file,i) => {
            file.mv(path.resolve(__dirname, "../public/img/postimages", file.name));

            Post.findByIdAndUpdate(post._id,{
                $push: {
                    post_images: `/img/postimages/${file.name}`
                }
            }).then(result => console.log(result));
            
        });
    }
    else 
    {
        post_images.mv(path.resolve(__dirname, "../public/img/postimages", post_images.name));

        Post.findByIdAndUpdate(post._id,{
            $push: {
                post_images: `/img/postimages/${post_images.name}`
            }
        }).then(result => console.log(result));
    }

    await post.save().then(param => res.redirect("/admin"));

});

module.exports = router;