import React from "react";

export function WeekView() {
    return (
        <section className="week-view-container">
            <header className="week-view__dates-header">
                <div className="week-view__dates-header-date-container">
                    <div className="week-view__dates-header-timezone">
                        GMT+0
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                    <div className="week-view__dates-header-date">
                        <div className="calendar-date-weekday">MON</div>
                        <div className="calendar-date-day">16</div>
                    </div>
                </div>
                <div className="dates-header__all-day-row">
                    <div className="all-day-row__cell"></div>
                    <div className="all-day-row__cell"></div>
                    <div className="all-day-row__cell"></div>
                    <div className="all-day-row__cell"></div>
                    <div className="all-day-row__cell"></div>
                    <div className="all-day-row__cell"></div>
                    <div className="all-day-row__cell"></div>
                </div>
            </header>
            <section className="week-view__calendar-container">
                <div className="week-view__calendar-event-overlay"></div>
                <section className="week-view__calendar-grid">
                    {/*Calendar grid columns*/}
                </section>
            </section>
        </section>
    );
}