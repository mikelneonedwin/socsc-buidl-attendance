import { Route, Routes } from "react-router";
import Home from "./pages/home";
import History from "./pages/history";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
