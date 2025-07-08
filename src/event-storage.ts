"use strict";

async function addEvent(eventId: string, eventName: string, eventStart: Date, eventEnd: Date, eventDescription: string) {
    const eventToAdd: APIResponseEvent = {id: eventId, eventName, eventStart, eventEnd, eventDescription};
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

async function modifyEvent(eventId: string, eventName: string, eventStart: Date, eventEnd: Date, eventDescription: string) {
    const eventList: CalendarEvent[] = await fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        let event: CalendarEvent = eventList[i];
        if (event.eventId === eventId) {
            const APIEvent: APIResponseEvent = {id: eventId, eventName, eventStart, eventEnd, eventDescription};
            await fetch(`http://localhost:3000/events/${APIEvent.id}`, {
                method: "PUT",
                body: JSON.stringify(APIEvent)
            })
        }
    }
}

async function getEvent(eventId: string): Promise<CalendarEvent | null> {
    /*const eventList: CalendarEvent[] = await fetchEvents();
    for (let i = 0; i < eventList.length; i++) {
        const event: CalendarEvent = eventList[i];
        if (event.eventId === eventId) {
            return event;
        }
    }
    return null;*/
    const eventFetch = await fetch(`http://localhost:3000/events/${eventId}`);
    if (eventFetch.status === 200)
    {
        const eventJSON: APIResponseEvent[] = JSON.parse(await eventFetch.text(), (key, value) => {
            if (key === "eventStart" || key === "eventEnd") {
                return new Date(value);
            }
            else return value;
        });
        const event: CalendarEvent = {
            eventId: eventJSON[0].id,
            eventName: eventJSON[0].eventName,
            eventStart: eventJSON[0].eventStart,
            eventEnd: eventJSON[0].eventEnd,
            eventDescription: eventJSON[0].eventDescription
        }
        return event;
    }
    else return null;
}

async function fetchEvents(): Promise<CalendarEvent[]> {
    const eventsFetch = await fetch("http://localhost:3000/events");
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