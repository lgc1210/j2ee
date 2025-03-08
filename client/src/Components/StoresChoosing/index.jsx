import React from "react";
import StoreChoosing from "../StoreChoosing";
import Store1 from "../../assets/images/services/delfina-pan-scaled-900x1350.jpeg";
import Store2 from "../../assets/images/services/giorgio-trovato-2-900x600.jpeg";
import Store3 from "../../assets/images/services/service-color-leaf.png";
import Store4 from "../../assets/images/services/towfiqu-barbhuiya-900x600.jpeg";
import Store5 from "../../assets/images/services/spa-massage-skills-2.jpg";
import Store6 from "../../assets/images/services/giorgio-trovato-900x600.jpeg";

// Sample data
const stores = [
  { id: 1, name: "Store 1", serviceCount: 20, imageUrl: Store1 },
  { id: 2, name: "Store 2", serviceCount: 19, imageUrl: Store2 },
  { id: 3, name: "Store 3", serviceCount: 23, imageUrl: Store3 },
  { id: 4, name: "Store 4", serviceCount: 30, imageUrl: Store4 },
  { id: 5, name: "Store 5", serviceCount: 12, imageUrl: Store5 },
  { id: 6, name: "Store 6", serviceCount: 42, imageUrl: Store6 },
];

const StoresChoosing = ({ onClick }) => {
  return (
    <ul className='grid lg:grid-cols-3 gap-6 grid-flow-row'>
      {stores.map((store) => {
        return (
          <StoreChoosing key={store?.id} store={store} onClick={onClick} />
        );
      })}
    </ul>
  );
};

export default React.memo(StoresChoosing);
