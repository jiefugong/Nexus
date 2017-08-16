$(document).ready(function() {
	$(document).on("click", ".new-entry-add-topic", function(e) {
		ADD_NOTE_TOGGLE_ELEMENTS.splice(ADD_NOTE_TOGGLE_ELEMENTS.indexOf("new-entry-dropdown"), 1);
		ADD_NOTE_TOGGLE_ELEMENTS.push("new-entry-new-topic");
	});

	$(document).on("click", ".entry-add-button", function(e) {
		$(".new-entry-title").val("Insert Title Here");
		$(".entry-textarea").val("New Note");
	});
	
	$(document).on("click", ".fc-event-container", function(e) {
		e.preventDefault();
	});
});