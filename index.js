const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const _ = require("lodash");
const chalk = require("chalk");
const validations = require("./public/js/validations.js");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/leboncoin");

const superAdSchema = mongoose.Schema(validations);

const SuperAd = mongoose.model("SuperAd", superAdSchema);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// redirection to home : index
app.get("/offres/", function(req, res) {
	res.redirect("/");
});

// INDEX
app.get("/", function(req, res) {
	var query = {};
	if (req.query.ad_type) {
		query.ad_type = req.query.ad_type;
	}
	console.log("Query in query :", req.query.ad_type);
	console.log("Query :", query);
	SuperAd.find(query, function(err, ads) {
		if (!err) {
			res.render("home.ejs", {
				ads: ads
			});
		} else {
			res.send("something went wrong when saving: \n" + showErrors(err));
		}
	});
});

// SHOW
app.get("/annonce/:id", function(req, res) {
	SuperAd.findOne({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			console.log("ad :", ad);
			var obj = ad;
			res.render("show.ejs", {
				id: obj._id,
				title: obj.title,
				description: obj.description,
				city: obj.city,
				price: obj.price,
				ad_type: obj.ad_type,
				photo: obj.photo
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
	console.log("\n \n Req body : ", req.body, "\n \n");
	var obj = new SuperAd({
		title: req.body.title,
		description: req.body.description,
		city: req.body.city,
		price: req.body.price,
		ad_type: req.body.ad_type,
		photo: req.body.photo,
		mail: req.body.mail,
		pseudo: req.body.pseudo,
		phone: req.body.phone
	});
	if (req.file) {
		obj.photo = req.file.filename;
	}

	console.log("\n \n Obj to save : ", obj, "\n \n");

	obj.save(function(err, obj) {
		// var isAjaxRequest = req.xhr;
		console.log(err.errors);
		if (err) {
			console.log("Errors ..........");
			// isAjaxRequest
			// 	? res.json({ status: "401", errors: showErrors(err) })
			// 	:
			// res.render("new.ejs", { errors: showErrors(err) });
			res.json({ status: "401", errors: showErrors(err) });
		} else {
			console.log("The ad was saved :" + obj);
			// isAjaxRequest
			// 	? res.json(JSON.stringify({ status: "200" }))
			// 	:
			res.redirect("/annonce/" + obj._id);
		}
	});
});

// EDIT:
app.get("/modification/:id", function(req, res) {
	SuperAd.findOne({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			console.log("ad in modif :", ad);
			res.render("edit.ejs", {
				id: ad._id,
				title: ad.title,
				description: ad.description,
				city: ad.city,
				price: ad.price,
				ad_type: ad.ad_type,
				photo: ad.photo,
				mail: ad.mail,
				pseudo: ad.pseudo,
				phone: ad.phone
			});
		} else {
			console.log("An error occured: " + err);
		}
	});
});

// UPDATE:
app.post("/change_ad/:id", upload.single("photo"), function(req, res) {
	var obj = req.body;
	if (req.file) {
		obj.photo = req.file.filename;
	}
	SuperAd.findOneAndUpdate({ _id: req.params.id }, obj, { new: true }, function(
		err,
		ad
	) {
		if (!err) {
			console.log("The ad was updated :" + ad);
			res.redirect("/annonce/" + ad._id);
		} else {
			console.log("An error occured: " + err);
		}
	});
});

// DELETE:
app.get("/delete/:id", function(req, res) {
	SuperAd.findOneAndRemove({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			res.redirect("/");
		} else {
			console.log("An error occured: " + err);
		}
	});
});

app.listen(3000, function() {
	console.log("Server started");
});

function showErrors(err) {
	var table = Object.keys(err.errors);
	return table.map(element => ({ [element]: err.errors[element].message }));
}
