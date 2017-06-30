/* Functional Component for View of Entry Item */
function ViewBox(props) {
	return (
		<div className="view-box">
			<p className="lead active-entry-title">
				{props.title}
			</p>
			<p className="active-entry-text">
				{props.text}
			</p>
			<textarea className="form-control active-entry-edit hidden" rows="5"></textarea>
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
		}
	}

	componentWillMount() {
		this.state.activeTopic = this.props.activeTopic;
		this.state.allTopics = this.props.allTopics;
		this.state.results = this.props.results;
		this.state.activeEntries = this.props.results.filter((result) => result.topic === this.props.activeTopic);
	}

	_toggleNoteEditElements() {
		let $activeEntryText = $(".active-entry-text");
		let $activeEntryEditBox = $(".active-entry-edit");
		let $activeEntryEditButton = $(".active-entry-edit-button");
		let $activeEntrySaveButton = $(".active-entry-save-button");

		for (item of [$activeEntryText, $activeEntryEditBox, $activeEntryEditButton, $activeEntrySaveButton]) {
			item.hasClass("hidden") ? item.removeClass("hidden") : item.addClass("hidden");
		}
	}

	editClickedNote() {
		let $activeEntryEditBox = $(".active-entry-edit");
		let $activeEntryText = $(".active-entry-text");

		this._toggleNoteEditElements();
		$activeEntryEditBox.val($activeEntryText.html());
	}

	saveNewNote(entry) {
		$.ajax({
			type: POST,
			url: '/',
			data: {
				title: this.state.activeEntry.title,
				entry: entry
			},
			dataType: 'json',
			success: function(data) {
				this.setState({
					activeEntry: data,
				});
				let newActiveEntries = []
				for (activeEntry of this.state.activeEntries) {
					newActiveEntries.push($.extend(true, {}, activeEntry));
				}
				newActiveEntries.filter((activeEntry) => activeEntry.title === data.title)[0].entry = data.entry;

				this.setState({
					activeEntries: newActiveEntries,
				});
			}.bind(this),
			error: function(data) {
				console.log("Could not complete request save new note");
			}
		});

		this._toggleNoteEditElements();
	}

	_selectClickedButton(newTopic) {
		// TODO: There has to be a better way to use the JQuery selector than this...
		if (this.state.activeTopic !== null) {
			$("#" + this.state.activeTopic + "_selector").removeClass("active");
		}
		$("#" + newTopic + "_selector").addClass("active");
	}

	switchActiveTopic(newTopic) {
		this._selectClickedButton(newTopic);

		this.setState({
			activeTopic: newTopic
		});
		this.setState({
			activeEntries: this.state.results.filter((result) => result.topic === newTopic)
		})
	}

	_selectClickedRow(title) {
		//TODO: We're getting real hacky now...
		$(".success").removeClass("success");
		$("#" + title.replace(/ /g, '') + "row").addClass("success");
	}

	switchActiveEntry(title) {
		$(".active-entry-edit-button").removeClass("disabled");
		this._selectClickedRow(title);

		this.setState({
			// TODO: May not work depending on initial object
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
					/>
					<button type="button" className="btn btn-primary btn-xs pull-right active-entry-edit-button disabled" onClick={() => this.editClickedNote()}>Edit Post</button>
					<button type="button" className="btn btn-primary btn-xs pull-right active-entry-add-button" disabled="disabled">Add Post</button>
					<button type="button" className="btn btn-primary btn-xs pull-right active-entry-save-button hidden" onClick={() => this.saveNewNote($(".active-entry-edit").val())}>Save Post</button>
				</div>
			</div>
		)
	}
}