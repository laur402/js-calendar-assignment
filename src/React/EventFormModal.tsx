import React, { CSSProperties, SyntheticEvent, useState } from 'react';
import '../../event-creation-modal-layout.css';
import { AttributeError } from '../helper-functions';
import { CLASSES, FORM_IDS } from '../constants';
import {
  addEvent,
  CalendarEvent,
  modifyEvent,
  removeEvent,
} from '../event-storage';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { modalInputModify } from './redux/modalInputSlice';
import {
  eventListAdd,
  eventListModify,
  eventListRemoveByID,
} from './redux/eventListSlice';
import { modalStateHide } from './redux/modalStateSlice';
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { Button } from './elements/Button';
import { Property } from 'csstype';
import { pseudoSelectorApplier } from './HelperFunctions';

export function EventFormModal() {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(state => state.modalState);
  const modalInputState = useAppSelector(state => state.modalInput);
  const [isTitleError, setIsTitleError] = useState(false);
  const [isTimeError, setIsTimeError] = useState(false);
  const errorPlaceholder = pseudoSelectorApplier(
    '::placeholder',
    { color: 'red' },
    CLASSES.EventCreationModal_Body_Form_Input_Error,
  );
  return (
    <section
      className={`${CLASSES.EventCreationModal_Body} ${CLASSES.EventCreationModal}`}
      style={{ ...Modal, display: `${modalState.value ? 'flex' : 'none'}` }}
    >
      <form
        className={`${CLASSES.EventCreationModal_Body_Form}`}
        id="new-event-modal-form"
        style={{ ...ModalContent }}
        onSubmit={e => {
          void handleEventFormInput(
            e,
            dispatch,
            v => setIsTitleError(v),
            v => setIsTimeError(v),
          );
        }}
      >
        <input
          className={`${CLASSES.EventCreationModal_Body_Form_EventID}`}
          type="hidden"
          name="event-id"
          value={modalInputState.modalEventID}
          onChange={e =>
            dispatch(modalInputModify({ modalEventID: e.target.value }))
          }
        />
        {errorPlaceholder.injectStyle()}
        <input
          className={`${CLASSES.EventCreationModal_Body_Form_TitleInput} \
          ${isTitleError ? errorPlaceholder.className : ''}`}
          id={FORM_IDS.EventTitle}
          name="event-title"
          type="text"
          placeholder="Event title"
          aria-label="Event title"
          value={modalInputState.modalEventName}
          onChange={e => {
            dispatch(
              modalInputModify({
                modalEventName: e.target.value,
              }),
            );
            setIsTitleError(false);
          }}
          style={{
            ...ModalContent__EventTitleInput,
            ...ModalContent__Inputs,
            ...(isTitleError && ModalContent__InputError),
          }}
        />

        <span
          className={`${CLASSES.MaterialSymbolsOutlined}`}
          style={{ ...ModalContent__Labels }}
        >
          calendar_clock
        </span>
        <div
          className={`${CLASSES.EventCreationModal_Body_Form_EventTimeInputs}`}
        >
          <input
            className={`${CLASSES.EventCreationModal_Body_Form_EventStartInput} \
            ${isTimeError ? errorPlaceholder.className : ''}`}
            id={FORM_IDS.EventStart}
            name="event-start"
            type="datetime-local"
            aria-label="Event start"
            value={modalInputState.modalEventStart}
            onChange={e => {
              dispatch(
                modalInputModify({
                  modalEventStart: e.target.value,
                }),
              );
              setIsTimeError(false);
            }}
            style={{
              ...ModalContent__Inputs,
              ...(isTimeError && ModalContent__InputError),
            }}
          />
          <input
            className={`${CLASSES.EventCreationModal_Body_Form_EventEndInput} \
            ${isTimeError ? errorPlaceholder.className : ''}`}
            id={FORM_IDS.EventEnd}
            name="event-end"
            type="datetime-local"
            aria-label="Event end"
            value={modalInputState.modalEventEnd}
            onChange={e => {
              dispatch(
                modalInputModify({
                  modalEventEnd: e.target.value,
                }),
              );
              setIsTimeError(false);
            }}
            style={{
              ...ModalContent__Inputs,
              ...(isTimeError && ModalContent__InputError),
            }}
          />
        </div>

        <span
          className={`${CLASSES.MaterialSymbolsOutlined}`}
          style={{ ...ModalContent__Labels }}
        >
          notes
        </span>
        <textarea
          className={`${CLASSES.EventCreationModal_Body_Form_EventDescriptionInput}`}
          id={FORM_IDS.EventDescription}
          name="event-description"
          placeholder="Add description"
          aria-label="Event description"
          value={modalInputState.modalEventDescription}
          onChange={e =>
            dispatch(
              modalInputModify({
                modalEventDescription: e.target.value,
              }),
            )
          }
          style={{ ...ModalContent__EventDescriptionInput }}
        ></textarea>

        <div
          className={`${CLASSES.EventCreationModal_Body_Form_Buttons}`}
          style={{ ...ModalContent__ButtonsContainer }}
        >
          <Button
            className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Close}`}
            onClick={event => {
              event?.preventDefault();
              dispatch(modalStateHide());
            }}
            style={{ ...ModalContent__Button }}
          >
            Cancel
          </Button>
          {modalInputState.isModalEventExisting && (
            <Button
              type="submit"
              className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Delete}`}
              style={{ ...ModalContent__Button }}
            >
              Delete
            </Button>
          )}
          <Button
            type="submit"
            className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Submit}`}
            style={{ ...ModalContent__Button, ...ModalContent__MainButton }}
            hoverStyles={{ backgroundColor: '#3399ff' }}
            activeStyles={{ backgroundColor: '#0e7ff0' }}
          >
            Save
          </Button>
        </div>
      </form>
    </section>
  );
}

const Modal = {
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '95dvw',
  minHeight: '95dvh',
};
const ModalContent = {
  display: 'grid',
  gridTemplateRows: /*2fr*/ '1fr 1fr 3fr 1fr',
  gridTemplateColumns: '0.1fr 1fr',
  gridGap: '0.5rem 1rem',
  backgroundColor: 'whitesmoke',
  borderRadius: '1rem',
  padding: '2rem 1rem',
};
const ModalContent__Labels = {
  paddingTop: '0.2rem',
  justifySelf: 'end',
};
const inputPadding = '0.5rem';
const ModalContent__Inputs = {
  padding: inputPadding,
};
const ModalContent__EventTitleInput = {
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '0.08rem solid gray',
  gridColumn: 2,
  fontSize: '1.2rem',
};
const ModalContent__EventDescriptionInput = {
  resize: 'none' as Property.Resize,
  padding: inputPadding,
};
const ModalContent__InputError = {
  borderColor: 'red',
};
const ModalContent__ButtonsContainer = {
  gridColumn: 'span 2',
  justifySelf: 'end',
  alignSelf: 'center',

  display: 'grid',
  gridAutoFlow: 'column',
};
const ModalContent__Button = {
  border: 'none',
  backgroundColor: 'transparent',
  padding: '0 0.4rem',
  color: 'dodgerblue',
};
const ModalContent__MainButton = {
  backgroundColor: 'dodgerblue',
  border: 'none',
  borderRadius: '100000000rem',
  color: 'white',
  fontWeight: 'bold',
  padding: '0.4rem 0.8rem',
  marginLeft: '0.2rem',
};

async function handleEventFormInput(
  event: SyntheticEvent,
  dispatch: ThunkDispatch<unknown, unknown, Action>,
  setIsTitleError: (value: boolean) => void,
  setIsTimeError: (value: boolean) => void,
) {
  event.preventDefault();
  const formData: FormData = new FormData(event.target as HTMLFormElement);
  const eventData = extractFormData(formData);

  const eventSubmitter = (event.nativeEvent as SubmitEvent).submitter;
  const isDeleteButton = eventSubmitter?.classList.contains(
    CLASSES.EventCreationModal_Body_Form_Buttons_Delete,
  );
  if (isDeleteButton) {
    await removeEvent(eventData.eventId);
    dispatch(eventListRemoveByID(eventData.eventId));
    dispatch(modalStateHide());
    return;
  }
  const validationResult = validateForm(eventData);
  switch (validationResult.type) {
    case 'success':
      dispatch(modalStateHide());
      await dispatchEvent(eventData, dispatch);
      break;
    case 'error':
      switch (validationResult.error) {
        case ValidationErrorTypes.Title:
          setIsTitleError(true);
          break;
        case ValidationErrorTypes.Time:
          setIsTimeError(true);
          break;
      }
      break;
  }
}

function extractFormData(formData: FormData) {
  const eventID = formData.get(FORM_IDS.EventID) as string | null;
  if (eventID === null)
    throw new AttributeError('Cannot get event-id form attribute');
  const eventData: EventFormData = {
    eventId: eventID,
    eventName: (formData.get(FORM_IDS.EventTitle) as string | null) ?? '',
    eventStart: (formData.get(FORM_IDS.EventStart) as string | null) ?? '',
    eventEnd: (formData.get(FORM_IDS.EventEnd) as string | null) ?? '',
    eventDescription:
      (formData.get(FORM_IDS.EventDescription) as string | null) ?? '',
  };
  return eventData;
}

function validateForm(eventData: EventFormData): ValidationReturn {
  if (eventData.eventName === '') {
    return {
      type: 'error',
      error: ValidationErrorTypes.Title,
    };
  }
  if (
    eventData.eventStart === '' ||
    eventData.eventEnd === '' ||
    new Date(eventData.eventStart).getTime() >=
      new Date(eventData.eventEnd).getTime()
  ) {
    return {
      type: 'error',
      error: ValidationErrorTypes.Time,
    };
  }
  return { type: 'success' };
}

async function dispatchEvent(
  eventData: EventFormData,
  dispatch: ThunkDispatch<unknown, unknown, Action>,
) {
  const calendarEvent: CalendarEvent = {
    eventId: eventData.eventId ?? performance.now().toString(),
    eventName: eventData.eventName,
    eventStart: new Date(eventData.eventStart),
    eventEnd: new Date(eventData.eventEnd),
    eventDescription: eventData.eventDescription,
  };
  if (eventData.eventId === '') {
    calendarEvent.eventId = performance.now().toString();
    await addEvent(calendarEvent);
    dispatch(eventListAdd(calendarEvent));
  } else if (eventData.eventId !== undefined) {
    await modifyEvent(calendarEvent);
    dispatch(eventListModify(calendarEvent));
  }
}

interface ValidationError {
  type: 'error';
  error: ValidationErrorTypes;
}
interface ValidationSuccess {
  type: 'success';
}
type ValidationReturn = ValidationSuccess | ValidationError;
enum ValidationErrorTypes {
  Title,
  Time,
}

interface EventFormData {
  eventId: string;
  eventName: string;
  eventStart: string;
  eventEnd: string;
  eventDescription: string;
}
