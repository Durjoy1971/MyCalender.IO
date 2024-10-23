import React from "react";
import moment from "moment-timezone";

export default function Sidebar({
  currentEvents,
  timezoneOptions,
  currentTimezone,
  handleTimezoneChange,
}) {
  const sortedEvents = currentEvents
    .filter((event) => moment(event.start).isSameOrAfter(moment().subtract(1, 'days')))
    .sort((a, b) => moment(a.start).diff(moment(b.start)));

  return (
    <div className="bg-gray-300 p-4 shadow-lg w-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Timezone</h2>
        <select
          value={currentTimezone}
          onChange={handleTimezoneChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timezoneOptions.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Upcoming Events ({sortedEvents.length})
        </h2>
        <ul className="space-y-3">
          {sortedEvents.map((event) => (
            <SidebarEvent
              key={event.id}
              event={event}
              currentTimezone={currentTimezone}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event, currentTimezone }) {
  return (
    <li key={event.id} className="p-4 bg-white rounded-lg shadow-md">
      <strong className="block text-orange-400 text-center font-bold">
        {event.title}
      </strong>
      {event.start && (
        (!event.allDay && (<div className="text-gray-600">
          <h1 className="font-medium text-teal-500">
            Starting From {moment(event.start).tz(currentTimezone).format("MMM D, YYYY")}
          </h1>
          <h1 className="font-semibold">
            At {moment(event.start).tz(currentTimezone).format("h:mm A")}
            {event.end && " - " + moment(event.end).tz(currentTimezone).format("h:mm A")}
          </h1>
        </div>))        
      )}
      {event.start && (
        (event.allDay && (<div className="text-gray-600">
          <h1 className="font-medium text-teal-500">
            Starting From {moment(event.start).tz(currentTimezone).format("MMM D, YYYY")}
          </h1>
          <h1 className="font-semibold"> Whole Day Event</h1>
        </div>))        
      )}
    </li>
  );
}
