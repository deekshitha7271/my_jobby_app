import { BrowserRouter, Routes, Route } from "react-router-dom";
import Jobs from "./Components/Jobs";
import JobItemDetails from "./Components/JobItemDetails";
import Home from "./Components/Home";
import LoginForm from "./Components/LoginForm";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobItemDetails />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;