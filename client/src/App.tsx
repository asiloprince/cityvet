import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import NotFoundPage from "./pages/404";
import {
  Beneficiaries,
  LayoutDispersal,
  Overview,
  Layout,
  Livestock,
  Settings,
  TeamRole,
  Calendar,
  SingleDispersions,
  BatchDispersals,
  Statistics,
  DispersalPredictions,
  Register,
} from "./pages/dashboard";
import Auth from "./pages/auth/Auth";
import {
  LoggedInPageProtection,
  NonLoggedInPage,
  RoleBasedRouteProtection,
} from "./components/route-protections/RouteProtection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <LoggedInPageProtection>
              <RoleBasedRouteProtection>
                <Layout />
              </RoleBasedRouteProtection>
            </LoggedInPageProtection>
          }
        >
          <Route index element={<Overview />}></Route>
          <Route path="beneficiaries" element={<Beneficiaries />}></Route>
          <Route path="livestocks" element={<Livestock />}></Route>
          <Route path="settings" element={<Settings />}></Route>
          <Route path="roles" element={<TeamRole />}></Route>
          <Route path="dispersal" element={<LayoutDispersal />}></Route>
          <Route path="statistics" element={<Statistics />}></Route>
          <Route path="predictions" element={<DispersalPredictions />}></Route>
          <Route path="calendar" element={<Calendar />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="disperse" element={<SingleDispersions />}></Route>
          <Route path="batch-disperse" element={<BatchDispersals />}></Route>
        </Route>

        <Route
          path="/login"
          element={
            <NonLoggedInPage>
              <Login />
            </NonLoggedInPage>
          }
        ></Route>

        <Route path="/auth" element={<Auth />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
