import React from 'react';
import { addHours, toISOLocaleString } from '../helper-functions';
import { SidebarCalendarModule } from './components/SidebarCalendarModule';
import { useAppDispatch } from './redux/hooks';
import { modalStateShow } from './redux/modalStateSlice';
import { modalInputModify } from './redux/modalInputSlice';
import { Button } from './elements/Button';
import { Text } from './elements/Text';

export function Aside() {
  const dispatch = useAppDispatch();
  return (
    <aside className="aside">
      <Button
        className="create-event-button new-event-modal-caller"
        onClick={() => {
          dispatch(modalStateShow());
          dispatch(
            modalInputModify({
              modalEventID: '',
              modalEventName: '',
              modalEventStart: toISOLocaleString(new Date()),
              modalEventEnd: toISOLocaleString(addHours(new Date(), 1)),
              modalEventDescription: '',
              isModalEventExisting: false,
            }),
          );
        }}
      >
        <span className="material-symbols-outlined">add</span>
        <Text textSize={1.2}>Create Event</Text>
      </Button>
      <SidebarCalendarModule />
    </aside>
  );
}
