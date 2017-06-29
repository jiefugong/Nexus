class RedditSettingsModule extends React.Component {

	constructor() {
		super();
		this.state = {
			activeSubreddits: null,
		};
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
					<button type="button" className="close pull-right" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				</td>
			</tr>
		)
	}

	renderSubreddits() {
			return this.state.activeSubreddits.map((subreddit) => this.renderSubreddit(subreddit.id, subreddit.subreddit));
	}

	render() {
		return (
			<table className="table table-striped">
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
		)
	}
}