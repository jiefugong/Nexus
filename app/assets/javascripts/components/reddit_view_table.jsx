class RedditViewTable extends React.Component {

	constructor() {
		super();
		this.state = {
		  defaultNumResults: 10,
		  activeSubreddit: "...",
	      activeEntries: null,
		  results: null,
	    };
	}

	componentDidMount() {
		this.state.results = this.props.entries;
		this.state.activeEntries =
			this.state.results.filter((result) => result.subreddit === this.state.activeSubreddit);
	}

	switchActiveSubreddit(newSubreddit) {
		this.setState({
			activeSubreddit: newSubreddit
		});
		this.setState({
			activeEntries :
				this.state.results.filter((result) => result.subreddit === newSubreddit).splice(0, this.state.defaultNumResults)
		});
	}

	renderTableEntry(id, score, title, link) {
		const entryLink = link.indexOf("http") === 0 ? link : "https://www.reddit.com" + link;
		/* TODO: See if ES6 method is available */
		/* TODO: Incorrect method of determining if link is actual link or photo, also should include discussion thread */
		const entryLabel = link.indexOf("/r") === 0 ? "Link" : "Photo";
		const scoreLabel = score == 0 ? "-" : score
		return (
			<tr key={id}>
				<td>
					{title}
				</td>
				<td>
					{scoreLabel}
				</td>
				<td>
					<a href={entryLink}>{entryLabel}</a>
				</td>
			</tr>
		)
	}

	renderTableEntries() {
		if (this.state.activeEntries !== null) {
			return this.state.activeEntries.map((result) => this.renderTableEntry(result.id, result.score, result.title, result.link));
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
				<div className="row">
					<h1> Subreddit Digest for {this.state.activeSubreddit} </h1>
					<table className="table table-striped">
						<tbody>
							{this.renderTableEntries()}
						</tbody>
					</table>
					<div className="col-xs-9">
						{this.renderSubredditButtons()}
					</div>
					<div className="col-xs-3">
						<input className="btn btn-default" id= "add-subreddit" type="button" value="Add Subreddit"></input>
					</div>
				</div>
			</div>
		)
	}
}