class RedditViewTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		  defaultNumResults: 10,
		  activeSubreddit: "...",
	      activeEntries: null,
		  results: props.entries,
	    };

	    this.sortEntriesByScore = this.sortEntriesByScore.bind(this);
	    this.switchActiveSubreddit = this.switchActiveSubreddit.bind(this);
	    this.renderTableEntry = this.renderTableEntry.bind(this);
	    this.renderTableEntries = this.renderTableEntries.bind(this);
	    this.renderSubredditButton = this.renderSubredditButton.bind(this);
	    this.renderSubredditButtons = this.renderSubredditButtons.bind(this);
	}

	_sortByScoreComparator(entry1, entry2) {
		if (entry1.score === entry2.score) {
			return 0;
		}
		return entry1.score > entry2.score ? -1 : 1;
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

	sortEntriesByScore() {
		this.setState({
			activeEntries : this.state.activeEntries.sort(this._sortByScoreComparator)
		});
	}

	switchActiveSubreddit(newSubreddit) {
		this.setState({
			activeSubreddit: newSubreddit,
			activeEntries:
				this.state.results.filter((result) => result.subreddit === newSubreddit).splice(0, this.state.defaultNumResults),
		});
	}

	renderTableEntry(id, score, title, link) {
		/* TODO: See if ES6 method is available */
		const linkObject = this._formatLinkType(link);
		const scoreLabel = score == 0 ? "-" : score;

		return (
			<tr key={id} className="module-table-row">
				<td>
					{title}
				</td>
				<td>
					{scoreLabel}
				</td>
				<td>
					<a href={linkObject.url}>
						{linkObject.urlType}
					</a>
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
			let defaultSubredditText = this.props.subreddits.length ? "Click on a Subreddit to see results!" : "Go to settings and add some default reddits to start!"
			return (
				<tr>
					<td className="text-muted">
						{defaultSubredditText}
					</td>
					<td/>
					<td/>
				</tr>
			)
		}
	}

	renderSubredditButton(id, subreddit) {
		return (
			<SubredditButton
			  key={id}
			  buttonActive={this.state.activeSubreddit === subreddit}
			  subreddit={subreddit}
			  onClick={() => this.switchActiveSubreddit(subreddit)}/>
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
								<strong>
									Title
								</strong>
							</td>
							<td>
								<strong>
									Score
								</strong>
							</td>
							<td>
								<strong>
									Link
								</strong>
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
						<input
						  className="btn btn-default btn-primary pull-right"
						  type="button"
						  value="Sort"
						  onClick={() => this.sortEntriesByScore()}/>
						<a
						  className="btn btn-default btn-primary pull-right"
						  href="/settings">
						  	Settings
						 </a>
					</div>
				</div>
			</div>
		)
	}
}
