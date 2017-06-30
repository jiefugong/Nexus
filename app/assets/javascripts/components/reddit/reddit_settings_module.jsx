class RedditSettingsModule extends React.Component {

	constructor() {
		super();
		this.state = {
			activeSubreddits: null,
		};
	}

	_alterActiveSubreddits(request_type, subreddit) {
		$.ajax({
			type: request_type,
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

	componentWillMount() {
		this.state.activeSubreddits = this.props.subreddits;
	}

	renderSubreddit(id, subreddit) {
		return (
			<tr key={id} >
				<td>
					{subreddit}
				</td>
				<td>
					<button type="button" className="close pull-right" aria-label="Close" onClick={() => this._alterActiveSubreddits(DELETE, subreddit)}><span aria-hidden="true">&times;</span></button>
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
								<strong> Subscribed Subreddits </strong>
							</td>
							<td>
							</td>
						</tr>
						{this.renderSubreddits()}
					</tbody>
				</table>
				<form className="form-inline">
				  <div className="form-group">
				    <div className="input-group">
				      <input type="text" className="form-control" id="submit-subreddit" placeholder="Subreddit"></input>
				    </div>
				  </div>
				  <button type="submit" className="btn btn-primary" onClick={() => this._alterActiveSubreddits(POST, $("#submit-subreddit").val())}>Add Subreddit</button>
				  <a className="btn btn-primary pull-right" href="/">Main Page</a>
				</form>
			</div>
		)
	}
}