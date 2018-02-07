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
					console.log(this);
					console.log(this.value);
					if (!this.value) {
						this.classList.add("not-validated");
						var error = this.parentElement.querySelector(".error-message");
						error.classList.add("displayed");
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
