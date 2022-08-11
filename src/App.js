import React from "react";
import "./App.css";
import { Graph } from "./components/Graph";
import { GraphNew } from "./components/GraphNew";

const mockData = {
  nodes: [{ id: "cat" }, { id: "dog" }],
  links: [{ source: "cat", target: "dog" }],
};

const App = () => {
  return (
    <div className="App">
      <Graph />
      {/* <GraphNew /> */}
    </div>
  );
};

export default App;
