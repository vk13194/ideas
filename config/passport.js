const LocalStrategy =require('passport-local').Strategy;
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');


//model
const User = mongoose.model('users');

module.exports= function(passport){
passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done)=>{
    User.findOne({
        email: email
    }).then(user =>{
        if(!user){
            return done(null, false, { message: 'no user found'});
        }
        bcrypt.compare(password, user.password, (err, ismatch)=>{
            if(err) throw err;
            if(ismatch){
               return done(null, user) 
            }else {
             return done(null, false, {message:'password incarrect'});
            }
        })
    })
}))
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}