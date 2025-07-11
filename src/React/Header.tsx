import React from "react";

export function Header() {
    return (
        <header className="header">
            <div className="header__app-title">
                <img src="/logo.svg" alt="Calendar Logo" height="32"/>
                <h1>Calendar</h1>
            </div>
            <div className="header-buttons">
                <button className="header-buttons__today button-backgroundless"
                        onClick={async () => {
                            /*TODO:
                            setWeekOffset(0);
                            setSidebarCalendarOffset(0);
                            await reloadMainCalendarElements();
                            loadSidebarCalendar();*/
                }}>Today</button>
                <button className="header-buttons__week-left button-backgroundless button-borderless material-symbols-outlined"
                        onClick={async ()=>{
                            /*TODO:
                            setWeekOffset(getWeekOffset()-1);
                            await reloadMainCalendarElements();*/
                        }}>
                    chevron_left
                </button>
                <button className="header-buttons__week-right button-backgroundless button-borderless material-symbols-outlined"
                        onClick={async () => {
                            /*TODO:
                            setWeekOffset(getWeekOffset()+1);
                            await reloadMainCalendarElements();*/
                        }}>
                    chevron_right
                </button>
            </div>
            <h2 className="header__month-year-date">Month Year</h2>
        </header>
    );
}