window.onload = async () => {
    loadWeekView();
    await loadEventModal();
    tieHeaderButtons();
}


function tieHeaderButtons(){
    const header = document.getElementsByClassName('header')[0];
    const todayButton = header.getElementsByClassName('header-buttons__today')[0];
    const leftButton = header.getElementsByClassName("header-buttons__week-left")[0];
    const rightButton = header.getElementsByClassName("header-buttons__week-right")[0];

    todayButton.addEventListener("click", () => {
        weekOffset = 0;
        loadWeekView();
    });
    leftButton.addEventListener("click", (e) => {
        weekOffset -= 1;
        loadWeekView();
    });
    rightButton.addEventListener("click", (e) => {
        weekOffset += 1;
        loadWeekView();
    });
}