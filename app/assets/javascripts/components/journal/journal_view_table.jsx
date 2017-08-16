class JournalViewTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTopic: "",
			allTopics: props.allTopics.map((topic) => topic.topic),
			activeEntry: LANDING_NOTE_TEXT,
			activeEntries: props.results.filter((result) => result.topic === props.activeTopic),
			activeEntryIndex: DEFAULT_ACTIVE_INDEX,
			results: props.results,
			creatingNote: false,
			editingNote: false,
			newNoteTitle: "",
			newNoteTopic: "",
			newNoteText: "",
			postButtons: [
				{disabled: true, hidden: false, label: "Edit Post"},
				{disabled: false, hidden: false, label: "Add Post"},
				{disabled: false, hidden: true, label: "Cancel"},
				{disabled: false, hidden: true, label: "Save Post"},
			],
		}

		this.addNote = this.addNote.bind(this);
		this.cancelAction = this.cancelAction.bind(this);
		this.deleteNote = this.deleteNote.bind(this);
		this.editNote = this.editNote.bind(this);
		this.saveNote = this.saveNote.bind(this);
		this._handleNewTitleChange = this._handleNewTitleChange.bind(this);
		this._handleNewTopicChange = this._handleNewTopicChange.bind(this);
		this._handleNewTextChange = this._handleNewTextChange.bind(this);
		this._togglePostButtonVisibility = this._togglePostButtonVisibility.bind(this);
		this._switchActiveTopic = this._switchActiveTopic.bind(this);
		this._setActiveEntry = this._setActiveEntry.bind(this);
		this._renderTableEntry = this._renderTableEntry.bind(this);
		this._renderTopicTab = this._renderTopicTab.bind(this);
		this._renderPostButton = this._renderPostButton.bind(this);
		this.renderTableEntries = this.renderTableEntries.bind(this);
		this.renderTopicTabs = this.renderTopicTabs.bind(this);
		this.renderPostButtons = this.renderPostButtons.bind(this);
	}

	componentWillMount() {
		let postButtons = this.state.postButtons.slice();
		postButtons[EDIT_BUTTON].onClick = this.editNote;
		postButtons[ADD_BUTTON].onClick = this.addNote;
		postButtons[CANCEL_BUTTON].onClick = this.cancelAction;
		postButtons[SAVE_BUTTON].onClick = this.saveNote;

		this.setState({
			postButtons: postButtons,
		});
	}

	_handleNewTitleChange (event) {
		this.setState({
			newNoteTitle: event.target.value,
		});
	}


	// This event handler slightly different because multiple ways to set topic
	_handleNewTopicChange (topic) {
		this.setState({
			newNoteTopic: topic,
		});
	}

	_handleNewTextChange (event) {
		this.setState({
			newNoteText: event.target.value,
		});
	}

	_togglePostButtonVisibility () {
		let postButtons = this.state.postButtons.slice();
		for (button of postButtons) {
			button.hidden = !button.hidden;
		};

		this.setState({
			postButtons: postButtons,
		})
	}

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

	_switchActiveTopic(newTopic) {
		this.setState({
			activeTopic: newTopic,
			activeEntries: this.state.results.filter((result) => result.topic === newTopic),
			activeEntryIndex: DEFAULT_ACTIVE_INDEX,
		});
	}

	addNote() {
		this._togglePostButtonVisibility();

		this.setState({
			creatingNote: true,
		});
	}

	editNote() {
		this._togglePostButtonVisibility();

		this.setState({
			newNoteTitle: this.state.activeEntry.title,
			newNoteTopic: this.state.activeEntry.topic,
			newNoteText: this.state.activeEntry.entry,
			editingNote: true,
		});
	}

	cancelAction() {
		this._togglePostButtonVisibility();

		this.setState({
			creatingNote: false,
			editingNote: false,
		});
	}

	deleteNote(title) {
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

		let ajaxData = {
			title: title
		}

		this._makeAjaxRequest(DELETE, ajaxData, successCallback);
	}

	saveNote() {
		let ajaxData = {
			title: this.state.newNoteTitle,
			entry: this.state.newNoteText,
			topic: this.state.newNoteTopic
		};

		let successCallback = function(data) {
			this._togglePostButtonVisibility();

			updatedTopics = new Set();
			data.map((result) => updatedTopics.add(result.topic));

			this.setState({
				activeTopic: this.state.newNoteTopic,
				creatingNote: false,
				editingNote: false,
				allTopics: Array.from(updatedTopics),
				results: data,
				activeEntries: data.filter((result) => result.topic === this.state.newNoteTopic)
			});

			this._setActiveEntry(this.state.activeEntries.length - 1, this.state.newNoteTitle);
		}.bind(this);

		let requestType = this.state.creatingNote ? POST : PATCH;
		this._makeAjaxRequest(requestType, ajaxData, successCallback);
	}

	_setActiveEntry(index, title) {
		let activeEntry = this.state.activeEntries.filter((entry) => entry.title === title)[0];
		let postButtons = this.state.postButtons.slice();

		postButtons[EDIT_BUTTON].disabled = false;

		this.setState({
			activeEntryIndex: index,
			activeEntry: activeEntry,
			activeTopic: activeEntry.topic,
			postButtons: postButtons,
			creatingNote: false,
		})
	}

	_renderTableEntry(id, title, text, index) {
		return (
			<tr
			  key={id}
			  className={"module-table-row" + (index === this.state.activeEntryIndex ? " success" : "")}
			  onClick={() => this._setActiveEntry(index, title)}>
				<td>
					{title}
				</td>
				<td>
					{text.substring(0, DEFAULT_SUBTEXT_LENGTH) + "..."}
				</td>
				<td>
					<span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={() => this.deleteNote(title)}/>
				</td>
			</tr>
		)
	}

	renderTableEntries() {
		return this.state.activeEntries.map((entry, index) => this._renderTableEntry(entry.id, entry.title, entry.entry, index));
	}

	_renderTopicTab(topic) {
		return (
			<input
			  key={topic.toString()}
			  className={"btn btn-default btn-warning notes-btn" + (topic === this.state.activeTopic ? " active" : "")}
			  type="button"
			  value={topic}
			  onClick={() => this._switchActiveTopic(topic)}/>
		)
	}

	renderTopicTabs() {
		return this.state.allTopics.map((topic) => this._renderTopicTab(topic))
	}

	_renderPostButton(disabled, hidden, buttonLabel, onClick, index) {
		return <JournalPostButton
				key={buttonLabel}
				disabled={disabled}
				hidden={hidden}
				buttonLabel={buttonLabel}
				onClick={() => onClick()}/>
	}

	renderPostButtons() {
		return this.state.postButtons.map((button, index) =>
			this._renderPostButton(button.disabled, button.hidden, button.label, button.onClick, index));
	}

	render() {
		return (
			<div className="row">
				<div className="col-xs-6">
					<table className="table table-striped table-hover pull-left">
						<tbody>
							<tr>
								<td>
									<strong>
										Title
									</strong>
								</td>
								<td>
									<strong>
										Preview
									</strong>
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
					<JournalViewWell
						title={this.state.activeEntry.title}
						text={this.state.activeEntry.entry}
						topics={this.state.allTopics}
						creatingNote={this.state.creatingNote}
						editingNote={this.state.editingNote}
						activeEntry={this.state.activeEntry}
						onTitleChange={this._handleNewTitleChange}
						onTopicChange={this._handleNewTopicChange}
						onTextChange={this._handleNewTextChange}
					/>
					{this.renderPostButtons()}
				</div>
			</div>
		)
	}
}