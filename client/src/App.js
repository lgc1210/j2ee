import { BrowserRouter as Router } from "react-router-dom";

import AppRoutes from "./Routes/AppRoutes";
import BackToTop from "./Components/BackToTop";
import Toast from "./Components/Toast";
import AuthProvider from "./Contexts/Auth";
import ProfileProvider from "./Contexts/Profile";
import ProductProvider from "./Contexts/Product";
import CartProvider from "./Contexts/Cart";
import AppointmentProvider from "./Contexts/Appointment";
import StoreProvider from "./Contexts/Store";
import OrderProvider from "./Contexts/Order";
import PaymentProvider from "./Contexts/Payment";

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<ProfileProvider>
					<StoreProvider>
						<CartProvider>
							<OrderProvider>
								<ProductProvider>
									<AppointmentProvider>
										<PaymentProvider>
											<AppRoutes />
											<BackToTop />
											<Toast />
										</PaymentProvider>
									</AppointmentProvider>
								</ProductProvider>
							</OrderProvider>
						</CartProvider>
					</StoreProvider>
				</ProfileProvider>
			</AuthProvider>
		</Router>
	);
}
