/* Functional Component for View of Entry Item */
function ViewBox(props) {
	/* TODO: Check if we can give a better key here, topic.id already being used in other component */
	/* TODO: CHeck if we can give each link item a better ID here, or double check to ensure that there can be no conflicts */
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
	_toggleNoteElement(elementIdentifier, isClass=true) {
		let $elementIdentifier = isClass ? $("." + elementIdentifier) : $("#" + elementIdentifier);
		$elementIdentifier.hasClass("hidden") ? $elementIdentifier.removeClass("hidden") : $elementIdentifier.addClass("hidden");
	}

	_toggleNoteEditElements(noteElementsToToggle) {
		for (noteElement of noteElementsToToggle) {
			this._toggleNoteElement(noteElement);
		}
	}

	/* Makes an AJAX request to "/" to update the entries for Notes */
	_makeAjaxRequest(type, data) {
		$.ajax({
			type: type,
			url: '/',
			data: data,
			dataType: 'json',
			success: function(data) {
				this.setState({
					results: data,
				});
				this.setState({
					activeEntries: this.state.results.filter((result) => result.topic === this.state.activeTopic)
				});
			}.bind(this),
			error: function(data) {
				console.log("Could not complete request save this note");
			}
		});
	}

	_flushNoteEntryElements(entryElements) {
		// TODO: How do we clear all the entry boxes
		return;
	}

	_selectClickedRow(title) {
		//TODO: We're getting real hacky now...
		$(".entry-textarea-button").removeClass("disabled");
		$(".success").removeClass("success");
		$("#" + title.replace(/ /g, '') + "row").addClass("success");
		$(".entry-edit-button").removeClass("disabled");
	}

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

	addNewNote() {
		this.setState({
			creatingNote: true
		});
		this._toggleNoteEditElements(ADD_NOTE_TOGGLE_ELEMENTS);
	}

	cancelEditingNote() {
		this.setState({
			creatingNote: false
		});

		this.state.creatingNote ? this._toggleNoteEditElements(ADD_NOTE_TOGGLE_ELEMENTS) : this._toggleNoteEditElements(EDIT_NOTE_TOGGLE_ELEMENTS);
	}

	editCurrentNote() {
		/* TODO: Toggle the dropdown box and automatically select the current topic */
		this._toggleNoteEditElements(EDIT_NOTE_TOGGLE_ELEMENTS);

		let $activeEntryEditBox = $(".entry-textarea");
		let $activeEntryText = $(".active-entry-text");
		$activeEntryEditBox.val($activeEntryText.html());

		$("#" + this.state.activeTopic).addClass("selected");
	}

	/* Called when the Save Button is clicked, triggering appropriate actions to save data edited in the form */
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
			this._toggleNoteEditElements(ADD_NOTE_TOGGLE_ELEMENTS);
			this._flushNoteEntryElements(ADD_NOTE_ENTRY_ELEMENTS);
		} else {
			this._makeAjaxRequest(PATCH, ajaxData);
			this._toggleNoteEditElements(EDIT_NOTE_TOGGLE_ELEMENTS);
		}
	}

	switchActiveTopic(newTopic) {
		this._selectClickedTopic(newTopic);
		this.setState({
			activeTopic: newTopic
		});
		this.setState({
			// TODO: This.state.results not being updated, problematic
			activeEntries: this.state.results.filter((result) => result.topic === newTopic)
		})
	}

	switchActiveEntry(title) {
		this._selectClickedRow(title);

		this.setState({
			activeEntry: this.state.activeEntries.filter((entry) => entry.title === title)[0]
		})
	}

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

	renderTableEntries() {
		return this.state.activeEntries.map((entry) => this.renderTableEntry(entry.id, entry.title, entry.entry));
	}

	renderTopicTab(topic) {
		return (
			<input key={topic.toString()} className="btn btn-default btn-warning notes-btn" id = {topic + "_selector"} type="button" value={topic} onClick={() => this.switchActiveTopic(topic)}></input>
		)
	}

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