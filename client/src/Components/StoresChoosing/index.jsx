import React from "react";
import StoreChoosing from "../StoreChoosing";

const StoresChoosing = ({ onClick, storeList }) => {
	return (
		<div className='grid lg:grid-cols-3 md:grid-cols-2 gap-8 w-full'>
			{storeList?.length > 0 ? (
				storeList.map((store) => (
					<StoreChoosing key={store?.id} store={store} onClick={onClick} />
				))
			) : (
				<div className='col-span-full text-center text-gray-500 py-12'>
					No stores available
				</div>
			)}
		</div>
	);
};

export default React.memo(StoresChoosing);
