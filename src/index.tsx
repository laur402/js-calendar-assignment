import React from "react";
import ReactDOM from "react-dom/client"
function App() {
    return (
        <>
            <div className={"testing"}>Hello world!</div>
        </>
    );
}

window.onload = () => {
    let root = document.getElementById("root");
    if (root === null) return;
    ReactDOM.createRoot(root).render(<App/>)
}