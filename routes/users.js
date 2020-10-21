const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get("/register",(req,res) => {
    res.render("site/register");
});

router.post("/register",(req,res) => {

    const pass = req.body.password;
    bcrypt.hash(pass,saltRounds,(err,hash) => {
        // console.log(hash);
        User.create({
            "username":req.body.username,
            "email":req.body.email,
            "password":hash
        }).then(user => {
            res.redirect("/users/login")
        });
    });
    

    // User.create(req.body,(err,user) => {
    //     const pass = req.body.password;
    //     req.session.sessionFlash = {
    //         type:"alert alert-info",
    //         message:"Kullanıcı başarılı bir şekilde oluşturuldu"
    //     };
    //     res.redirect("/users/login");
    // });
});

router.get("/login",(req,res) => {
    res.render("site/login");
});

router.post("/login",(req,res) => {
    const {username,password} = req.body;
    User.findOne({username},(error,user) => {
        if(user)
        {
            
            bcrypt.compare(password, user.password, function(err, result) {
                // result == true

                if (result === true)
                {
                    req.session.userId = user._id;
                    res.redirect("/");
                }
                else
                {
                    res.redirect("/users/login");
                }

            });
            
            // if(user.password === password)
            // {
            //     req.session.userId = user._id;
            //     res.redirect("/");
            // }
            // else
            // {
            //     res.redirect("/users/login");
            // }
        }
        else
        {
            res.redirect("/users/login");
        }
    });
});

router.get("/logout",(req,res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});


module.exports = router;
