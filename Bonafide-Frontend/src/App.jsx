import Validator from "./pages/Validator"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editdata from "./pages/EditData";
import Confirmation from "./pages/Confirmartion";
import VerifyAadhaar from "./pages/VerifyAadhaar";
import Home from "./pages/Home";
import AuthPage from "./pages/Auth";
import Contact from "./pages/Contact"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/validate" element={<Validator />} />
        <Route path="/edit-data" element={<Editdata />} />
        <Route path="/confirmation" element={<Confirmation/>} />
        <Route path="/verify-student" element={<VerifyAadhaar/>} />
        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/contact" element={<Contact/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;