const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const _ = require("lodash");
const chalk = require("chalk");
const SuperAd = require("./models/superAd");

// passport related:
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/leboncoin"
);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Session related:
app.use(
	expressSession({
		secret: "thereactor09",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection })
	})
);

// Activer `passport`
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // JSON.stringify
passport.deserializeUser(User.deserializeUser()); // JSON.parse

// redirection to home : index
app.get("/offres/", function(req, res) {
	res.redirect("/");
});

// INDEX
app.get("/", function(req, res) {
	var query = {};
	var page = 1;
	log("page num begining", page);
	if (req.query.ad_type) {
		query.ad_type = req.query.ad_type;
	}

	if (!isNaN(parseInt(req.query.page))) {
		page = req.query.page;
	}
	var nbPerPage = 5;

	log("page num", page);
	SuperAd.find(query).count(function(err, count) {
		log("count", count);
		log("number of pages: ", count / nbPerPage);
		SuperAd.find(query, function(err, ads) {
			if (!err) {
				res.render("home.ejs", {
					ads: ads,
					ad_type: query.ad_type,
					page: page,
					total_pages: Math.ceil(count / nbPerPage),
					current_user: req.user || null
				});
			} else {
				res.send("something went wrong when saving: \n" + showErrors(err));
			}
		})
			.limit(nbPerPage)
			.skip(nbPerPage * (page - 1));
	});
});

// SHOW
app.get("/annonce/:id", function(req, res) {
	SuperAd.findOne({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			var obj = ad;
			res.render("show.ejs", {
				id: obj._id,
				title: obj.title,
				description: obj.description,
				city: obj.city,
				price: obj.price,
				ad_type: obj.ad_type,
				photo: obj.photo,
				current_user: req.user || null
			});
		} else {
			res.send("An error occured: " + err);
		}
	});
});

// NEW:
app.get("/deposer/", function(req, res) {
	res.render("new.ejs", { current_user: req.user || null });
});

// CREATE:
app.post("/add_ad/", upload.single("photo"), function(req, res) {
	var current_user = req.isAuthenticated() ? req.user : null;
	var obj = new SuperAd({
		title: req.body.title,
		description: req.body.description,
		city: req.body.city,
		price: req.body.price,
		ad_type: req.body.ad_type,
		photo: req.body.photo,
		mail: req.body.mail,
		pseudo: req.body.pseudo,
		phone: req.body.phone,
		user_id: current_user._id
	});
	if (req.file) {
		obj.photo = req.file.filename;
	}

	obj.save(function(err, obj) {
		// var isAjaxRequest = req.xhr;
		if (err) {
			res.json({ status: "401", errors: showErrors(err) });
		} else {
			console.log("The ad was saved");
			res.redirect("/annonce/" + obj._id);
		}
	});
});

// EDIT:
app.get("/modification/:id", function(req, res) {
	var current_user = req.user || null;
	if (current_user) {
		SuperAd.findOne({ _id: req.params.id }, function(err, ad) {
			if (!err) {
				if (ad.user_id == current_user._id.toString()) {
					const obj = {
						id: ad._id,
						title: ad.title,
						description: ad.description,
						city: ad.city,
						price: ad.price,
						ad_type: ad.ad_type,
						photo: ad.photo,
						mail: ad.mail,
						pseudo: ad.pseudo,
						phone: ad.phone,
						current_user: current_user
					};
					res.render("edit.ejs", obj);
				} else {
					res.json({
						status: 401,
						error: "you are not authorized to change this page"
					});
				}
			} else {
				res.send("An error occured: " + err.errors);
			}
		});
	} else {
		res.redirect("/login");
	}
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
			res.send("An error occured: " + err.errors);
		}
	});
});

// DELETE:
app.get("/delete/:id", function(req, res) {
	SuperAd.findOneAndRemove({ _id: req.params.id }, function(err, ad) {
		if (!err) {
			res.redirect("/");
		} else {
			res.send("An error occured: " + err.errors);
		}
	});
});

// MON COMPTE:
app.get("/moncompte/", function(req, res) {
	var current_user = req.isAuthenticated() ? req.user : null;
	if (current_user) {
		var query = {
			user_id: current_user._id.toString()
		};

		SuperAd.find(query, function(err, ads) {
			if (!err) {
				res.render("moncompte", {
					ads: ads,
					current_user: current_user
				});
			} else {
				res.send("something went wrong :" + showErrors(err));
			}
		});
	} else {
		res.redirect("/login");
	}
});

// REGISTER:
app.get("/register", function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/moncompte");
	} else {
		res.render("register", { current_user: req.user || null });
	}
});

app.post("/register", function(req, res) {
	// Créer un utilisateur, en utilisant le model defini
	// Nous aurons besoin de `req.body.username` et `req.body.password`
	console.log("\n \n Req body :", req.body, "\n \n");
	User.register(
		new User({
			username: req.body.username,
			mail: req.body.mail,
			phone: req.body.phone
			// D'autres champs peuvent être ajoutés ici
		}),
		req.body.password, // password will be hashed
		function(err, user) {
			if (err) {
				console.log(err);
				return res.render("register", { current_user: req.user || null });
			} else {
				passport.authenticate("local")(req, res, function() {
					res.redirect("/moncompte");
				});
			}
		}
	);
});

// LOGIN:
app.get("/login", function(req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/moncompte");
	} else {
		res.render("login", { current_user: req.user || null });
	}
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/moncompte",
		failureRedirect: "/login"
	})
);

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
	console.log("Server started");
});

function showErrors(err) {
	var table = Object.keys(err.errors);
	return table.map(element => ({ [element]: err.errors[element].message }));
}

function log(string, value) {
	if (typeof value === "object") {
		var display = JSON.stringify(value);
	} else {
		var display = value;
	}

	console.log(chalk.yellow(`\n \n ${string} : \n ${display} \n`));
}
