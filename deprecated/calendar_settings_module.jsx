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

		this.onEventTitleChange = this.onEventTitleChange.bind(this);
		this.onEventDescriptionChange = this.onEventDescriptionChange.bind(this);
	}

	componentDidMount() {
		$(function() {
			$(START_TIME_PICKER_ELEM).datetimepicker();
			$(END_TIME_PICKER_ELEM).datetimepicker();
		});
	}

	_populateEditForm(title, description, startTime, endTime) {
		this.setState({
			eventTitle: title,
			eventDescription: description,
		});

		$(START_TIME_PICKER_ELEM).data("DateTimePicker").date(reformatDateString(startTime));
		$(END_TIME_PICKER_ELEM).data("DateTimePicker").date(reformatDateString(endTime));
	}

	onEventTitleChange (event) {
		this.setState({
			eventTitle: event.target.value,
		});
	}

	onEventDescriptionChange (event) {
		this.setState({
			eventDescription: event.target.value,
		});
	}

	resetCalendarForm() {
		console.log("Hello!");

		this.setState({
			eventTitle: '',
			eventDescription: '',
			editingEvent: false,
			creatingEvent: false,
			patchID: DEFAULT_PATCH_ID,
		});

		$(START_TIME_PICKER_ELEM).data("DateTimePicker").clear();
		$(END_TIME_PICKER_ELEM).data("DateTimePicker").clear();
	}

	submitNewCalendarEvent() {
		let startDate = new Date($(START_TIME_PICKER_ELEM).data()["date"]);
		let endDate = new Date($(END_TIME_PICKER_ELEM).data()["date"]);
		let eventTitle = $(CALENDAR_EVENT_TITLE).val();
		let eventDescription = $(CALENDAR_EVENT_DESCRIPTION).val();

		let body = {
			title: eventTitle,
			description: eventDescription,
			start_time: startDate,
			end_time: endDate,
		};

		this.state.editingEvent ?  (
			$.ajax({
				type: PATCH,
				url: '/events/' + this.state.patchID,
				data: body,
				dataType: 'json',
				success: function(data) {
					this.setState({
						events: data,
						editingEvent: false,
					});
					this.resetCalendarForm();
				}.bind(this),
				error: function(data) {
					console.log("Could not patch event");
				}
			})) : (
			$.ajax({
				type: POST,
				url: '/events',
				data: body,
				dataType: 'json',
				success: function(data) {
					this.setState({
						events: data,
						creatingEvent: false,
					});
					this.resetCalendarForm();
				}.bind(this),
				error: function(data) {
					console.log("Could not create new Calendar event");
				}
			})
		);
	}

	editCalendarEvent(id) {
		$.ajax({
			type: GET,
			url: '/events/' + id,
			dataType: 'json',
			success: function(data) {
				this.setState({
					editingEvent: true,
					patchID: id,
				})

				let title = data['title'];
				let description = data['description'];
				let startTime = data['start_time'];
				let endTime = data['end_time'];

				this._populateEditForm(title, description, startTime, endTime);
			}.bind(this),
			error: function(data) {
				console.log("Could not edit Calendar event");
			}
		})
	}

	deleteCalendarEvent(id) {
		$.ajax({
			type: DELETE,
			url: '/events/' + id,
			dataType: 'json',
			success: function(data){
				this.setState({
					events: data,
				});
			}.bind(this),
			error: function(data) {
				console.log("Could not delete Calendar event");
			}
		});
	}

	renderEvent(id, title, startDate, endDate) {
		// Format the start and end strings to be less verbose
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
					<span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={() => this.deleteCalendarEvent(id)}/>
				</td>
				<td>
					<span className="glyphicon glyphicon-edit" aria-hidden="true" onClick={() => this.editCalendarEvent(id)}/>
				</td>
			</tr>
		)
	}

	renderEvents() {
		return this.state.events.map((event) => this.renderEvent(event.id, event.title, event.start_time, event.end_time));
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

				<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this.setState({ creatingEvent: true })}>
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
								  placeholder={this.state.editingEvent ? this.state.eventTitle : ""}
								  onChange={this.onEventTitleChange}/>
							</div>
						</div>
						<div className="col-xs-12 calendar-event-description">
							<textarea
							  className="form-control"
							  rows="3"
							  id="event-description"
							  defaultValue={(this.state.editingEvent || this.state.creatingEvent) ? this.state.eventDescription : "Event Description"}
							  onChange={this.onEventDescriptionChange}/>
						</div>
						<div className='col-xs-6'>
							<label for="datetimepicker1">
								Start Time
							</label>
					        <div className="form-group">
					            <div className='input-group date' id='datetimepicker1'>
					                <input type='text' className="form-control" />
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
					<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this.submitNewCalendarEvent()}>
						{ this.state.editingEvent ?
							"Edit Event" :
							"Submit Event"
						}
					</button>
					<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this.resetCalendarForm()}>Cancel</button>
				</div>
			</div>
		);
	}
}