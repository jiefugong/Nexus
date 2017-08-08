class CalendarSettingsModule extends React.Component {

	constructor() {
		super();
		this.state = {
			events: null,
			patching: false,
			patchID: DEFAULT_PATCH_ID,
		};
	}

	componentDidMount() {
		$(function() {
			$(START_TIME_PICKER_ELEM).datetimepicker();
			$(END_TIME_PICKER_ELEM).datetimepicker();
		});
	}

	componentWillMount() {
		this.setState({
			events: this.props.events
		});
	}

	_populateEditForm(title, description, startTime, endTime) {
		$(CALENDAR_EVENT_TITLE).val(title);
		$(CALENDAR_EVENT_DESCRIPTION).val(description);
		$(START_TIME_PICKER_ELEM).data("DateTimePicker").date(reformatDateString(startTime));
		$(END_TIME_PICKER_ELEM).data("DateTimePicker").date(reformatDateString(endTime));
	}

	_toggleCalendarForm() {
		let $calendarForm = $(".calendar-form");
		$calendarForm.hasClass("hidden") ? $calendarForm.removeClass("hidden") : $calendarForm.addClass("hidden");
	}

	resetCalendarForm() {
		$(CALENDAR_EVENT_TITLE).val('');
		$(CALENDAR_EVENT_DESCRIPTION).val('');
		$(START_TIME_PICKER_ELEM).data("DateTimePicker").clear();
		$(END_TIME_PICKER_ELEM).data("DateTimePicker").clear();

		this.setState({
			patching: false,
			patchID: DEFAULT_PATCH_ID,
		});

		this._toggleCalendarForm();
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

		this.state.patching ?  (
			$.ajax({
				type: PATCH,
				url: '/events/' + this.state.patchID,
				data: body,
				dataType: 'json',
				success: function(data) {
					this.setState({
						events: data,
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
					patching: true,
					patchID: id,
				})

				let title = data['title'];
				let description = data['description'];
				let startTime = data['start_time'];
				let endTime = data['end_time'];

				this._toggleCalendarForm();
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

				<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this._toggleCalendarForm()}>
					New Event
				</button>

				<div className="calendar-form well hidden">
					<div className="row">
						<div className="col-xs-8 calendar-event-title">
							<div className="input-group">
								<span className="input-group-addon" id="basic-addon3">
									Event Title
								</span>
								<input type="text" className="form-control" id="event-title" aria-describedby="basic-addon3"/>
							</div>
						</div>
						<div className="col-xs-12 calendar-event-description">
							<textarea className="form-control" rows="3" id="event-description" defaultValue="Event Description"/>
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
						{ this.state.patching ?
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