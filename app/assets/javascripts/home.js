// JQuery Logic for the Home Controller
$(document).on("click", ".dropdown-menu li a", function(e) {
	// If any other elements have the "selected" class, remove and apply to the currently selected item
	$(".selected").removeClass("selected");
	$(this).addClass("selected");
});

$(document).on("click", ".new-entry-add-topic", function(e) {
	$(".new-entry-dropdown").addClass("hidden");
	$(".new-entry-new-topic").removeClass("hidden");
});

$(document).on("click", ".entry-add-button", function(e) {
	$(".new-entry-title").val("Insert Title Here");
	$(".entry-textarea").val("New Note");
});

$(document).on("click", ".notes-btn", function(e) {
	$(".active").removeClass("active");
	$(this).addClass("active");
});