import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
// import ServicesPage from "./pages/AllServices";
import CategoryServicesPage from "./pages/client-pages/CategoryServices";
import BookingAppointments from "./pages/client-pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";
import HomeAdmin from "./pages/admin-pages/Home-admin";
import ServiceAdmin from "./pages/admin-pages/Serviceadmin";

function App() {
  return (
  <ServiceAdmin />
  );
}

export default App;
