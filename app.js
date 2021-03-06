const expres = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = expres();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

uri = "mongodb://localhost:27017/wikiDB";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const articleSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("article", articleSchema);

//////////////////////////Requests for All Articles///////////////////////////////

app
  .route("/articles")

  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundArticles);
        res.send(foundArticles);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save();
    console.log(newArticle);
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        console.log("successfully delete all the articles");
      } else {
        console.log(err);
      }
    });
  });

//////////////////////////Requests for a Specific Article///////////////////////////////

app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("sorry there was an error fetching an article", err);
      }
    });
  })

  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          console.log("successfully updated the article");
        } else {
          console.log(err);
        }
      }
    );
  });

app.listen(3000, () => {
  console.log("server is running and listening");
});
