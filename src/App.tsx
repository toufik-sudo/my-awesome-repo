import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgentBuilder from "@/pages/AgentBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AgentBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
