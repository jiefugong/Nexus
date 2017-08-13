class NotesViewTable extends React.Component {

	constructor() {
		super();
		this.state = {
			activeTopic: null,
			allTopics: null,
			activeEntry: LANDING_NOTE_TEXT,
			activeEntries: null,
			results: null,
			creatingNote: false,
		}
	}

	componentWillMount() {
		this.state.activeTopic = this.props.activeTopic;
		// We may need to change the format of allTopics here
		this.state.allTopics = this.props.allTopics.map((topic) => topic.topic);
		this.state.results = this.props.results;
		this.state.activeEntries = this.props.results.filter((result) => result.topic === this.props.activeTopic);
	}

	/*****************************
	 **    INTERNAL FUNCTIONS   **
	 *****************************/

	 _alterElementClass(elementIdentifier, attribute, addClass=true, isClass=true) {
	 	let $elementIdentifier = isClass ? $("." + elementIdentifier) : $("#" + elementIdentifier);

	 	if (addClass && !$elementIdentifier.hasClass(attribute)) {
	 		$elementIdentifier.addClass(attribute);
	 	} else if (!addClass && $elementIdentifier.hasClass(attribute)) {
	 		$elementIdentifier.removeClass(attribute);
	 	}
	}

	/*
	 * @param elementIdentifier: String identifier for an HTML element
	 * @param isClass: Boolean that determines how jQuery will select the element
	 */
	_toggleElementClass(elementIdentifier, attribute, isClass=true) {
		let $elementIdentifier = isClass ? $("." + elementIdentifier) : $("#" + elementIdentifier);
		$elementIdentifier.hasClass(attribute) ? $elementIdentifier.removeClass(attribute) : $elementIdentifier.addClass(attribute);
	}

	/*
	 * @param noteElementsToToggle: Array of strings representing all the HTML element string 
	 * identifiers to toggle with _toggleElementClass
	 */
	_toggleNoteElementsVisibility(domElementsToToggle) {
		for (domElement of domElementsToToggle) {
			this._toggleElementClass(domElement, "hidden");
		}
	}

	/* 
	 * @param type: String representing the method to make the AJAX request with
	 * @param body: Object containing the associated data with the note to modify, should contain 
	 * title (string), topic (string), and entry (text)
	 */
	_makeAjaxRequest(type, body, callback) {
		$.ajax({
			type: type,
			url: '/',
			data: body,
			dataType: 'json',
			success: callback.bind(this),
			error: function(data) {
				console.log("Could not complete request save this note");
			}
		});
	}

	/*
	 * @param entryElements: Array of strings representing HTML elements to empty of their current input
	 */
	_flushNoteEntryElements(domElements) {
		// TODO: How do we clear all the entry boxes
		return;
	}

	/*
	 * @param title: String representing the title of the selected note entry
	 */
	_selectClickedRow(title) {
		this._toggleElementClass("success", "success");
		this._toggleElementClass(title.replace(/ /g, '') + "row", "success", false);
		this._alterElementClass("entry-edit-button", "disabled", false);
	}

	/*****************************
	 **     CLASS FUNCTIONS     **
	 *****************************/

	/*
	 * Toggles DOM elements to allow user to enter information for a new note
	 */
	addNewNote() {
		$(".dropdown-active-topic").html(DEFAULT_TOPIC);

		this.setState({
			creatingNote: true
		});
		this._toggleNoteElementsVisibility(ADD_NOTE_TOGGLE_ELEMENTS);
	}

	/*
	 * Toggles DOM elements to cancel a user editing or adding a new note
	 */
	cancelEditingNote() {
		$(".dropdown-active-topic").html(DEFAULT_TOPIC);

		this.setState({
			creatingNote: false
		});

		this.state.creatingNote ? this._toggleNoteElementsVisibility(ADD_NOTE_TOGGLE_ELEMENTS) : this._toggleNoteElementsVisibility(EDIT_NOTE_TOGGLE_ELEMENTS);

		if (ADD_NOTE_TOGGLE_ELEMENTS.indexOf("new-entry-new-topic") !== -1) {
			ADD_NOTE_TOGGLE_ELEMENTS.pop();
			ADD_NOTE_TOGGLE_ELEMENTS.push("new-entry-dropdown");
		}
	}

	/*
	 * Toggles DOM elements to allow a user to edit the currently selected note
	 */ 
	editCurrentNote() {
		this._toggleNoteElementsVisibility(EDIT_NOTE_TOGGLE_ELEMENTS);

		let $activeEntryEditBox = $(".entry-textarea");
		let $activeEntryText = $(".active-entry-text");
		$activeEntryEditBox.val($activeEntryText.html());

		this._alterElementClass(this.state.activeTopic, "selected", true, false);
	}

	/*
	 * Deletes the selected table entry with title TITLE
	 */
	deleteTableEntry(title) {
		// TODO We need to send an AJAX request to delete the active entry, modify activeEntry,
		// activeEntries, and results
		let successCallback = function(data) {
			updatedTopics = new Set();
			data.map((element) => updatedTopics.add(element.topic));

			this.setState({
				results: data,
				activeEntry: LANDING_NOTE_TEXT,
				activeEntries: data.filter((element) => element.topic === this.state.activeTopic),
				allTopics: Array.from(updatedTopics)
			});
		};

		// TODO: Should eventually be passed the topic as well
		let ajaxData = {
			title: title
		}

		this._makeAjaxRequest(DELETE, ajaxData, successCallback);
	}

	/*
	 * Grabs the title, entry, and topic representing a full note and saves its state by making either an
	 * AJAX POST or PATCH request 
	 */ 
	modifyActiveEntries() {
		let title = this.state.creatingNote ? $(".new-entry-title").val() : $(".active-entry-title").html();
		let entry = $(".entry-textarea").val();
		let topic = $(".new-entry-dropdown").hasClass("hidden") ? $(".new-entry-new-topic").val() : $(".selected").html();

		let ajaxData = {
			title: title,
			entry: entry,
			topic: topic
		};

		let successCallback = function(data) {
			this.setState({
				results: data,
			});

			if (this.state.creatingNote) {
				this.setState({
					activeTopic: topic,
					creatingNote: false,
				});

				updatedTopics = new Set();
				this.state.results.map((result) => updatedTopics.add(result.topic));
				this.setState({
					allTopics: Array.from(updatedTopics)
				});
			}

			this.setState({
				activeEntries: this.state.results.filter((result) => result.topic === this.state.activeTopic)
			});

			this.switchActiveEntry(title);
		};

		if (this.state.creatingNote) {
			this._makeAjaxRequest(POST, ajaxData, successCallback);
			let notesToToggle = ADD_NOTE_TOGGLE_ELEMENTS;

			if (this.state.allTopics.indexOf(topic) == -1) {
				notesToToggle = ADD_NOTE_TOGGLE_ELEMENTS.slice();
				notesToToggle.splice(ADD_NOTE_TOGGLE_ELEMENTS.indexOf("new-entry-dropdown"), 1);
				notesToToggle.push("new-entry-new-topic");
			}
			this._toggleNoteElementsVisibility(notesToToggle);
		} else {
			this._makeAjaxRequest(PATCH, ajaxData, successCallback);
			this._toggleNoteElementsVisibility(EDIT_NOTE_TOGGLE_ELEMENTS);
		}
	}

	/*
	 * Updates the React state with the new topic to trigger a rerender of the 
	 * notes shown in our list (organized by topic)
	 */
	switchActiveTopic(newTopic) {
		this.setState({
			activeTopic: newTopic,
			activeEntries: this.state.results.filter((result) => result.topic === newTopic)
		})
	}

	/*
	 * Updates the React state with the clicked note to trigger a rerender of the
	 * viewing well
	 */ 
	switchActiveEntry(title) {
		this._selectClickedRow(title);

		let activeEntry = this.state.activeEntries.filter((entry) => entry.title === title)[0];

		this.setState({
			activeEntry: activeEntry,
			activeTopic: activeEntry.topic
		})
	}

	/*
	 * Renders a single entry of the table, including the title and a short preview
	 */
	renderTableEntry(id, title, text) {
		return (
			<tr key={id} className="module-table-row" id={title.replace(/ /g, '') + "row"} onClick={() => this.switchActiveEntry(title)}>
				<td>
					{title}
				</td>
				<td>
					{text.substring(0, DEFAULT_SUBTEXT_LENGTH) + "..."}
				</td>
				<td>
					<span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={() => this.deleteTableEntry(title)}/>
				</td>
			</tr>
		)
	}

	/*
	 * Maps all of the active entries by topic to be rendered
	 */
	renderTableEntries() {
		return this.state.activeEntries.map((entry) => this.renderTableEntry(entry.id, entry.title, entry.entry));
	}

	/*
	 * Renders a single button representing a topic stored in the database
	 */ 
	renderTopicTab(topic) {

		return (
			<input key={topic.toString()} className={"btn btn-default btn-warning notes-btn" + (topic === this.state.activeTopic ? " active" : "")} id={topic + "_topic"} type="button" value={topic} onClick={() => this.switchActiveTopic(topic)}></input>
		)
	}

	/*
	 * Maps all of the available topics to be rendered
	 */
	renderTopicTabs() {
		return this.state.allTopics.map((topic) => this.renderTopicTab(topic))
	}

	render() {
		return (
			<div className="row">
				<div className="col-xs-6">
					<table className="table table-striped table-hover pull-left">
						<tbody>
							<tr>
								<td>
									<strong> Title </strong>
								</td>
								<td>
									<strong> Preview </strong>
								</td>
								<td>
								</td>
							</tr>
							{this.renderTableEntries()}
						</tbody>
					</table>
					<div className="row">
						<div className="col-xs-12">
							{this.renderTopicTabs()}
						</div>
					</div>
				</div>
				<div className="col-xs-6">
					<NotesViewWell
						title={this.state.activeEntry.title}
						text={this.state.activeEntry.entry}
						topics={this.state.allTopics}
					/>
					<button type="button" className="btn btn-primary btn-xs pull-right entry-edit-button disabled" onClick={() => this.editCurrentNote()}>Edit Post</button>
					<button type="button" className="btn btn-primary btn-xs pull-right entry-add-button" onClick={() => this.addNewNote()}>Add Post</button>
					<button type="button" className="btn btn-primary btn-xs pull-right entry-cancel-button hidden" onClick={() => this.cancelEditingNote()}>Cancel</button>
					<button type="button" className="btn btn-primary btn-xs pull-right entry-save-button hidden" onClick={() => this.modifyActiveEntries()}>Save Post</button>
				</div>
			</div>
		)
	}
}