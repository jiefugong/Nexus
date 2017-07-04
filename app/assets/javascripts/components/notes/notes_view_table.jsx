/* Functional Component for View of Entry Item */
function ViewBox(props) {
	const listItems = props.topics.map((topic, index) =>
		<li key={index}>
			<a data-target="/" id={topic.topic}>{topic.topic}</a>
		</li>
	);

	return (
		<div className="view-box well">
			<p className="lead active-entry-title">
				{props.title}
			</p>
			<textarea className="form-control new-entry-title hidden" rows="1" defaultValue="Insert Title Here"></textarea>
			<div className="dropdown">
			  <button className="btn btn-default dropdown-toggle new-entry-dropdown hidden" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
			    Topic
			    <span> </span>
			    <span className="caret"></span>
			  </button>
			  <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
			  	{listItems}
			  	<li role="separator" className="divider"></li>
			    <li><a className="new-entry-add-topic" data-target="/">New Topic</a></li>
			  </ul>
			  <textarea className="form-control new-entry-new-topic hidden" rows="1" defaultValue="New Topic"></textarea>
			</div>
			<p className="active-entry-text">
				{props.text}
			</p>
			<textarea className="form-control entry-textarea hidden" rows="5" defaultValue="New Note"></textarea>
		</div>
	)
}

class NotesViewTable extends React.Component {

	constructor() {
		super();
		this.state = {
			activeTopic: null,
			allTopics: null,
			activeEntry: {
				title: "Please click on an entry to view",
				entry: "Check the left hand side for all the currently stored notes entries by topic"
			},
			activeEntries: null,
			results: null,
			creatingNote: false,
		}
	}

	componentWillMount() {
		this.state.activeTopic = this.props.activeTopic;
		this.state.allTopics = this.props.allTopics;
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
	_makeAjaxRequest(type, body) {
		$.ajax({
			type: type,
			url: '/',
			data: body,
			dataType: 'json',
			success: function(data) {
				this.setState({
					results: data,
				});
				this.setState({
					activeEntries: this.state.results.filter((result) => result.topic === this.state.activeTopic)
				});
				// TODO: Is there a cleaner way to unravel from a list?
				this.setState({
					activeEntry: this.state.activeEntries.filter((entry) => entry.title === body.title)[0]
				});
			}.bind(this),
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

	/*
	 * @param newTopic: String representing the new topic to set the state to
	 */
	_selectClickedTopic(newTopic) {
		// TODO: There has to be a better way to use the JQuery selector than this...
		if (this.state.activeTopic !== null) {
			$("#" + this.state.activeTopic + "_selector").removeClass("active");
		}
		$("#" + newTopic + "_selector").addClass("active");
	}

	/*****************************
	 **     CLASS FUNCTIONS     **
	 *****************************/

	/*
	 * Toggles DOM elements to allow user to enter information for a new note
	 */
	addNewNote() {
		this.setState({
			creatingNote: true
		});
		this._toggleNoteElementsVisibility(ADD_NOTE_TOGGLE_ELEMENTS);
	}

	/*
	 * Toggles DOM elements to cancel a user editing or adding a new note
	 */
	cancelEditingNote() {
		this.setState({
			creatingNote: false
		});

		this.state.creatingNote ? this._toggleNoteElementsVisibility(ADD_NOTE_TOGGLE_ELEMENTS) : this._toggleNoteElementsVisibility(EDIT_NOTE_TOGGLE_ELEMENTS);
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
	 * Grabs the title, entry, and topic representing a full note and saves its state by making either an
	 * AJAX POST or PATCH request 
	 */ 
	modifyActiveEntries() {
		// TODO: Hard to read, topic is either the actively selected option in the dropdown or user-entered
		let title = this.state.creatingNote ? $(".new-entry-title").val() : $(".active-entry-title").html();
		let entry = $(".entry-textarea").val();
		let topic = $(".new-entry-dropdown").hasClass("hidden") ? $(".new-entry-new-topic").html() : $(".selected").html();

		let ajaxData = {
			title: title,
			entry: entry,
			topic: topic
		};

		if (this.state.creatingNote) {
			this._makeAjaxRequest(POST, ajaxData);
			this._toggleNoteElementsVisibility(ADD_NOTE_TOGGLE_ELEMENTS);
			// this._flushNoteEntryElements(ADD_NOTE_ENTRY_ELEMENTS);
		} else {
			this._makeAjaxRequest(PATCH, ajaxData);
			this._toggleNoteElementsVisibility(EDIT_NOTE_TOGGLE_ELEMENTS);
		}
	}

	/*
	 * Updates the React state with the new topic to trigger a rerender of the 
	 * notes shown in our list (organized by topic)
	 */
	switchActiveTopic(newTopic) {
		this._selectClickedTopic(newTopic);
		this.setState({
			activeTopic: newTopic
		});
		this.setState({
			activeEntries: this.state.results.filter((result) => result.topic === newTopic)
		})
	}

	/*
	 * Updates the React state with the clicked note to trigger a rerender of the
	 * viewing well
	 */ 
	switchActiveEntry(title) {
		this._selectClickedRow(title);

		this.setState({
			activeEntry: this.state.activeEntries.filter((entry) => entry.title === title)[0]
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
			<input key={topic.toString()} className="btn btn-default btn-warning notes-btn" id = {topic + "_selector"} type="button" value={topic} onClick={() => this.switchActiveTopic(topic)}></input>
		)
	}

	/*
	 * Maps all of the available topics to be rendered
	 */
	renderTopicTabs() {
		return this.state.allTopics.map((topic) => this.renderTopicTab(topic.topic))
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
					<ViewBox
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