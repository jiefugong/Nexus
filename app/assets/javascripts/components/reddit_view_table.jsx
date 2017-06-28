class RedditViewTable extends React.Component {

	constructor() {
		super();
		this.state = {
		  defaultNumResults: 10,
		  results: null,
	      activeSubreddit: "politics",
	      activeEntries: null,
	    };
	}

	componentDidMount() {
		this.state.results = this.props.entries;
		this.state.activeEntries = this.state.results.filter((result) => result.subreddit === this.state.activeSubreddit);
	}

	switchActiveSubreddit(newSubreddit) {
		this.setState({activeSubreddit: newSubreddit});
		this.setState({activeEntries : this.state.results.filter((result) => result.subreddit === newSubreddit).splice(0, this.state.defaultNumResults)});
	}

	renderTableEntry(id, title, link) {
		const entryLink = "https://www.reddit.com" + link;
		/* TODO: See if ES6 method is available */
		const entryLabel = link.indexOf("/r") === 0 ? "Link" : "Photo";
		return (
			<tr key={id}>
				<td>
					{title}
				</td>
				<td>
					<a href={entryLink}>{entryLabel}</a>
				</td>
			</tr>
		)
	}

	renderTableEntries() {
		if (this.state.activeEntries !== null) {
			return this.state.activeEntries.map((result) => this.renderTableEntry(result.id, result.title, result.link));
		} else {
			return (
				<tr>
					<td>
						Click on a Subreddit to see results!
					</td>
				</tr>
			)
		}
	}

	renderSubredditButton(id, subreddit) {
		return (
			<input key={id} className="btn btn-default" type="button" value={subreddit} onClick={() => this.switchActiveSubreddit(subreddit)}></input>
		)
	}

	renderSubredditButtons() {
		return this.props.subreddits.map((subreddit) => this.renderSubredditButton(subreddit.id, subreddit.subreddit));
	}

	render() {
		return (
			<div id="main-container" className="container">
				<h1> Subreddit Digests </h1>
				<table className="table table-striped">
					<tbody>
						{this.renderTableEntries()}
					</tbody>
				</table>
				{this.renderSubredditButtons()}
			</div>
		)
	}
}