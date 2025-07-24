import React, { CSSProperties } from 'react';
import { addHours, toISOLocaleString } from '../helper-functions';
import { SidebarCalendarModule } from './components/SidebarCalendarModule';
import { useAppDispatch } from './redux/hooks';
import { modalStateShow } from './redux/modalStateSlice';
import { modalInputModify } from './redux/modalInputSlice';
import { Button } from './elements/Button';
import { Text } from './elements/Text';
import { STYLE_VARS } from './StyleVariables';

export function Aside() {
  const dispatch = useAppDispatch();
  return (
    <aside className="aside" style={AsideStyle}>
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
        style={CreateEventButtonStyle}
        hoverStyles={{ backgroundColor: '#f2f2f2' }}
        activeStyles={{ backgroundColor: '#ebebeb' }}
      >
        <span className="material-symbols-outlined">add</span>
        <Text textSize={1.2}>Create Event</Text>
      </Button>
      <SidebarCalendarModule />
    </aside>
  );
}
const AsideStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  padding: '0 1.5rem',
  borderRight: `1px solid ${STYLE_VARS.colorGray}`,
};
const CreateEventButtonStyle = {
  marginTop: '1rem',
  padding: '0.5rem 1rem',
  fontSize: '1.25rem',
  borderRadius: '1rem',
  border: 'none',
  boxShadow: `${STYLE_VARS.colorGrayShadow} 0 0.1rem 0.3rem`,
  backgroundColor: STYLE_VARS.colorWhiteOnColor,
  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
