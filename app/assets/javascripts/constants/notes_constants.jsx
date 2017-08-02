// The default note to display to the user
const LANDING_NOTE_TEXT = {
	title: "Please click on an entry to view",
	entry: "Check the left hand side for all the currently stored notes entries by topic"
}

// Number of characters to cut off Notes preview at
const DEFAULT_SUBTEXT_LENGTH = 50;
// The label of the dropdown menu for topics
const DEFAULT_TOPIC = "Topic";

// Names of the elements that must be toggled when adding a note (buttons, entry boxes, etc)
ADD_NOTE_TOGGLE_ELEMENTS = ["active-entry-title", "active-entry-text", 
			"new-entry-title", "entry-textarea", "new-entry-dropdown", "entry-cancel-button",
			"entry-add-button", "entry-edit-button", "entry-save-button"];

// Names of the elements that must be toggled when editing a node
EDIT_NOTE_TOGGLE_ELEMENTS = ["active-entry-text", "entry-textarea",
			"entry-edit-button", "entry-save-button", "entry-cancel-button", "new-entry-dropdown",
			"entry-add-button"];