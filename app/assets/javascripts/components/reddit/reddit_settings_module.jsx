class RedditSettingsModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeSubreddits: props.subreddits,
			newSubreddit: "",
		};

		this._handleChange = this._handleChange.bind(this);
		this._alterActiveSubreddits = this._alterActiveSubreddits.bind(this);
		this.renderSubreddit = this.renderSubreddit.bind(this);
		this.renderSubreddits = this.renderSubreddits.bind(this);
	}

	_handleChange(event) {
		this.setState({
			newSubreddit: event.target.value,
		});
	}

	_alterActiveSubreddits(requestType, subreddit) {
		$.ajax({
			type: requestType,
			url: '/settings',
			data: {subreddit: subreddit},
			dataType: 'json',
			success: function(data) {
				this.setState({
					activeSubreddits: data,
				})
			}.bind(this),
			error: function(data) {
				console.log("Could not complete request to alter subreddits");
			}
		})
	}

	renderSubreddit(id, subreddit) {
		return (
			<tr key={id} className="module-table-row">
				<td>
					{subreddit}
				</td>
				<td>
					<button
					  type="button"
					  className="close pull-right"
					  aria-label="Close"
					  onClick={() => this._alterActiveSubreddits(DELETE, subreddit)}>
					  	<span aria-hidden="true">
					  		&times;
					  	</span>
					</button>
				</td>
			</tr>
		)
	}

	renderSubreddits() {
		return this.state.activeSubreddits.map((subreddit) => this.renderSubreddit(subreddit.id, subreddit.subreddit));
	}

	render() {
		return (
			<div className="col-xs-6">
				<table className="table table-striped table-hover">
					<tbody>
						<tr>
							<td>
								<strong>
									Subscribed Subreddits
								</strong>
							</td>
							<td/>
						</tr>
						{this.renderSubreddits()}
					</tbody>
				</table>
				<form className="form-inline">
				  <div className="form-group">
				    <div className="input-group">
				      <input
				        type="text"
				        className="form-control"
				        id="submit-subreddit"
				        placeholder="Subreddit"
				        onChange={this._handleChange}/>
				    </div>
				  </div>
				  <button
				    type="submit"
				    className="btn btn-primary"
				    onClick={() => this._alterActiveSubreddits(POST, this.state.newSubreddit)}>
				    	Add Subreddit
				  </button>
				  <a className="btn btn-primary pull-right" href="/">Main Page</a>
				</form>
			</div>
		)
	}
}