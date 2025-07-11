import React from "react";

export function Aside() {
    return (
        <aside className="aside">
            <button className="create-event-button new-event-modal-caller"><span
                className="material-symbols-outlined">add</span><span>Create Event</span></button>
            <div className="calendar-module">
                <div className="calendar-module__header">
                    <div className="calendar-module-header__date">Month Year</div>
                    <div className="calendar-module-header__buttons">
                        <button
                            className="calendar-module-header-buttons__month-left button-backgroundless button-borderless material-symbols-outlined">chevron_left
                        </button>
                        <button
                            className="calendar-module-header-buttons__month-right button-backgroundless button-borderless material-symbols-outlined">chevron_right
                        </button>
                    </div>
                </div>
                <div className="calendar-module__week-day-row-cell">M</div>
                <div className="calendar-module__week-day-row-cell">T</div>
                <div className="calendar-module__week-day-row-cell">W</div>
                <div className="calendar-module__week-day-row-cell">T</div>
                <div className="calendar-module__week-day-row-cell">F</div>
                <div className="calendar-module__week-day-row-cell">S</div>
                <div className="calendar-module__week-day-row-cell">S</div>
                {/* Calendar module date buttons */}
            </div>
        </aside>
    )
}