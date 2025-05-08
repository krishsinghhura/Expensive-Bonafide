import Validator from "./pages/Validator"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editdata from "./pages/EditData";
import Confirmation from "./pages/Confirmartion";
import VerifyAadhaar from "./pages/VerifyAadhaar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/validate" element={<Validator />} />
        <Route path="/edit-data" element={<Editdata />} />
        <Route path="/confirmation" element={<Confirmation/>} />
        <Route path="/verify-student" element={<VerifyAadhaar/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;