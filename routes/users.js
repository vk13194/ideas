const express = require('express');
const router = express.Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

//login route
router.get('/login', (req, res) => {
    res.render('users/login');
    
});
//login post
router.post('/login', (req, res, next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res, next);
})
//user login  register
router.get('/register', (req, res) => {
    res.render('users/register');
    
});
router.post('/register', (req, res) => {
    let errors=[];

    if(req.body.password != req.body.password2){
        errors.push({text: "password do not match"});
    }
    if(req.body.password.length <4){
        errors.push({text: "password  must be at least 4"});
    }
    
    if(errors.length >0){
        res.render('users/register', {
            errors: errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
            
        });
    } else{
        User.findOne({email:req.body.email})
        .then(user =>{
            if(user){
             req.flash('error_msg', 'email all ready register');
             res.redirect('/users/login');
            }else{
                const newUser = new User ({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                } )
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        newUser.save()
                        .then(user =>{
                            req.flash('success_msg', 'you are register');
                            res.redirect('/users/login');
                        })
                        .catch(err =>{
                            console.log(err);
                            return
                        })
                    })
                })

            }
        })
        
    }
    
    
});

//logout
router.get('/logout', (req, res)=>{
     req.logout();
     req.flash('success_msg', 'you are logout');
     res.redirect('/users/login');
})
module.exports= router;