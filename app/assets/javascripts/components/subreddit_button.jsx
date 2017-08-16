class SubredditButton extends React.Component {

	render() {
		let buttonClass = "btn btn-default btn-warning";
		return <input
				className={this.props.buttonActive ? buttonClass.concat(" active") : buttonClass}
				type="button"
				value={this.props.subreddit}
				onClick={this.props.onClick}/>
	}
}