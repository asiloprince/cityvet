import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFoundPage from "./pages/404";
import {
  Beneficiaries,
  LayoutDispersal,
  Overview,
  Layout,
  Livestock,
  Profile,
  TeamRole,
  DispersalType,
  SingleDispersions,
} from "./pages/dashboard";
import Auth from "./pages/auth/Auth";
import {
  LoggedInPageProtection,
  NonLoggedInPage,
  RoleBasedRouteProtection,
} from "./components/route-protections/RouteProtection";

function App() {
  return (
    <BrowserRouter>
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
          <Route path="benefeciaries" element={<Beneficiaries />}></Route>
          <Route path="livestocks" element={<Livestock />}></Route>
          <Route path="Profile" element={<Profile />}></Route>
          <Route path="Roles" element={<TeamRole />}></Route>
          <Route path="dispersal" element={<LayoutDispersal />}></Route>

          <Route path="dispersal-type" element={<DispersalType />}></Route>
          <Route path="disperse" element={<SingleDispersions />}></Route>
        </Route>

        <Route
          path="/login"
          element={
            <NonLoggedInPage>
              <Login />
            </NonLoggedInPage>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <NonLoggedInPage>
              <Register />
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
