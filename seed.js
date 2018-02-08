const validations = require("./public/js/validations.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/leboncoin");

const SuperAd = require("./models/superAd");

// const seed = new SuperAd({
// 	title: "Tom",
// 	description:
// 		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro expedita illo possimus repellendus itaque dolorem illum, veritatis omnis reprehenderit ratione a sit, nam earum labore consectetur minus nulla doloremque.",
// 	city: "Paris",
// 	price: 25,
// 	ad_type: "offer",
// 	photo: "73285e1f2bb198b4afc9c49b1c425a5f"
// });

// seed.save(function(err, obj) {
// 	if (err) {
// 		console.log("something went wrong when saving");
// 	} else {
// 		console.log("The ad was saved :" + obj);
// 	}
// });
