import React, { useState, useEffect, useCallback } from "react";
import AddressItem from "../AddressItem";
import Pagination from "../../../Components/Pagination";
import AddressService from "../../../Services/address";
import { useAuth } from "../../../Contexts/Auth";
import { showToast } from "../../../Components/Toast";

const AddressList = ({
	handleClickedUpdate,
	handleSetDefault,
	setShowConfirmPopup,
	fetchAddressList: parentFetchCallback,
}) => {
	const [addressList, setAddressList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1); // UI shows 1-indexed for users
	const [totalPages, setTotalPages] = useState(1);
	const { user } = useAuth();

	const PAGE_SIZE = 4; // Match backend default

	const fetchAddressList = useCallback(async () => {
		try {
			// Convert from 1-indexed (UI) to 0-indexed (API)
			const apiPageIndex = currentPage - 1;

			const response = await AddressService.getAllByUserId(
				user?.id,
				apiPageIndex,
				PAGE_SIZE
			);

			if (response.status === 200) {
				setAddressList(response?.data?.addresses || []);
				setTotalPages(response?.data?.totalPages || 1);

				// Call parent callback if provided
				if (typeof parentFetchCallback === "function") {
					parentFetchCallback();
				}
			}
		} catch (error) {
			console.error("Error fetching addresses:", error);
			showToast("Error occurs while fetching addresses", "error");
		}
	}, [user?.id, currentPage, parentFetchCallback]);

	useEffect(() => {
		if (user?.id) {
			fetchAddressList();
		}
		if (typeof parentFetchCallback === "function") {
			parentFetchCallback(fetchAddressList); // Expose this function to parent
		}
	}, [fetchAddressList, user?.id, parentFetchCallback]);

	const handlePageChange = (page) => {
		// Keep UI as 1-indexed for better user experience
		// The conversion to 0-indexed happens in fetchAddressList
		setCurrentPage(page);
	};

	return (
		<div>
			<ul className='space-y-1'>
				{addressList?.length > 0 ? (
					addressList.map((item) => (
						<AddressItem
							key={item?.id}
							item={item}
							handleClickedUpdate={handleClickedUpdate}
							handleSetDefault={handleSetDefault}
							setShowConfirmPopup={setShowConfirmPopup}
						/>
					))
				) : (
					<li className='py-4 text-center text-gray-500'>No addresses found</li>
				)}
			</ul>

			{totalPages > 1 && (
				<div className='w-full flex items-center justify-end mt-10'>
					<Pagination
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};

export default React.memo(AddressList);
