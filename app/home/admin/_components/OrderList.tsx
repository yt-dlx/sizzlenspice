// app/home/admin/_components/OrderList.tsx
import type Order from "@/app/_src/types/Order";
import { FaRupeeSign, FaEye, FaEyeSlash } from "react-icons/fa";

const OrderList: React.FC<{
  orders: Order[];
  selectedOrderId: string | undefined;
  onSelectOrder: (order: Order) => void;
  visualizedOrders: { [key: string]: boolean };
  toggleVisualize: (orderId: string) => void;
}> = ({ orders, selectedOrderId, onSelectOrder, visualizedOrders, toggleVisualize }) => {
  return (
    <div className="bg-[#E9F0CD]/10 rounded-lg shadow-md p-4 text-[#E9F0CD]">
      <h2 className="text-4xl font-bold mb-4 font-Playfair">Orders</h2>
      <input type="text" placeholder="Search orders..." className="w-full p-2 mb-4 rounded-md bg-[#1C2924] text-[#E9F0CD] font-Kurale" />
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className={`p-4 rounded-lg cursor-pointer ${selectedOrderId === order._id ? "bg-[#1C2924]" : "bg-[#E9F0CD]/10"}`}>
            <div className="flex justify-between items-center">
              <div className="font-bold font-Kurale" onClick={() => onSelectOrder(order)}>
                <ul className="list-disc ml-4">
                  <li>
                    Customer: <span className="font-RobotoCondensed">{order.customerName}</span>
                  </li>
                  <li>
                    Status: <span className="font-RobotoCondensed">#{order.status}</span>
                  </li>
                  <li>
                    OrderID: <span className="font-RobotoCondensed">#{order._id}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-col items-end">
                <span className="font-bold font-Playfair flex items-center">
                  <FaRupeeSign className="mr-1" /> {order.total.toFixed(2)}
                </span>
              </div>
              <div>
                <button onClick={() => toggleVisualize(order._id)} className="bg-[#E9F0CD] text-[#172B25] px-3 py-1 rounded-full flex items-center font-bold text-xs font-Kurale">
                  {visualizedOrders[order._id] ? (
                    <>
                      <FaEyeSlash className="mr-2" /> Hide
                    </>
                  ) : (
                    <>
                      <FaEye className="mr-2" /> Show
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderList;
