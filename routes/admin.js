const express = require("express");
const router = express.Router();

const Categories = require("../models/Categories");
const Post = require("../models/Post");
const Magazine = require("../models/Magazine");

const path = require("path");

router.get("/",(req,res) => {
    res.render("admin/index");
});

router.get("/categories",(req,res) => {
    Categories.find({}).sort({$natural:-1}).then(categories => {
        res.render("admin/categories",{categories:categories});
    })
});

router.post("/categories",(req,res) => {
    Categories.create(req.body,(error,category) => {
        if(!error)
        {
            res.redirect("categories");
        }
    })
});

router.delete("/categories/:id",(req,res) => {
    Categories.remove({_id:req.params.id}).then(() => {
        res.redirect("/admin/categories");
    });
});

router.get("/posts",(req,res) => {
    Post.find({}).populate({path:"category",model:Categories}).sort({$natural:-1}).then(posts => {
        res.render("admin/posts",{posts:posts});
    })
    
});

router.delete("/posts/:id",(req,res) => {
    Post.remove({_id:req.params.id}).then(() => {
        res.redirect("/admin/posts");
    });
});

router.get("/posts/edit/:id",(req,res) => {
    
    Post.findOne({_id:req.params.id}).then(post => {
        Categories.find({}).then(categories => {
            res.render("admin/editpost",{post:post,categories:categories});
        });
    });
    
});

router.put("/posts/:id",(req,res) => {

    let postImage = req.files.post_image;

    postImage.mv(path.resolve(__dirname,"../public/img/postimages",postImage.name));

    Post.findOne({_id:req.params.id}).then(post => {
        post.title = req.body.title;
        post.content = req.body.content;
        post.category = req.body.category;
        post.date = req.body.date;
        post.post_image = `/img/postimages/${postImage.name}`;

        post.save().then(post => {
            res.redirect("/admin/posts");
        });

    });

});

router.get("/addMagazine",(req,res) => {
    res.render("admin/addMagazine");
});

router.post("/addMagazine",async (req,res) => {
    const { magazine_link, magazine_info } = req.body;
    const { magazine_image, magazine_file } = req.files;

    magazine_image.mv(path.resolve(__dirname, "../public/img/magazine_images", magazine_image.name));
    
    const isFile = typeof magazine_file != "undefined";

    if(isFile)
    {
        magazine_file.mv(path.resolve(__dirname, "../public/magazine_file", magazine_file.name));
    }

    const magazine = await new Magazine({
        magazine_info,
        magazine_link,
        magazine_image: `/img/magazine_images/${magazine_image.name}`,
        magazine_file: isFile ? `/magazine_file/${magazine_file.name}` : null
    });

    await magazine.save()
    .then(magazine => res.redirect("/admin"));

});

module.exports = router;