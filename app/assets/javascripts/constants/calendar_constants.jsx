const DEFAULT_PATCH_ID = -1;
const START_TIME_PICKER_ELEM = '#datetimepicker1';
const END_TIME_PICKER_ELEM = '#datetimepicker2';
const CALENDAR_EVENT_TITLE = '#event-title';
const CALENDAR_EVENT_DESCRIPTION = '#event-description';

function reformatDateString (dateString) {
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