class EmailViewTable extends React.Component {
	constructor() {
		super();
		this.state = {
			emails: [],
			authenticationError: false,
		};

		this._makeAjaxRequest = this._makeAjaxRequest.bind(this);
		this._renderEmailEntry = this._renderEmailEntry.bind(this);
		this.renderEmailEntries = this.renderEmailEntries.bind(this);
	}

	componentWillMount() {		
		let successCallback = function(data) {
			if (!data) {
				this.setState({
					authenticationError: true,
				});
			} else {
				this.setState({
					emails: data,
				});
			}

			console.log(data);
		};

		this._makeAjaxRequest(GET, '/emails/', {}, successCallback);
	}

	_makeAjaxRequest(type, url, body, callback) {
		$.ajax({
			type: type,
			url: url,
			data: body,
			dataType: 'json',
			success: callback.bind(this),
			error: function(data) {
				console.log("Could not complete request for email");
			}
		});
	}

	_renderEmailEntry(email) {
		let emailObject = JSON.parse(email)
		let subject = emailObject.subject
		let sender = emailObject.sender
		let senderName = emailObject.name

		console.log(subject);
		console.log(sender);
		console.log(senderName);

		return (
			<tr 
			  key={subject}
			  className="module-table-row">
				<td>
					{senderName}
				</td>
				<td>
					{subject}
				</td>
				<td>
					<span className="glyphicon glyphicon-remove" aria-hidden="true"/>
				</td>
			</tr>
		)
	}

	renderEmailEntries() {
		return this.state.emails.map((email) => this._renderEmailEntry(email));
	}

	render() {
		return (
			<div className="row">
				<div className="col-xs-12">
					<table className="table table-striped table-hover pull-left">
						<tbody>
							<tr>
								<td>
									<strong>
										Sender
									</strong>
								</td>
								<td>
									<strong>
										Subject
									</strong>
								</td>
								<td>
								</td>
							</tr>
							{this.renderEmailEntries()}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}