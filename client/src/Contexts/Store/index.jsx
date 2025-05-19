import React from "react";
import { showToast } from "../../Components/Toast";
import StoreService from "../../Services/store";
import { useAuth } from "../Auth";

const StoreContext = React.createContext();

const Store = ({ children }) => {
	const [storeList, setStoreList] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [currentStore, setCurrentStore] = React.useState(null);
	const { user } = useAuth();

	const fetchCurrentStore = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await StoreService.getStoreBylogin();
			console.log(response);
			if (response.status === 200) {
				setCurrentStore(response?.data);
			}
			return response;
		} catch (error) {
			showToast(
				"There's something wrong while fetching current store",
				"error"
			);
			console.log("Error fetching current store:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchStoreList = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await StoreService.getAll();
			if (response.status === 200) {
				setStoreList(response?.data);
			}
		} catch (error) {
			console.log("Error while fetching stores:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		const fetchData = async () => {
			if (user && user.role.name === "owner") {
				await fetchCurrentStore();
			}
			await fetchStoreList();
		};
		fetchData();
	}, [user, fetchStoreList]);

	return (
		<StoreContext.Provider
			value={{
				storeList,
				loading,
				fetchCurrentStore,
				currentStore,
				setCurrentStore,
			}}>
			{children}
		</StoreContext.Provider>
	);
};

export const useStore = () => React.useContext(StoreContext);

export default Store;
