const validations = require("./public/js/validations.js");
const mongoose = require("mongoose");
const Faker = require("faker");

mongoose.connect("mongodb://localhost:27017/leboncoin");

const SuperAd = require("./models/superAd");

// SuperAd.collection.drop();

var index = "";
var types = ["offer", "demand"];

for (var i = 1; i < 12; i++) {
	if (i < 10) {
		index = "0" + i.toString();
	} else {
		index = i.toString();
	}
	var phoneNum = "";
	for (var j = 1; j < 9; j++) {
		phoneNum += randomNum(10);
	}

	let seed = new SuperAd({
		title: Faker.name.findName(),
		description: Faker.lorem.paragraph(),
		city: Faker.address.city(),
		price: randomNum(2000),
		ad_type: types[randomNum(2)],
		photo: "download-" + index + ".jpg",
		pseudo: Faker.name.firstName(),
		mail: Faker.internet.email(),
		phone: "06" + phoneNum
	});

	seed.save(function(err, obj) {
		if (err) {
			console.log("something went wrong when saving:" + JSON.stringify(err));
		} else {
			console.log("Save OK");
		}
	});
}

function randomNum(max) {
	return Math.floor(Math.random() * max);
}

setTimeout(function() {
	mongoose.connection.close();
}, 5000);
