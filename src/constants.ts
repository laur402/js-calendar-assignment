export const THREE_LETTER_MONTHS: readonly string[] =
  getMonthLabelsByLocale('short');
export const TIME_IN_A_WEEK_MS: number = 7 * 24 * 60 * 60 * 1000;
export const TIME_IN_A_DAY_MS: number = 24 * 60 * 60 * 1000; //ms in a day
export const TIME_IN_AN_HOUR_MS: number = 60 * 60 * 1000;
export const TIME_IN_A_MINUTE_MS: number = 60 * 1000;
export const MONTHS: readonly string[] = getMonthLabelsByLocale('long');
export const THREE_LETTER_WEEK_DAYS: readonly string[] =
  getWeekdayLabelsByLocale('short').map(value => value.toUpperCase());
export const LOAD_TIME: Date = new Date();

export enum WeekDays {
  'Sunday' = 0,
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
}

export enum CLASSES {
  EventCreationModal = 'event-creation-modal',
  EventCreationModalContent = 'event-creation-modal-content',
  EventCreationModal_Body = 'modal',
  EventCreationModal_Body_Form = 'modal-content',
  EventCreationModal_Body_Form_EventID = 'modal-content__event-id',
  EventCreationModal_Body_Form_TitleInput = 'modal-content__event-title-input',
  EventCreationModal_Body_Form_EventTimeInputs = 'modal-content__event-time-inputs',
  EventCreationModal_Body_Form_EventStartEndLabel = 'modal-content__event-start-label',
  EventCreationModal_Body_Form_EventStartInput = 'modal-content__event-start-input',
  EventCreationModal_Body_Form_EventEndInput = 'modal-content__event-end-input',
  EventCreationModal_Body_Form_EventDescriptionLabel = 'modal-content__event-description-label',
  EventCreationModal_Body_Form_EventDescriptionInput = 'modal-content__event-description-input',
  EventCreationModal_Body_Form_Buttons = 'modal-content__buttons',
  EventCreationModal_Body_Form_Buttons_Close = 'modal-content__buttons--close',
  EventCreationModal_Body_Form_Buttons_Delete = 'modal-content__buttons--delete',
  EventCreationModal_Body_Form_Buttons_Submit = 'modal-content__buttons--submit',
  EventCreationModal_Body_Form_Input_Error = 'modal-content__input--error',

  Header = 'header',
  Header_AppTitle = 'header__app-title',
  Header_Buttons = 'header-buttons',
  Header_Buttons_Today = 'header-buttons__today',
  Header_Buttons_WeekLeft = 'header-buttons__week-left',
  Header_Buttons_WeekRight = 'header-buttons__week-right',
  Header_MonthYearDate = 'header__month-year-date',

  Aside = 'aside',
  Aside_CreateEventButton = 'create-event-button',
  Aside_CalendarModule = 'calendar-module',
  CalendarModule_Header = 'calendar-module__header',
  CalendarModule_Header_Date = 'calendar-module-header__date',
  CalendarModule_Header_Buttons = 'calendar-module-header__buttons',
  CalendarModule_Header_Buttons_Left = 'calendar-module-header-buttons__month-left',
  CalendarModule_Header_Buttons_Right = 'calendar-module-header-buttons__month-right',

  CalendarModule_WeekDayRowCell = 'calendar-module__week-day-row-cell',
  CalendarModule_DayCell = 'calendar-module__day-cell',
  CalendarModule_DayCell_NotCurrent = 'calendar-module__day-cell-not-current',

  WeekViewContainer = 'week-view-container',
  WeekView_DatesHeader = 'week-view__dates-header',
  WeekView_DatesHeader_DateContainer = 'week-view__dates-header-date-container',
  WeekView_DatesHeader_DateContainer_Timezone = 'week-view__dates-header-timezone',
  WeekView_DatesHeader_DateContainer_Date = 'week-view__dates-header-date',
  WeekView_DatesHeader_DateContainer_Date_Active = 'week-view__dates-header-date--active',
  WeekView_DatesHeader_DateContainer_Date_Weekday = 'calendar-date-weekday',
  WeekView_DatesHeader_DateContainer_Date_Day = 'calendar-date-day',
  WeekView_DatesHeader_AllDayRow = 'dates-header__all-day-row',
  WeekView_DatesHeader_AllDayRow_Cell = 'all-day-row__cell',

  WeekView_CalendarContainer = 'week-view__calendar-container',
  WeekView_CalendarEventOverlay = 'week-view__calendar-event-overlay',
  WeekView_CalendarEventOverlay_EventBox = 'calendar-event-overlay__event-box',
  WeekView_CalendarEventOverlay_EventBox_EventTitle = 'event-box__event-title',
  WeekView_CalendarEventOverlay_EventBox_EventTime = 'event-box__event-time',
  WeekView_CalendarEventOverlay_CurrentTimeGraphic = 'calendar-event-overlay__current-time-graphic',
  WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line = 'current-time-graphic__line',
  WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble = 'current-time-graphic__bauble',
  WeekView_CalendarGrid = 'week-view__calendar-grid',
  WeekView_CalendarGrid_TimeColumn = 'calendar-grid__time-column',
  WeekView_CalendarGrid_TimeColumn_Cell = 'time-column__cell',
  WeekView_CalendarGrid_CalendarColumn = 'calendar-grid__calendar-column',
  WeekView_CalendarGrid_CalendarColumn_Cell = 'calendar-column__calendar-cell',
  WeekView_CalendarGrid_CalendarColumn_Cell_Button = 'calendar-cell__button',

  Button_Backgroundless = 'button-backgroundless',
  Button_Borderless = 'button-borderless',
  NewEventModalCaller = 'new-event-modal-caller',
  MaterialSymbolsOutlined = 'material-symbols-outlined',
}

export enum ATTRIBUTES {
  CalendarDay = 'data-calendar-day',
  EventID = 'data-event-id',
  SidebarCalendarDate = 'data-sidebar-calendar-date',
}
export enum FORM_IDS {
  EventID = 'event-id',
  EventStart = 'event-start',
  EventEnd = 'event-end',
  EventTitle = 'event-title',
  EventDescription = 'event-description',
}

export type DateTimeFormatOptionsMonths =
  | 'numeric'
  | '2-digit'
  | 'long'
  | 'short'
  | 'narrow'
  | undefined;
export function getMonthLabelsByLocale(
  monthFormat: DateTimeFormatOptionsMonths = 'numeric',
  locale?: string,
) {
  const format = new Intl.DateTimeFormat(locale, { month: monthFormat });
  return [...Array(12).keys()].map(value =>
    format.format(new Date(2000, value, 1)),
  );
}
export type DateTimeFormatOptionsWeekdays =
  | 'long'
  | 'short'
  | 'narrow'
  | undefined;
export function getWeekdayLabelsByLocale(
  weekdayFormat: DateTimeFormatOptionsWeekdays,
  locale?: string,
) {
  const format = new Intl.DateTimeFormat(locale, { weekday: weekdayFormat });
  return [...Array(7).keys()].map(value =>
    format.format(
      new Date().getTime() - (new Date().getDay() - value) * TIME_IN_A_DAY_MS,
    ),
  );
}
