const express = require("express");
const router = express.Router();

const Categories = require("../models/Categories");
const Post = require("../models/Post");
const Magazine = require("../models/Magazine");

const path = require("path");
const BilateralCoop = require("../models/BilateralCoop");

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
    const { magazine_link, magazine_info, magazine_pdf_link } = req.body;
    
    try{
        const magazine_image  = req.files.magazine_image;
        const isFile = typeof req.files != null;
        if(isFile)
        {
            magazine_image.mv(path.resolve(__dirname, "../public/img/magazine_images", magazine_image.name));    
        }
    
        const magazine = await new Magazine({
            magazine_info,
            magazine_link,
            magazine_pdf_link,
            magazine_image: isFile ? `/img/magazine_images/${magazine_image.name}` : null
        });
    
        await magazine.save()
        .then(magazine => res.redirect("/admin"));        
    }
    catch(e){
        const magazine = await new Magazine({
            magazine_info,
            magazine_link,
            magazine_pdf_link,
            magazine_image:  null
        });
    
        await magazine.save()
        .then(magazine => res.redirect("/admin"));       
    }

});

router.get("/addBilateral",(req,res) => {
    res.render("admin/addBilateralCoops");
});


router.post("/addBilateral", async (req,res) => {

    const bilateral_coop_images = req.files.bilateral_coop_images;
    const bilateral_coop_caption = req.files.bilateral_coop_caption;

    const bilateralCoop = await new BilateralCoop({
        ...req.body
    });

    await bilateralCoop.save();

    
    if(Array.isArray(bilateral_coop_images))
    {
        bilateral_coop_images.map((file,i) => {
            file.mv(path.resolve(__dirname, "../public/img/bilateral_images", file.name));

            BilateralCoop.findByIdAndUpdate(bilateralCoop._id,{
                $push: {
                    bilateral_coop_images: `/img/bilateral_images/${file.name}`
                }
            }).then(result => console.log(result));
            
        });
    }
    else 
    {
        bilateral_coop_images.mv(path.resolve(__dirname, "../public/img/bilateral_images", bilateral_coop_images.name));

        BilateralCoop.findByIdAndUpdate(bilateralCoop._id,{
            $push: {
                bilateral_coop_images: `/img/bilateral_images/${bilateral_coop_images.name}`
            }
        }).then(result => console.log(result));
    }

    bilateral_coop_caption.mv(path.resolve(__dirname, "../public/img/bilateral_images", bilateral_coop_caption.name));

    BilateralCoop.findByIdAndUpdate(bilateralCoop._id,{
        bilateral_coop_caption: `/img/bilateral_images/${bilateral_coop_caption.name}`
    }).then();

    await bilateralCoop.save().then(param => res.redirect("/admin"));

});

module.exports = router;