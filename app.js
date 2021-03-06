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

app.listen(3000, () => {
  console.log("server is running and listening");
});
