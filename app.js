//jshint esversion:6
const dotenv = require("dotenv")
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const nodemailer = require("nodemailer");
const {v4: uuidv4} = require("uuid");


dotenv.config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.use(session({
  secret: "Our littel secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/blogpostDB", {useNewUrlParser: true});


const postSchema = {
  title: String, 
  body: String
};

const Post = new mongoose.model("Post", postSchema);


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  verified: Boolean

});

const userVerificationSchema = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date

});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const UserVerification = new mongoose.model("UserVerification", userVerificationSchema);

 passport.use(User.createStrategy());
 //passport.serializeUser(User.serializeUser());
 //passport.deserializeUser(User.deserializeUser());
 passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
      done(err, user);
  });
});


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.APP_AUTHORIZEDREDIRECTURIS,
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

let isLoggedIn = false;
let postId;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS
  }
});

transporter.verify((error, success) => {
  if(error){
    console.log(error);
  } else{
    console.log("ready for messages");
  }
})

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if(!err){
      res.render("home", {startingContent: homeStartingContent, posts: posts});
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {about: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contact: contactContent});
});

app.get("/compose", function(req, res){
  
  res.render("adminLogin");
});



app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
 
  post.save(function(err){
    if (!err){
    res.redirect("/");
    }
    });
});

app.get("/post", function(req, res){

  Post.find({}, function(err, posts){
    if(!err){
      res.render("postsHome", {startingContent: homeStartingContent, posts: posts});
    }
  });
})


app.get("/posts/:_id", function(req, res){
  const id = req.params._id;
  postId = id;

  if(req.isAuthenticated()){
    Post.findOne({_id: id}, function(err, post){
          console.log(post);
          if(!err){
            if(post){
              res.render("post", {post: post});
            }
          } else{
            console.log("Not Match");
            res.redirect("/loginHome");
          }
  });
} else{
  res.render("loginHome");
}
    
});
  

app.get("/loginHome", function(req, res){
  res.render("loginHome");
});


app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', "email"] })
);

app.get('/auth/google/secrets', 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  //res.redirect('/secrets');
  res.redirect('/post')
  //isLoggedIn=true;
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/privacy", function(req,res){
  res.render("privacy");
});

app.get("/adminLogin", function(req, res){
  res.render("adminLogin");
});

app.post("/adminLogin", function(req, res){
  const username = req.body.username;
  const password = req.body.password;


  if(username === process.env.EMAIL){
    if(password === process.env.PASSWORD){
      res.render('compose');
    } else{
      res.redirect("/adminLogin");
    }

  } else{
    res.redirect("/adminLogin")
  }
 
});


app.post("/message", function(req, res){
  res.send("Sorry sending message feature is not implmented yet");
});



app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})


app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
      if(err){
          console.log(err);
          res.redirect("/register");
      } else{
          passport.authenticate("local")(req, res, function(){
              res.redirect('/posts/'+postId);
          });
      }
  });

  
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  const user = new User({
      username: req.body.username,
      password: req.body.passport
  });

  req.login(user, function(err){
      if(err){
          console.log(err);
          const errorMessage = true;
          res.redirect("/login", {errorMessage: errorMessage});
      } else{
          passport.authenticate("local")(req, res, function(){
              res.redirect('/posts/'+postId);
              
          });
      }
  });
});




app.get("/register", function(req, res){
  res.render("register");
});


let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});

//https://warm-meadow-88432.herokuapp.com/
//http://localhost:3000/auth/google/secrets
