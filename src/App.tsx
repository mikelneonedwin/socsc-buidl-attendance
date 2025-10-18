import { Route, Routes, Outlet } from "react-router";
import Home from "./pages/home";
import History from "./pages/history";
import Header from "./components/header";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
