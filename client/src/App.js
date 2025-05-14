import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./Routes/AppRoutes";
import BackToTop from "./Components/BackToTop";
import Toast from "./Components/Toast";
import AuthProvider from "./Contexts/Auth";
import ProfileProvider from "./Contexts/Profile";
import ProductProvider from "./Contexts/Product";
import CartProvider from "./Contexts/Cart";

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<ProfileProvider>
					<CartProvider>
						<ProductProvider>
							<AppRoutes />
							<BackToTop />
							<Toast />
						</ProductProvider>
					</CartProvider>
				</ProfileProvider>
			</AuthProvider>
		</Router>
	);
}
