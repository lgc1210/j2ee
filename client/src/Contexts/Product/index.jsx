import React, {
	createContext,
	useContext,
	useCallback,
	useState,
	useEffect,
} from "react";
import ProductService from "../../Services/product";

const ProductContext = createContext();

const Product = ({ children }) => {
	const [productList, setProductList] = useState([]);
	const [loadingProductList, setLoadingProductList] = useState(false);
	const [productDetails, setProductDetails] = useState(null);
	const [loadingProductDetails, setLoadingProductDetails] = useState(false);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [nameFilter, setNameFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [selectedStoreId, setSelectedStoreId] = useState(null);

	const fetchProductList = useCallback(
		async (storeId, page, name, category) => {
			try {
				setLoadingProductList(true);

				const response = await ProductService.getAllProductByStoreId(
					storeId,
					page,
					name,
					category
				);
				const newProducts = response?.data;
				if (response.status === 200) {
					setProductList((prev) => [...prev, ...newProducts.products] || []);
					const totalPages = response.data.totalPages || 0;
					const currentPage = response.data.currentPage || 0;
					setHasMore(currentPage < totalPages - 1);
				} else {
					setHasMore(false);
				}
			} catch (error) {
				console.log("Error occurs", error);
				setHasMore(false);
			} finally {
				setLoadingProductList(false);
			}
		},
		[]
	);

	useEffect(() => {
		if (selectedStoreId) {
			setProductList([]);
			setPage(0);
			setHasMore(true);
			fetchProductList(selectedStoreId, 0, nameFilter, categoryFilter);
		}
	}, [selectedStoreId, nameFilter, categoryFilter, fetchProductList]);

	useEffect(() => {
		if (selectedStoreId && page > 0) {
			fetchProductList(selectedStoreId, page, nameFilter, categoryFilter);
		}
	}, [categoryFilter, fetchProductList, nameFilter, page, selectedStoreId]);

	const fetchProductDetails = useCallback(async (productId) => {
		try {
			setLoadingProductDetails(true);

			const response = await ProductService.getProductDetails(productId);
			console.log("Product details: ", response);
			if (response.status === 200) {
				setProductDetails(response.data || []);
			}
		} catch (error) {
			console.log("Error occurs", error);
		} finally {
			setLoadingProductDetails(false);
		}
	}, []);

	return (
		<ProductContext.Provider
			value={{
				fetchProductList,
				productList,
				loadingProductList,
				fetchProductDetails,
				productDetails,
				loadingProductDetails,
				setSelectedStoreId,
				selectedStoreId,
				setNameFilter,
				nameFilter,
				setCategoryFilter,
				categoryFilter,
				setPage,
				page,
				hasMore,
			}}>
			{children}
		</ProductContext.Provider>
	);
};

export const useProduct = () => useContext(ProductContext);

export default Product;
