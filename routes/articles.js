const express = require("express");
const router = express.Router();
const Article = require("./../models/article");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blog", {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	autoIndex: true,
});

router.get("/new", (req, res) => {
	res.render("articles/new", {
		article: { title: "", description: "", markdown: "" },
	});
});

router.get("/:slug", async (req, res) => {
	console.log(req.params);
	const article = await Article.findOne({ slug: req.params.slug });
	if (!article) res.redirect("/");
	res.render("articles/show", { article });
});

router.post("/", async (req, res, next) => {
	console.log(req.body);
	req.article = new Article();
  console.log({New: req.article})
	next();
}, saveArticleAndRedirect('new'));

router.put("/:id", async (req, res, next) => {
	console.log(req.body);
	req.article = await Article.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'));

router.get("/edit/:id", async (req, res) => {
	console.log(req.params);
	const article = await Article.findById(req.params.id);
	res.render("articles/edit", { article });
});

function saveArticleAndRedirect(path) {
	return async (req, res) => {
    let article = req.article;
		article.title = req.body.title;
		article.description = req.body.description;
		article.markdown = req.body.markdown;
		try {
			article = await article.save();
			res.redirect(`/articles/${article.slug}`);
		} catch (e) {
			console.log(res.body = e);
			res.render(`articles/${path}`, { article: article });
		}
	};
}

router.delete("/:id", async (req, res) => {
	await Article.findByIdAndDelete(req.params.id);
	res.redirect("/");
});

module.exports = router;
