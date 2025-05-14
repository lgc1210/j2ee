import React from "react";
import StoreChoosing from "../StoreChoosing";

const StoresChoosing = ({ onClick, storeList }) => {
	return (
		<ul className='grid lg:grid-cols-3 gap-6 grid-flow-row'>
			{storeList?.length >= 0
				? storeList.map((store) => (
						<StoreChoosing key={store?.id} store={store} onClick={onClick} />
				  ))
				: ""}
		</ul>
	);
};

export default React.memo(StoresChoosing);
