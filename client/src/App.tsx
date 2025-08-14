import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
// import ServicesPage from "./pages/AllServices";
import CategoryServicesPage from "./pages/client-pages/CategoryServices";
import BookingAppointments from "./pages/client-pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";
import HomeAdmin from "./pages/admin-pages/Home-admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:category" element={<CategoryServicesPage />} />
      {/*<Route path="/all-services" element={<AllServicesPage />} /> */}
	  <Route path="/booking/:serviceId" element={<BookingAppointments />} />
	  <Route path="/my-appointments" element={<MyAppointments />} />
    <Route path="/admin" element={<HomeAdmin />} />
	  {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
