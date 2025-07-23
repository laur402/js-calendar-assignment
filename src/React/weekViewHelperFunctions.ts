import { LOAD_TIME, TIME_IN_A_WEEK_MS } from '../constants';
import { useAppSelector } from './redux/hooks';
import { CalendarEvent } from '../event-storage';

export function useWeekViewWeekOffsetDate() {
  return new Date(LOAD_TIME.getTime() + useWeekOffset() * TIME_IN_A_WEEK_MS);
}

function useWeekOffset() {
  const weekState = useAppSelector(state => state.weekViewWeekOffset);
  return weekState.value;
}

export function getOverlaps(
  events: CalendarEvent[],
  currentEventIndex: number,
) {
  const currentEvent = events[currentEventIndex];
  const overlappingEvents = events.slice(0, currentEventIndex).filter(value => {
    const maxTime = Math.max(
      currentEvent.eventStart.getTime(),
      value.eventStart.getTime(),
    );
    const minTime = Math.min(
      currentEvent.eventEnd.getTime(),
      value.eventEnd.getTime(),
    );
    return maxTime < minTime;
  });
  return overlappingEvents;
}
