import React from 'react';
import { useEffect, useState } from 'react';
import { getTimePercentageOfDay } from '../../helper-functions';
import { CLASSES, TIME_IN_A_MINUTE_MS } from '../../constants';

export function CurrentTimeGraphic({
    currentTimeGraphicColumn,
}: {
    currentTimeGraphicColumn: number;
}) {
    const [currentTimeGraphicTop, setCurrentTimeGraphicTop] = useState(
        getTimePercentageOfDay(new Date()),
    );
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTimeGraphicTop(getTimePercentageOfDay(new Date()));
        }, TIME_IN_A_MINUTE_MS);
        return () => clearInterval(timer);
    });
    return (
        <div
            className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic}
            style={{
                position: 'absolute',
                top: `${currentTimeGraphicTop}%`,
                gridColumn: `${currentTimeGraphicColumn + 1} / span 1`,
            }}
        >
            <div
                className={
                    CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line
                }
            />
            <div
                className={
                    CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble
                }
                style={{ position: 'absolute' }}
            />
        </div>
    );
}
