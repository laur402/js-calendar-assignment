"use strict";

async function addEvent(event: CalendarEvent) {
    const eventToAdd: APIResponseEvent = {
        id: event.eventId,
        eventName: event.eventName,
        eventStart: event.eventStart,
        eventEnd: event.eventEnd,
        eventDescription: event.eventDescription
    };
    await fetch(`http://localhost:3000/events`, {
        method: "POST",
        body: JSON.stringify(eventToAdd)
    });
}

async function removeEvent(eventId: string) {
    await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE"
    });
}

async function modifyEvent(event: CalendarEvent) {
    const APIEvent: APIResponseEvent = {
        id: event.eventId,
        eventName: event.eventName,
        eventStart: event.eventStart,
        eventEnd: event.eventEnd,
        eventDescription: event.eventDescription
    };
    const value: Response = await fetch(`http://localhost:3000/events/${APIEvent.id}`, {
        method: "PUT",
        body: JSON.stringify(APIEvent)
    })
    if (value.status !== 200) {
        throw new Error("Event ID doesn't exist");
    }
}

async function getEvent(eventId: string): Promise<CalendarEvent | null> {
    const eventFetch: Response = await fetch(`http://localhost:3000/events/${eventId}`);
    if (eventFetch.status === 200)
    {
        const eventJSON: APIResponseEvent = JSON.parse(await eventFetch.text(), (key, value) => {
            if (key === "eventStart" || key === "eventEnd") {
                return new Date(value);
            }
            else return value;
        });
        const event: CalendarEvent = {
            eventId: eventJSON.id,
            eventName: eventJSON.eventName,
            eventStart: eventJSON.eventStart,
            eventEnd: eventJSON.eventEnd,
            eventDescription: eventJSON.eventDescription
        }
        return event;
    }
    else return null;
}

async function fetchEvents(): Promise<CalendarEvent[]> {
    let eventsFetch: Response | null = await asyncTryCatch(() => fetch("http://localhost:3000/events"),
        null, ()=> alert("Events server is unavailable!"));
    if (eventsFetch === null) return [];

    if (eventsFetch.status !== 200) throw new Error("Invalid event server link");
    const APIEventList: APIResponseEvent[] = JSON.parse(await eventsFetch.text(), (key, value) => {
        if (key === "eventStart" || key === "eventEnd") {
            return new Date(value);
        }
        else return value;
    });
    const eventList: CalendarEvent[] = APIEventList.map((event: APIResponseEvent) => ({
        eventId: event.id,
        eventName: event.eventName,
        eventStart: event.eventStart,
        eventEnd: event.eventEnd,
        eventDescription: event.eventDescription
    }));
    eventList.sort((a: CalendarEvent, b: CalendarEvent) => a.eventStart.getTime() - b.eventStart.getTime());

    return eventList;
}

type CalendarEvent = {
    eventId: string;
    eventName: string;
    eventStart: Date;
    eventEnd: Date;
    eventDescription: string;
}
type APIResponseEvent = {
    id: string,
    eventName: string;
    eventStart: Date;
    eventEnd: Date;
    eventDescription: string;
}