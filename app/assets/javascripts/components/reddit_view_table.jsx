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

	switchActiveSubreddit(newSubreddit) {
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
		const imageIdentifier = ['gifv', 'png', 'jpg', 'jpeg', 'imgur'];
		const url = link.indexOf("http") === 0 ? link : "https://www.reddit.com" + link;

		for (imageFormat of imageIdentifier) {
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
			<tr key={id}>
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
						<input className="btn btn-default reddit-module-action" type="button" value="Add Subreddit"></input>
						<input className="btn btn-default reddit-module-action" type="button" value="Sort" onClick={() => this.sortEntriesByScore()}></input>
					</div>
				</div>
			</div>
		)
	}
}