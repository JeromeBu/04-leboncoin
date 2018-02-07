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

const seed = new SuperAd({
	title: "Tom",
	description:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro expedita illo possimus repellendus itaque dolorem illum, veritatis omnis reprehenderit ratione a sit, nam earum labore consectetur minus nulla doloremque.",
	city: "Paris",
	price: 25,
	ad_type: "offer",
	photo: "73285e1f2bb198b4afc9c49b1c425a5f"
});

// seed.save(function(err, obj) {
// 	if (err) {
// 		console.log("something went wrong when saving");
// 	} else {
// 		console.log("The ad was saved :" + obj);
// 	}
// });

// redirection to home : index
app.get("/offres/", function(req, res) {
	res.redirect("/");
});

// INDEX
app.get("/", function(req, res) {
	SuperAd.find({}, function(err, ads) {
		if (!err) {
			res.render("home.ejs", {
				ads: ads
			});
		} else {
			console.log("Full errors: ");
			console.log(err.errors);
			console.log("errors :", showErrors(err));
			res.send("something went wrong when saving: \n" + showErrors(err));
		}
	});
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
				ad_type: ad.ad_type,
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
	if (req.file) {
		obj.photo = req.file.filename;
	}

	obj.save(function(err, obj) {
		if (err) {
			console.log("Full errors: ");
			console.log(err.errors);
			console.log("errors :", showErrors(err));
			res.send("Error: \n" + JSON.stringify(showErrors(err)));
		} else {
			console.log("The ad was saved :" + obj);
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
				photo: ad.photo
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
