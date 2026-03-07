import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AgentBuilder from "@/pages/AgentBuilder";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" theme="dark" richColors />
      <Routes>
        <Route path="/" element={<AgentBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
