import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import Auth from "./Contexts/Auth";
import BackToTop from "./Components/BackToTop";

export default function App() {
  return (
    <Auth>
      <Router>
        <AppRoutes />
        <BackToTop />
      </Router>
    </Auth>
  );
}
