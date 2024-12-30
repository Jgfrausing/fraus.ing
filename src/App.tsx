import React from "react";
import Terminal from "./components/Terminal"; // Example Terminal component
import MarkdownRenderer from "./components/MarkdownRender";

const App: React.FC = () => {
  const [path, setPath] = React.useState<string | undefined>();
  return (
    <div className="App">
      {path && (
        <MarkdownRenderer filePath={path} onClose={() => setPath(undefined)} />
      )}
      <Terminal setPath={setPath} />
    </div>
  );
};

export default App;
