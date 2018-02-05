const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });
const _ = require("lodash");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	morgan(":method :url :status :response-time ms - :res[content-length]")
);

const ads = [];

function getNewId() {
	var i = 0;
	ads.forEach(ad => {
		id = parseInt(ad.id);
		if (i < id) {
			i = id;
		}
	});
	return (i + 1).toString();
}

const seed = {
	id: 1,
	title: "Tom",
	description:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro expedita illo possimus repellendus itaque dolorem illum, veritatis omnis reprehenderit ratione a sit, nam earum labore consectetur minus nulla doloremque.",
	city: "Paris",
	price: 25,
	photo: "https://picsum.photos/250"
};

ads.push(seed);

console.log(ads);

ads.push(seed);

app.get("/", function(req, res) {
	res.render("home.ejs", {
		title: "titre"
	});
});

app.get("/offres/", function(req, res) {
	res.redirect("/");
});

app.get("/annonce/:id", function(req, res) {
	console.log("type of req.params.id :", typeof req.params.id);
	const index = _.findIndex(ads, function(ad) {
		console.log("type of ad.id :", typeof ad.id);
		return ad.id.toString() === req.params.id;
	});
	console.log("index :", index);
	res.render("show.ejs", {
		id: ads[index].id,
		title: ads[index].title,
		description: ads[index].description,
		city: ads[index].city,
		price: ads[index].price,
		photo: ads[index].photo
	});
});

app.get("/deposer/", function(req, res) {
	res.render("new.ejs", {
		id: getNewId()
	});
});

app.post("/add_ad/", upload.single("picture"), function(req, res) {
	console.log("req.body :", req.body);
	console.log("req.file :", req.file);
	ads.push(req.body);
	res.redirect("/annonce/" + req.body.id);
	console.log("ads :", ads);
});

app.listen(3000, function() {
	console.log("Server started");
});
