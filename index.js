const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	morgan(":method :url :status :response-time ms - :res[content-length]")
);

app.get("/", function(req, res) {
	res.render("home.ejs", {
		title: "titre"
	});
});

app.listen(3000, function() {
	console.log("Server started");
});
