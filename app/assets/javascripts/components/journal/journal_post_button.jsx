class JournalPostButton extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		return (
			<button
			  type="button"
			  className={"btn btn-primary btn-xs pull-right" + (this.props.disabled ? " disabled" : "") + (this.props.hidden ? " hidden" : "")}
			  onClick={() => this.props.onClick()}>
				{this.props.buttonLabel}
			</button>
		);
	}
}