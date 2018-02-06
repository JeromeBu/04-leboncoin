const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const _ = require("lodash");
const chalk = require("chalk");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/leboncoin");

const superAdSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: String,
	city: String,
	price: Number,
	photo: String
});

const SuperAd = mongoose.model("SuperAd", superAdSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
// app.use(
// 	morgan(function(tokens, req, res) {
// 		var status = tokens.status(req, res);
// 		var statusColor =
// 			status >= 500
// 				? "red"
// 				: status >= 400 ? "yellow" : status >= 300 ? "cyan" : "green";

// 		return (
// 			chalk.reset(
// 				padRight(tokens.method(req, res) + " " + tokens.url(req, res), 30)
// 			) +
// 			" " +
// 			chalk[statusColor](status) +
// 			" " +
// 			chalk.reset(padLeft(tokens["response-time"](req, res) + " ms", 8)) +
// 			" " +
// 			chalk.reset("-") +
// 			" " +
// 			chalk.reset(tokens.res(req, res, "content-length") || "-")
// 		);
// 	})
// );

// function padLeft(str, len) {
// 	return len > str.length
// 		? new Array(len - str.length + 1).join(" ") + str
// 		: str;
// }
// function padRight(str, len) {
// 	return len > str.length
// 		? str + new Array(len - str.length + 1).join(" ")
// 		: str;
// }

const seed = new SuperAd({
	title: "Tom",
	description:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro expedita illo possimus repellendus itaque dolorem illum, veritatis omnis reprehenderit ratione a sit, nam earum labore consectetur minus nulla doloremque.",
	city: "Paris",
	price: 25,
	photo: "73285e1f2bb198b4afc9c49b1c425a5f"
});

// seed.save(function(err, obj) {
// 	if (err) {
// 		console.log("something went wrong when saving");
// 	} else {
// 		console.log("The ad was saved :" + obj);
// 	}
// });

// INDEX
app.get("/", function(req, res) {
	SuperAd.find({}, function(err, ads) {
		if (!err) {
			console.log("ads :", ads);
			res.render("home.ejs", {
				ads: ads
			});
		}
	});
});

// redirection to home : index
app.get("/offres/", function(req, res) {
	res.redirect("/");
});

// SHOW
app.get("/annonce/:id", function(req, res) {
	SuperAd.findOne({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			console.log("ad :", ad);
			res.render("show.ejs", {
				id: ad._id,
				title: ad.title,
				description: ad.description,
				city: ad.city,
				price: ad.price,
				photo: ad.photo
			});
		} else {
			console.log("An error occured: " + err);
		}
	});
});

// EDIT:
app.get("/modification/:id", function(req, res) {
	SuperAd.findOne({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			console.log("ad in modif :", ad);
			res.render("edit.ejs", {
				title: ad.title,
				description: ad.description,
				city: ad.city,
				price: ad.price,
				photo: ad.photo
			});
		} else {
			console.log("An error occured: " + err);
		}
	});
});

// NEW:
app.get("/deposer/", function(req, res) {
	res.render("new.ejs");
});

// CREATE:
app.post("/add_ad/", upload.single("photo"), function(req, res) {
	var obj = new SuperAd(req.body);
	obj.photo = req.file.filename;

	obj.save(function(err, obj) {
		if (err) {
			console.log("something went wrong when saving");
			res.send("something went wrong when saving");
		} else {
			console.log("The ad was saved :" + obj);
			res.redirect("/annonce/" + req.body.id);
		}
	});
});

app.listen(3000, function() {
	console.log("Server started");
});
