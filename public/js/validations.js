const validations = {
	title: {
		type: String,
		required: [true, "Vous devez mettre un titre"]
	},
	description: {
		type: String,
		required: [true, "Vous devez mettre une description"]
	},
	city: String,
	price: Number,
	ad_type: {
		type: String,
		enum: {
			values: ["offer", "demand"],
			default: "offer",
			message: "Choose a type of annonce."
		}
	},
	mail: {
		type: String,
		validate: {
			validator: function(value) {
				return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
					value
				);
			},
			message: "Cette email n'est pas valide"
		},
		required: [true, "L'email est requis"]
	},
	phone: {
		type: String,
		validate: {
			validator: function(v) {
				return /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/.test(
					v
				);
			},
			message: "Ce n'est pas un téléphone français valide"
		},
		required: [true, "Le numéro de téléphone est requis"]
	},
	photo: String
};

try {
	module.exports = validations;
} catch (error) {}
