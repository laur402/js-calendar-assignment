function CurrentTimeGraphic(currentTime: Date, columnHeight: number, currentTimeGraphicColumn: number) {
    const timeOfDay: number = currentTime.getTime() - getNormalizedLocalDate(currentTime).getTime(); //ms from start of day
    const currentTimeGraphicTop: number = (columnHeight * timeOfDay / TIME_IN_A_DAY_MS);

    return (
        <div className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic}
             style={{position: "absolute", top: currentTimeGraphicTop, gridColumn: `${currentTimeGraphicColumn+1} / span 1`}}>
            <div className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line} />
            <div className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble}
                 style={{position: "absolute"}} />
        </div>
    )
}