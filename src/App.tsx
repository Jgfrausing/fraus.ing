import React from "react";
import Terminal from "./components/Terminal"; // Example Terminal component

const App: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: 0,
        margin: 0,
      }}
    >
      <h1>hi</h1>
      <Terminal />
    </div>
  );
};

export default App;
