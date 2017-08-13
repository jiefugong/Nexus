class NotesViewWell extends React.Component {

	constructor() {
		super();
		this.state = {
			selectedTopic: null,
			newTopic: null,
		}

		this._setSelectedTopic = this._setSelectedTopic.bind(this);
		this._setNewTopic = this._setNewTopic.bind(this);
	}

	_setSelectedTopic(topic) {
		this.setState({
			selectedTopic: topic,
			newTopic: false,
		});
	}

	_setNewTopic(newTopic) {
		this.setState({
			newTopic: newTopic,
		});
	}

	render() {
		const topicsList = this.props.topics.map((topic, index) =>
			<li key={index}>
				<a data-target="/"
			      className="topic-list-items"
			      id={topic}
			      onClick={() => this._setSelectedTopic(topic)}>
				   	{topic}
				</a>
			</li>
		);

		return (
			<div className="view-box well">
				<p className="lead active-entry-title">
					{this.props.title}
				</p>
				<textarea 
				  className="form-control new-entry-title hidden" 
				  rows="1"
				  defaultValue="Insert Title Here"/>
				<div className="dropdown">
					<button
					  className={"btn btn-default dropdown-toggle new-entry-dropdown" + (!this.state.newTopic ? " hidden" : "")}
					  type="button"
					  id="dropdownMenu1"
					  data-toggle="dropdown"
					  aria-haspopup="true"
					  aria-expanded="true">
						<span className="dropdown-active-topic">
							{!this.state.selectedTopic ? DEFAULT_TOPIC : this.state.selectedTopic}
						</span>
					    <span> </span>
					    <span className="caret"/>
				  	</button>
				  	<ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
				  		{topicsList}
				  		<li role="separator" className="divider"/>
				  		<li>
				  			<a
				  			  className="new-entry-add-topic"
				  			  data-target="/"
				  			  onClick={() => this._setNewTopic(true)}>
				  				New topic
				  			</a>
				  		</li>
				  	</ul>
				  	<textarea
				  	  className={"form-control new-entry-new-topic" + (this.state.newTopic ? "" : " hidden")}
				  	  rows="1"
				  	  defaultValue="New Topic"/>
				</div>
				<p className="active-entry-text">
					{this.props.text}
				</p>
				<textarea
				  className="form-control entry-textarea hidden"
				  rows="5"
				  defaultValue="New Note"/>
			</div>
		);
	}
}