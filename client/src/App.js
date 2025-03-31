import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import Auth from "./Contexts/Auth";
import BackToTop from "./Components/BackToTop";
import Toast from "./Components/Toast";
import { Provider } from "react-redux";
import store from "./Redux/Store";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Auth>
          <AppRoutes />
          <BackToTop />
          <Toast />
        </Auth>
      </Router>
    </Provider>
  );
}
