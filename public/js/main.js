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
		if (typeof formInputs !== "undefined" && formInputs.length > 0) {
			formInputs.forEach(input => {
				input.addEventListener("blur", function(event) {
					const field = validations[this.name];
					if (field) {
						if (field.required[0]) {
							if (!this.value) {
								this.classList.add("not-validated");
								var error = this.parentElement.querySelector(".error-message");
								error.innerHTML = field.required[1];
								error.classList.add("displayed");
								return;
							}
						}
						if (field.validate) {
							if (!field.validate.validator(this.value)) {
								this.classList.add("not-validated");
								var error = this.parentElement.querySelector(".error-message");
								error.innerHTML = field.validate.message;
								error.classList.add("displayed");
								return;
							}
						}
					}
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
