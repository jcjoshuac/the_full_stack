
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash')

const aboutContent = "Just as Full Stack web developers handle everything from the Front End to the Back End, The Full Stack is a multidisciplinary blog that deals with everything from investing to technology. Feel free to email us at jcjoshuac@gmail.com for business development and partnership enquiries.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://jcjoshuac:test@cluster0.ozpqt.mongodb.net/fullstackDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  subject: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    subject: req.body.postSubject
  });


  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/subject/:requestedSubject", function(req, res){

const requestedSubject = req.params.requestedSubject;
const capitalizedSubject = _.capitalize(requestedSubject)

  Post.find({subject: capitalizedSubject}, function(err, posts){
    res.render("subject", {
      posts: posts,
      requestedSubject: requestedSubject,
      capitalizedSubject: capitalizedSubject
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started successfully");
});
