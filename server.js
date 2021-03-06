const express = require('express');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const methodOverride = require('method-override');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use('/articles', articleRouter);

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({createdAt: 'desc'})
  console.log(articles)
  res.render('articles/index', {articles})
});

app.listen(4000);