/* Functional Component for View of Entry Item */
function ViewBox(props) {
	return (
		<div>
			<p className="lead">
				{props.title}
			</p>
			<p>
				{props.text}
			</p>
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
				title: "Please click on an entry to get started!",
				entry: "Check the left hand side for all the currently stored notes entries by topic!"
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

	switchActiveEntry(title) {
		this.setState({
			// TODO: May not work depending on initial object
			activeEntry: this.state.activeEntries.filter((entry) => entry.title === title)[0]
		})
	}

	renderTableEntry(id, title, text) {
		return (
			<tr key={id} onClick={() => this.switchActiveEntry(title)}>
				<td>
					{title}
				</td>
				<td>
					{text.substring(0, DEFAULT_SUBTEXT_LENGTH) + "..."}
				</td>
				<td>
					{this.state.activeTopic}
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
								<td>
									<strong> Topic </strong>
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
				</div>
			</div>
		)
	}
}