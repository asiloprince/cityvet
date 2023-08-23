import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFoundPage from "./pages/404";
import {
  Benefeciaries,
  Disperse,
  Overview,
  Layout,
  Livestock,
  Profile,
} from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />}></Route>
          <Route path="benefeciaries" element={<Benefeciaries />}></Route>
          <Route path="disperse" element={<Disperse />}></Route>
          <Route path="livestocks" element={<Livestock />}></Route>
          <Route path="Profile" element={<Profile />}></Route>
        </Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
