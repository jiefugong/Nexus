class CalendarSettingsModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			events: props.events,
			editingEvent: false,
			creatingEvent: false,
			eventTitle: "",
			eventDescription: "",
			patchID: DEFAULT_PATCH_ID,
		};

		this._renderEvent = this._renderEvent.bind(this);
		this._makeAjaxRequest = this._makeAjaxRequest.bind(this);
		this._onTitleChange = this._onTitleChange.bind(this);
		this._onDescriptionChange = this._onDescriptionChange.bind(this);
		this.resetForm = this.resetForm.bind(this);
		this.renderEvents = this.renderEvents.bind(this);
		this.creatingEvent = this.creatingEvent.bind(this);
		this.editEvent = this.editEvent.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
		this.submitEvent = this.submitEvent.bind(this);
	}

	componentDidMount() {
		$(function() {
			$(START_TIME_PICKER_ELEM).datetimepicker();
			$(END_TIME_PICKER_ELEM).datetimepicker();
		});
	}

	_makeAjaxRequest(type, url, body, callback) {
		$.ajax({
			type: type,
			url: url,
			data: body,
			dataType: 'json',
			success: callback,
			error: function(data) {
				console.log("Could not complete request to modify this event");
			}
		});
	}

	_onTitleChange(event) {
		this.setState({
			eventTitle: event.target.value,
		});
	}

	_onDescriptionChange(event) {
		this.setState({
			eventDescription: event.target.value,
		});
	}

	creatingEvent() {
		this.setState({
			creatingEvent: true,
		});
	}

	resetForm() {
		this.setState({
			eventTitle: "",
			eventDescription: "",
			creatingEvent: false,
			editingEvent: false,
			patchID: -1,
		});

		// For now, hard to remove all pre-existing jQuery
		$(START_TIME_PICKER_ELEM).data("DateTimePicker").clear();
		$(END_TIME_PICKER_ELEM).data("DateTimePicker").clear();
	}

	deleteEvent(id) {
		let successCallback = function(data) {
			this.setState({
				events: data,
			});
			this.resetForm();
		}.bind(this);

		this._makeAjaxRequest(DELETE, '/events/' + id, {}, successCallback);
	}

	editEvent(id, title, description, startDate, endDate) {
		this.setState({
			patchID: id,
			editingEvent: true,
			eventTitle: title,
			eventDescription: description,
		});

		// For now, hard to remove all pre-existing jQuery
		$(START_TIME_PICKER_ELEM).data("DateTimePicker").date(reformatDateString(startDate));
		$(END_TIME_PICKER_ELEM).data("DateTimePicker").date(reformatDateString(endDate));
	}

	submitEvent() {
		let startDate = new Date($(START_TIME_PICKER_ELEM).data()["date"]);
		let endDate = new Date($(END_TIME_PICKER_ELEM).data()["date"]);

		let body = {
			title: this.state.eventTitle,
			description: this.state.eventDescription,
			start_time: startDate,
			end_time: endDate,
		}

		let successCallback = function(data) {
			this.setState({
				events: data,
			});
			this.resetForm();
		}.bind(this);

		let requestType = this.state.creatingEvent ? POST : PATCH;
		let requestUrl = this.state.creatingEvent ? "/events" : "/events/" + this.state.patchID;

		this._makeAjaxRequest(requestType, requestUrl, body, successCallback);
	}

	_renderEvent(id, title, description, startDate, endDate) {
		const formattedStart = startDate.split('T')[0];
		const formattedEnd = endDate.split('T')[0];

		return (
			<tr key={id} className="calendar-event-row">
				<td>
					{title}
				</td>
				<td>
					{formattedStart}
				</td>
				<td>
					{formattedEnd}
				</td>
				<td>
					<span
					  className="glyphicon glyphicon-remove"
					  aria-hidden="true"
					  onClick={() => this.deleteEvent(id)}/>
				</td>
				<td>
					<span
					  className="glyphicon glyphicon-edit"
					  aria-hidden="true"
					  onClick={() => this.editEvent(id, title, description, startDate, endDate)}/>
				</td>
			</tr>
		)
	}

	renderEvents() {
		return this.state.events.map((event) => this._renderEvent(event.id, event.title, event.description, event.start_time, event.end_time));
	}

	render() {
		return (
			<div className="calendar-settings-table">
				<table className="table table-striped table-hover">
					<tbody>
						<tr>
							<td>
								<strong> Calendar Events </strong>
							</td>
							<td>
								<strong> Start Date </strong>
							</td>
							<td>
								<strong> End Date </strong>
							</td>
							<td>
								<strong> Remove </strong>
							</td>
							<td>
								<strong> Edit </strong>
							</td>
						</tr>
						{this.renderEvents()}
					</tbody>
				</table>

				<button
				  type="submit"
				  className={"btn btn-primary calendar-btn" + (this.state.creatingEvent || this.state.editingEvent ? " hidden" : "")}
				  onClick={() => this.creatingEvent()}>
					New Event
				</button>

				<div className={"calendar-form well" + (this.state.editingEvent || this.state.creatingEvent ? "" : " hidden")}>
					<div className="row">
						<div className="col-xs-8 calendar-event-title">
							<div className="input-group">
								<span className="input-group-addon" id="basic-addon3">
									Event Title
								</span>
								<input
								  type="text"
								  className="form-control"
								  id="event-title"
								  aria-describedby="basic-addon3"
								  value={this.state.eventTitle}
								  onChange={this._onTitleChange}/>
							</div>
						</div>
						<div className="col-xs-12 calendar-event-description">
							<textarea
							  className="form-control"
							  rows="3"
							  id="event-description"
							  value={this.state.eventDescription}
							  onChange={this._onDescriptionChange}/>
						</div>
						<div className='col-xs-6'>
							<label for="datetimepicker1">
								Start Time
							</label>
					        <div className="form-group">
					            <div className='input-group date' id='datetimepicker1'>
					                <input type='text' className="form-control"/>
					                <span className="input-group-addon">
					                    <span className="glyphicon glyphicon-calendar"></span>
					                </span>
					            </div>
					        </div>
					    </div>
					    <div className='col-xs-6'>
					    	<label for="datetimepicker2">
					    		End Time
					    	</label>
					        <div className="form-group">
					            <div className='input-group date' id='datetimepicker2'>
					                <input type='text' className="form-control" />
					                <span className="input-group-addon">
					                    <span className="glyphicon glyphicon-calendar"></span>
					                </span>
					            </div>
					        </div>
					    </div>
					</div>
					<button
					  type="submit"
					  className="btn btn-primary calendar-btn"
					  onClick={() => this.submitEvent()}>
						{ this.state.editingEvent ?
							"Edit Event" :
							"Submit Event"
						}
					</button>
					<button
					  type="submit"
					  className="btn btn-primary calendar-btn"
					  onClick={() => this.resetForm()}>
						Cancel
					</button>
				</div>
			</div>
		);
	}
}