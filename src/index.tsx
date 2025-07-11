import React from "react";
import ReactDOM from "react-dom/client"
import {Body} from "./React/Body";
function App() {
    return (
        <Body />
    );
}

window.onload = () => {
    let root = document.getElementById("root");
    if (root === null) return;
    ReactDOM.createRoot(root).render(<App/>)
}