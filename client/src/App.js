import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import Auth from "./Contexts/Auth";

export default function App() {
  return (
    <Auth>
      <Router>
        <AppRoutes />
      </Router>
    </Auth>
  );
}
