document.addEventListener(
	"DOMContentLoaded",
	function() {
		var deleteBtn = document.querySelector(".red");
		if (!deleteBtn) return;
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
	},

	false
);
