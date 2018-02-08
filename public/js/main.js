document.addEventListener(
	"DOMContentLoaded",
	function() {
		var deleteBtn = document.querySelector(".red");
		if (deleteBtn) {
			deleteBtn.addEventListener(
				"click",
				function() {
					if (confirm("Etes vous sur de vouloir supprimer l'annonce ?")) {
						document.location = this.attributes.href.value;
					}
					event.preventDefault();
				},
				false
			);
		}

		var formInputs = document.querySelectorAll(
			".form-input>input, .form-input>textarea"
		);
		console.log(formInputs);
		var formContent = document.querySelector(".form-content");
		if (formContent) {
			var formData = formContent.attributes["data-form"].value;
			console.log("formData :", formData);
			var form_validations = validations[formData];
		}

		if (typeof formInputs !== "undefined" && formInputs.length > 0) {
			var validateBtn = document.querySelector("form .btn[type='submit']");
			console.log(validateBtn);
			if (validateBtn) {
				validateBtn.addEventListener(
					"click",
					function() {
						let has_error = false;
						const body = {};
						formInputs.forEach(input => {
							const field = form_validations[input.name];
							var that = input;
							let has_err = checkValidation(field, that);
							if (!has_error) {
								has_error = has_err;
								body[field] = that.value;
							}
						});

						console.log("Has error : ", has_error);

						// if (!has_error) {
						// 	fetch("/add_ad", {
						// 		method: "post",
						// 		body: JSON.stringify(body)
						// 	})
						// 		.then(response => response.json())
						// 		.then(data => {
						// 			console.log(data);
						// 		});
						// }
						if (has_error) {
							event.preventDefault();
						}
					},
					false
				);
			}

			formInputs.forEach(input => {
				input.addEventListener("blur", function(event) {
					const field = form_validations[this.name];
					var that = this;
					checkValidation(field, that);
				});
				input.addEventListener("input", function() {
					if (this.value) {
						this.classList.remove("not-validated");
						var error = this.parentElement.querySelector(".error-message");
						error.classList.remove("displayed");
					}
				});
			});
		}
	},
	false
);

function checkValidation(field, that) {
	if (field) {
		if (field.required && field.required[0]) {
			if (!that.value) {
				that.classList.add("not-validated");
				var error = that.parentElement.querySelector(".error-message");
				error.innerHTML = field.required[1];
				error.classList.add("displayed");
				return true;
			}
		}
		if (field.validate) {
			if (!field.validate.validator(that.value)) {
				that.classList.add("not-validated");
				var error = that.parentElement.querySelector(".error-message");
				error.innerHTML = field.validate.message;
				error.classList.add("displayed");
				return true;
			}
		}
	}
	return false;
}
