const express = require("express");
const app = express();
app.use(express.static("public"));

const ejs = require("ejs");
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require("mongoose");
const { title } = require("process");
mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = mongoose.Schema({
    title: String,
    content : String
});

const Article = new mongoose.model("Article", articleSchema);
const item1 = new Article({
    title : "Rest Full Api Project",
    content : "Learning rest full api"
});

//item1.save();

app.get("/", function(req, res){
    res.send("REST Learning");
});

/////////////////// Request for all articles  ///////////////////////
app.route("/articles")

.get(function(req, res){

    Article.find({}, function(err, articles){

        if(!err){
            res.send(articles);
        }else{
            res.send(err);
        }
    });
})
.post(function(req, res){

    newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Post request successfully completed");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){

    Article.deleteMany(function(err){
        if(!err){
            res.send("Data deleted");
        }else{
            res.send(err);
        }
    });
});


/////////////////// Request for specific articles  ///////////////////////

app.route("/articles/:articleTitle")
.get(function(req, res){

    Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article match found");
        }
    });
})
.put(function(req, res){
    Article.updateOne(
        {title : req.params.articleTitle},
        {title : req.body.title, content : req.body.content},
        function(err){
            if(!err){
                res.send("Updated successfully by PUT method");
            }else{
                res.send(err);
            }
        }
    );
})
.patch(function(req, res){
    Article.updateOne(
        {title : req.params.articleTitle},
        {$set : req.body},
        function(err){
            if(!err){
                res.send("Updated successfully by PATCH method");
            }else{
                res.send(err);
            }
        }
    );   
})
.delete(function(req,res){
    Article.deleteOne({title : req.params.articleTitle}, function(err){
        if(!err){
            res.send("Data deleted");
        }else{
            res.send(err);
        }
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
