import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { createEventId } from "./helperFunction";
import Sidebar from "./Sidebar";
import moment from "moment-timezone";
import Swal from "sweetalert2";
import DragableItem from "./DragableItem";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";

export default function Calender() {
  const [currentEvents, setCurrentEvents] = useState(
    JSON.parse(localStorage.getItem("calendarEvents")) || []
  );
  const [currentTimezone, setCurrentTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "local"
  );
  const [timezoneOptions, setTimezoneOptions] = useState([]);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(currentEvents));
  }, [currentEvents]);

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(userTimezone);
    const timezones = moment.tz.names().slice(0, -1);
    setTimezoneOptions([...timezones]);
  }, []);

  async function handleDateSelect(selectInfo) {
    const { value: title } = await Swal.fire({
      title: "Enter event details",
      input: "text",
      inputLabel: "Event Title",
      inputPlaceholder: "Enter event title",
      showCancelButton: true,
    });

    if (title) {
      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  async function handleEventClick(clickInfo) {
    const result = await Swal.fire({
      title: `Are you sure you want to delete the event '${clickInfo.event.title}'?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      clickInfo.event.remove();
      Swal.fire({
        title: "Deleted!",
        text: "The event has been deleted.",
        icon: "success",
        timer: 800,
        showConfirmButton: false,
      });
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

  function handleTimezoneChange(event) {
    setCurrentTimezone(event.target.value);
  }

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          id: Date.now(),
          title: eventEl.innerText,
        };
      },
    });
  }, []);

  return (
    <div className="flex justify-start items-center gap-4 p-6">
      <div className="flex flex-col gap-10">
        <Sidebar
          currentEvents={currentEvents}
          timezoneOptions={timezoneOptions}
          currentTimezone={currentTimezone}
          handleTimezoneChange={handleTimezoneChange}
        />
        <DragableItem />
      </div>

      <div className="bg-teal-100/90 w-[85%]">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            momentTimezonePlugin,
            listPlugin,
          ]}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          }}
          headerToolbar={{
            left: "prev,today,next",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth,listWeek",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          initialEvents={currentEvents} // existed event show korbe
          select={handleDateSelect} // Kono Date Select korle Trigger
          eventClick={handleEventClick} // Delete Event
          eventsSet={handleEvents}
          timeZone={currentTimezone}
          height={"800px"}
          defaultTimedEventDuration="00:30:00"
          droppable={true} // Allows external events to be dropped onto the calendar
          drop={function (info) {
            let checkbox = document.getElementById("drop-remove");
            if (checkbox.checked) {
              info.draggedEl.parentNode.removeChild(info.draggedEl);
            }
          }}
          eventReceive={(info) => {
            if (
              info.view.type === "timeGridWeek" ||
              info.view.type === "timeGridDay"
            ) {
              const calendarApi = info.view.calendar;
              const event = info.event;
              const start = event.start;
              const end = moment(start).add(30, "minutes").toDate();
              calendarApi.getEventById(event.id).setEnd(end);
            } else {
              const calendarApi = info.view.calendar;
              const event = info.event;
              const start = event.start;
              let end = event.end;
              let allDay = true;
              calendarApi
                .getEventById(event.id)
                .setDates(start, end, { allDay });
            }
          }}
        />
      </div>
    </div>
  );
}
