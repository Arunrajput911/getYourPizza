const LocalStrategy= require('passport-local').Strategy
const User=require('../models/user');
const bcrypt = require('bcrypt');

function init(passport){
    
    // passport.use(new LocalStrategy(
    //     function(username, password, done) {
    //       User.findOne({ username: username }, function (err, user) {
    //         if (err) { return done(err); }
    //         if (!user) { return done(null, false); }
    //         if (!user.verifyPassword(password)) { return done(null, false); }
    //         return done(null, user);
    //       });
    //     }
    //   ));

   passport.use(new LocalStrategy({usernameField:'email'}, async (email,password,done) => 
   {
       //check if email exist
       const user = await User.findOne({email : email})
       if(!user){
           return done(null,false,{message:'No user with this mail'})
       }
        
       bcrypt.compare(password,user.password).then(match => {
           if(match){
               return done(null,user,{message:'Logged in succesfully'})
           }
           return done(null,false,{message:'Wrong username or password'})
       }).catch((err) => {

            return done(null,false,{message:'Something went wrong'})

       })
        
   }))
        passport.serializeUser((user,done)=>{
            done(null,user._id)
     })
        passport.deserializeUser((id,done) => {
            User.findById(id,(err,user) => {
                done(err,user)
            })
        })


}

module.exports = init