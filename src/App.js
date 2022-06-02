import "./App.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function App() {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const loadAppoinments = async () => {
      await fetch("http://localhost:5000/appoinments")
        .then((res) => res.json())
        .then((data) => setAllEvents(data));
    };
    loadAppoinments();
  }, []);

  const handleSubmit = (e) => {
    const data = {
      title: newEvent.title,
      start: format(newEvent.start, "PP"),
      end: format(newEvent.end, "PP"),
    };
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    fetch("http://localhost:5000/appoinments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-in">
            <div className="input-title">
              <label>Name</label>
              <div>
                <input
                  required
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  type="text"
                  name="title"
                  placeholder="Title of the booking"
                />
              </div>
            </div>
            <div>
              <label className="check">Check-in</label>
              <DatePicker
                dateFormat="dd/MM/yy"
                minDate={moment().toDate()}
                required
                placeholderText="Check In Date"
                selected={newEvent.start}
                onChange={(start) => setNewEvent({ ...newEvent, start })}
              />
            </div>
            <div>
              <label className="check">Check-Out</label>
              <DatePicker
                dateFormat="dd/MM/yy"
                minDate={moment().toDate()}
                required
                placeholderText="Check Out Date"
                selected={newEvent.end}
                onChange={(end) => setNewEvent({ ...newEvent, end })}
              />
            </div>
          </div>
          <div className="submit-btn">
            <input type="submit" value="Book Now" />
          </div>
        </form>
      </div>
      {allEvents.length > 0 && (
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      )}
    </div>
  );
}

export default App;
