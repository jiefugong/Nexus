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
			$('#datetimepicker1').datetimepicker();
			$('#datetimepicker2').datetimepicker();
		});
	}

	componentWillMount() {
		this.setState({
			events: this.props.events
		});
	}

	// TODO: Improve style and move to a separate file
	_reformatDateString (dateString) {
		let splitString = dateString.split('T');
		let dateComponent = splitString[0];
		let timeComponent = splitString[1];

		dateComponent = dateComponent.split('-');
		let year = dateComponent[0];
		let month = dateComponent[1];
		let day = dateComponent[2];

		timeComponent = timeComponent.split('.')[0].split(':');
		let hour = timeComponent[0];
		let minutes = timeComponent[1];
		let timeOfDay = parseInt(hour) < 12 ? 'AM' : 'PM';

		let formattedString = month + "/" + day + "/" + year + " " + hour + ":" + minutes + " " + timeOfDay;
		return formattedString;
	}

	_populateEditForm(title, description, startTime, endTime) {
		$("#event-title").val(title);
		$("#event-description").val(description);
		$('#datetimepicker1').data("DateTimePicker").date(this._reformatDateString(startTime));
		$('#datetimepicker2').data("DateTimePicker").date(this._reformatDateString(endTime));
	}

	toggleCalendarForm() {
		let $calendarForm = $(".calendar-form");
		$calendarForm.hasClass("hidden") ? $calendarForm.removeClass("hidden") : $calendarForm.addClass("hidden");
	}

	resetCalendarForm() {
		$("#event-title").val('');
		$("#event-description").val('');
		$("#datetimepicker1").data("DateTimePicker").clear();
		$("#datetimepicker2").data("DateTimePicker").clear();
		this.toggleCalendarForm();
	}

	submitNewCalendarEvent() {
		let startDate = new Date($("#datetimepicker1").data()["date"]);
		let endDate = new Date($("#datetimepicker2").data()["date"]);
		let eventTitle = $("#event-title").val();
		let eventDescription = $("#event-description").val();

		let body = {
			title: eventTitle,
			description: eventDescription,
			start_time: startDate,
			end_time: endDate,
		};

		!this.state.patching ?  (
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
			})) : (
			$.ajax({
				type: PATCH,
				url: '/events/' + this.state.patchID,
				data: body,
				dataType: 'json',
				success: function(data) {
					console.log(data);

					this.setState({
						events: data,
						patching: false,
						patchID: DEFAULT_PATCH_ID,
					});

					this.resetCalendarForm();
				}.bind(this),
				error: function(data) {
					console.log("Could not patch event");
				}
			})
		);
	}

	editCalendarEvent(id) {
		// Get the event information based on the id
		// Populate the form and allow the user to edit it
		// On save, patch the item
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

				this.toggleCalendarForm();
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
				console.log(data);
				this.setState({
					events: data,
				});
			}.bind(this),
			error: function(data) {
				console.log("Could not delete Calendar event");
			}
		});
	}

	renderEvent(id, title) {
		return (
			<tr key={id} className="calendar-event-row">
				<td>
					{title}
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
		return this.state.events.map((event) => this.renderEvent(event.id, event.title));
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
							</td>
							<td>
							</td>
						</tr>
						{this.renderEvents()}
					</tbody>
				</table>
				<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this.toggleCalendarForm()}>New Event</button>
				<div className="calendar-form well hidden">
					<div className="row">
						<div className="col-xs-8 calendar-event-title">
							<div className="input-group">
							  <span className="input-group-addon" id="basic-addon3"> Event Title </span>
							  <input type="text" className="form-control" id="event-title" aria-describedby="basic-addon3"/>
							</div>
						</div>
						<div className="col-xs-12 calendar-event-description">
							<textarea className="form-control" rows="3" id="event-description" defaultValue="Event Description"/>
						</div>
						<div className='col-xs-6'>
							<label for="datetimepicker1">Start Time</label>
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
					    	<label for="datetimepicker2">End Time</label>
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
					<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this.submitNewCalendarEvent()}>Submit Event</button>
					<button type="submit" className="btn btn-primary calendar-btn" onClick={() => this.resetCalendarForm()}>Cancel</button>
				</div>
			</div>
		);
	}
}