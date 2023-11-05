import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FormsModal from "../../../components/modal/FormsModal";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
}

const Calendar: React.FC = () => {
  // Load events from local storage when the component mounts
  const [currentEvents, setCurrentEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Save events to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(currentEvents));
  }, [currentEvents]);

  const handleDateClick = (selected: any) => {
    setSelectedDate(selected.dateStr);
    if (selected.dateStr) {
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (eventInfo: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${eventInfo.event.title}'`
      )
    ) {
      const newEvents = currentEvents.filter(
        (event: Event) => event.id !== eventInfo.event.id
      );
      setCurrentEvents(newEvents);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = (
      e.currentTarget.elements.namedItem("title") as HTMLInputElement
    )?.value;
    if (title && selectedDate) {
      const newEvent: Event = {
        id: `${selectedDate}-${title}`,
        title,
        start: selectedDate,
        end: selectedDate,
        allDay: true,
      };
      setCurrentEvents([...currentEvents, newEvent]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="m-auto p-4">
      <header className="mb-4">
        <h1 className="text-2xl">Calendar</h1>
        <p className="text-sm text-gray-500">Full Calendar Interactive Page</p>
      </header>

      <div className="flex space-x-4">
        {/* CALENDAR SIDEBAR */}
        <div className="flex flex-col h-full w-1/4 bg-[#404258] p-4 rounded">
          <h2 className="text-lg font-poppin font-bold text-white">
            Task / Events
          </h2>
          <ul className="mt-2 space-y-2">
            {currentEvents.map((event) => (
              <li
                key={event.id}
                className="bg-cyan-500 rounded p-2 mt-6 text-gray-800"
              >
                <h3 className="font-bold text-white w-64">{event.title}</h3>
                <p className="text-white">
                  {new Date(event.start).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* CALENDAR */}
        <div className="flex-1 w-full h-72">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={currentEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            contentHeight="auto"
          />
        </div>
      </div>

      <FormsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(e);
          }}
          className="flex flex-col space-y-4"
        >
          <h2 className="text-lg font-bold">Create Task</h2>
          <label className="flex flex-col">
            Task:
            <input
              name="title"
              type="text"
              required
              className="border p-2 rounded"
            />
          </label>
          <button type="submit" className="bg-cyan-600 text-white p-2 rounded">
            Create event
          </button>
        </form>
      </FormsModal>
    </div>
  );
};

export default Calendar;
