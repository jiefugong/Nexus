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

	switchActiveTopic(newTopic) {
		this.setState({
			activeTopic: newTopic
		});
		this.setState({
			activeEntries: this.state.results.filter((result) => result.topic === newTopic)
		})
	}

	renderTableEntry(id, title, text) {
		return (
			<tr key={id}>
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
			<input key={topic.toString()} className="btn btn-default notes-btn" type="button" value={topic}></input>
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
						title={"Sample Title Display"}
						text={"This is sample text to be displayed."}
					/>
				</div>
			</div>
		)
	}
}