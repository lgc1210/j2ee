import React from "react";
import { showToast } from "../../Components/Toast";
import StoreService from "../../Services/store";

const StoreContext = React.createContext();

const Store = ({ children }) => {
	const [storeList, setStoreList] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const fetchStoreList = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await StoreService.getAll();
			if (response.status === 200) {
				setStoreList(response?.data);
			}
		} catch (error) {
			showToast("There's something wrong while fetching stores", "error");
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		fetchStoreList();
	}, [fetchStoreList]);

	return (
		<StoreContext.Provider
			value={{
				storeList,
				loading,
			}}>
			{children}
		</StoreContext.Provider>
	);
};

export const useStore = () => React.useContext(StoreContext);

export default Store;
