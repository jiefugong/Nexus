class CalendarView extends React.Component {
  componentDidMount() {
    $('#calendar').fullCalendar({
      eventSources: ['/events.json'],
    });
  }

  render() {
  	return (
      <div id="calendar" />
    );
  }
}
