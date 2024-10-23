

import React, { useState } from "react";

export default function DragableItem() {
  const [events, setEvents] = useState(["Enter Event For Drag"]);
  const [newEvent, setNewEvent] = useState("");

  const handleInputChange = (e) => {
    setNewEvent(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newEvent.trim() !== "") {
      setEvents([...events, newEvent]);
      setNewEvent("");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-100" id="external-events">
      <p>
        <strong>Draggable Events</strong>
      </p>
      <form onSubmit={handleFormSubmit} className="mb-4">
        <input
          type="text"
          value={newEvent}
          onChange={handleInputChange}
          placeholder="Add new event"
          className="border border-gray-300 rounded-lg p-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg w-full"
        >
          Add Event
        </button>
      </form>
      {events.map((event, idx) => (
        <div
          key={idx}
          className="fc-event p-2 mb-2 bg-blue-400 text-white cursor-pointer"
        >
          {event}
        </div>
      ))}
      <p className="flex gap-4">
        <input type="checkbox" id="drop-remove" />
        <label htmlFor="drop-remove">Remove after drop</label>
      </p>
    </div>
  );
}
