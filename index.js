const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	morgan(":method :url :status :response-time ms - :res[content-length]")
);

ads = [];

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

seed = {
	id: 1,
	title: "Tom",
	description:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro expedita illo possimus repellendus itaque dolorem illum, veritatis omnis reprehenderit ratione a sit, nam earum labore consectetur minus nulla doloremque.",
	city: "Paris",
	price: 25,
	photo: "https://picsum.photos/250"
};

ads.push(seed);

app.get("/", function(req, res) {
	res.render("home.ejs", {
		title: "titre"
	});
});

app.get("/offres/", function(req, res) {
	res.redirect("/");
});

app.get("annonce/:id", function(req, res) {
	res.render("show.ejs", {
		data: "voila de la data pour la show"
	});
});

app.get("/deposer/", function(req, res) {
	res.render("new.ejs", {
		id: getNewId()
	});
});

app.post("/add_ad/", function(req, res) {
	redirect("/");
});

app.listen(3000, function() {
	console.log("Server started");
});
