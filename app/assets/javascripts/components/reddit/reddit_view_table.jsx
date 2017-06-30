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

	_sortByScoreComparator(entry1, entry2) {
		if (entry1.score === entry2.score) {
			return 0;
		}
		return entry1.score > entry2.score ? -1 : 1;
	}

	sortEntriesByScore() {
		this.setState({
			activeEntries : this.state.activeEntries.sort(this._sortByScoreComparator)
		});
	}

	_selectClickedButton(newSubreddit) {
		// TODO: There has to be a better way to use the JQuery selector than this...
		if (this.state.activeSubreddit !== "...") {
			$("#" + this.state.activeSubreddit + "_selector").removeClass("active");
		}
		$("#" + newSubreddit + "_selector").addClass("active");
	}

	switchActiveSubreddit(newSubreddit) {
		this._selectClickedButton(newSubreddit);

		this.setState({
			activeSubreddit: newSubreddit
		});
		this.setState({
			activeEntries :
				this.state.results.filter((result) => result.subreddit === newSubreddit).splice(0, this.state.defaultNumResults)
		});
	}

	_formatLinkType(link) {
		let urlType = "Link";
		const url = link.indexOf("http") === 0 ? link : "https://www.reddit.com" + link;

		for (imageFormat of IMG_IDENTIFIERS) {
			if (link.indexOf(imageFormat) !== -1) {
				urlType = "Photo";
				break;
			}
		}

		return {
			'url' : url,
			'urlType' : urlType,
		}
	}

	renderTableEntry(id, score, title, link) {
		/* TODO: See if ES6 method is available */
		const linkObject = this._formatLinkType(link);
		const scoreLabel = score == 0 ? "-" : score
		return (
			<tr key={id} className="module-table-row">
				<td>
					{title}
				</td>
				<td>
					{scoreLabel}
				</td>
				<td>
					<a href={linkObject.url}>{linkObject.urlType}</a>
				</td>
			</tr>
		)
	}

	renderTableEntries() {
		if (this.state.activeEntries !== null) {
			if (this.state.activeEntries.length > 0) {
				return this.state.activeEntries.map((result) => this.renderTableEntry(result.id, result.score, result.title, result.link));
			} else {
				return (
					<tr>
						<td className="text-muted">
							No results! Check to make sure you entered a valid subreddit.
						</td>
					</tr>
				)
			}
		} else {
			return (
				<tr>
					<td className="text-muted">
						Click on a Subreddit to see results!
					</td>
				</tr>
			)
		}
	}

	renderSubredditButton(id, subreddit) {
		return (
			<input key={id} className="btn btn-default btn-warning" type="button" id = {subreddit + "_selector"} value={subreddit} onClick={() => this.switchActiveSubreddit(subreddit)}></input>
		)
	}

	renderSubredditButtons() {
		return this.props.subreddits.map((subreddit) => this.renderSubredditButton(subreddit.id, subreddit.subreddit));
	}

	render() {
		return (
			<div className="col-xs-12">
				<h1> Subreddit Digest for {this.state.activeSubreddit} </h1>
				<table className="table table-striped table-hover">
					<tbody>
						<tr>
							<td>
								<strong>Title</strong>
							</td>
							<td>
								<strong>Score</strong>
							</td>
							<td>
								<strong>Link</strong>
							</td>
						</tr>
						{this.renderTableEntries()}
					</tbody>
				</table>
				<div className="row">
					<div className="col-xs-9">
						{this.renderSubredditButtons()}
					</div>
					<div className="col-xs-3">
						<input className="btn btn-default btn-primary pull-right" type="button" value="Sort" onClick={() => this.sortEntriesByScore()}></input>
						<a className="btn btn-default btn-primary pull-right" href="/settings">Settings</a>
					</div>
				</div>
			</div>
		)
	}
}
