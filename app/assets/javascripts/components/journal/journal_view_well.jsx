class JournalViewWell extends React.Component {

	constructor() {
		super();
		this.state = {
			selectedTopic: null,
			newTopic: false,
		}

		this._setSelectedTopic = this._setSelectedTopic.bind(this);
		this._setNewTopic = this._setNewTopic.bind(this);
	}

	_setSelectedTopic(topic) {
		this.setState({
			selectedTopic: topic,
			newTopic: false,
		});

		this.props.onTopicChange(topic);
	}

	_setNewTopic() {
		this.setState({
			newTopic: true,
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
				{(this.props.creatingNote || this.props.editingNote) ?
					(
						<div className="new-entry-editing">
							<textarea 
							  className="form-control new-entry-title" 
							  rows="1"
							  defaultValue={this.props.editingNote ? this.props.activeEntry.title : "Insert Title Here"}
							  onChange={this.props.onTitleChange}/>
							<div className={"dropdown" + (this.state.newTopic ? " hidden" : "")}>
								<button
								  className="btn btn-default dropdown-toggle new-entry-dropdown"
								  type="button"
								  id="dropdownMenu1"
								  data-toggle="dropdown"
								  aria-haspopup="true"
								  aria-expanded="true">
									<span className="dropdown-active-topic">
										{!this.state.selectedTopic ?
                                            (this.props.editingNote ? this.props.activeEntry.topic : DEFAULT_TOPIC)
                                            :
                                            this.state.selectedTopic
                                        }
									</span>
								    <span> </span>
								    <span className="caret"/>
							  	</button>
							  	<ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
							  		{topicsList}
							  		<li role="separator" className="divider"/>
							  		<li>
							  			<a
							  			  className={"new-entry-add-topic" + (this.state.newTopic ? " selected" : "")}
							  			  data-target="/"
							  			  onClick={() => this._setNewTopic()}>
							  				New topic
							  			</a>
							  		</li>
							  	</ul>
							</div>
							<textarea
						  	  className={"form-control new-entry-new-topic" + (!this.state.newTopic ? " hidden" : "")}
						  	  rows="1"
						  	  defaultValue="New Topic"
						  	  onChange={(event) => this.props.onTopicChange(event.target.value)}/>
						  	<textarea
							  className="form-control entry-textarea"
							  rows="5"
							  defaultValue={this.props.editingNote ? this.props.activeEntry.entry : "New Note"}
							  onChange={this.props.onTextChange}/>
						</div>
					) : (
						<div className="new-entry-display">
							<p className="lead active-entry-title">
								{this.props.title}
							</p>
							<p className="active-entry-text">
								{this.props.text}
							</p>
						</div>
					)
				}
			</div>
		);
	}
}