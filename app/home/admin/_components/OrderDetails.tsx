// app/home/admin/_components/OrderDetails.tsx
import type Order from "@/app/_src/types/Order";
import { FaRupeeSign, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDashboard, MdShoppingCart, MdLocalShipping, MdDoneAll } from "react-icons/md";

const OrderDetails: React.FC<{
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: string, userId: string) => void;
  isVisualized: boolean;
  toggleVisualize: () => void;
}> = ({ order, onUpdateStatus, isVisualized, toggleVisualize }) => {
  const statusOptions = ["Accepted", "Preparing", "Delivering", "Completed"];
  const statusIcons = {
    Accepted: <MdDashboard />,
    Preparing: <MdShoppingCart />,
    Delivering: <MdLocalShipping />,
    Completed: <MdDoneAll />,
  };
  return (
    <div className="bg-[#E9F0CD]/10 rounded-lg shadow-md p-4 text-[#E9F0CD]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold font-Playfair">Order Details</h2>
        <button onClick={toggleVisualize} className="bg-[#E9F0CD] text-[#172B25] px-3 py-1 rounded-full flex items-center font-bold text-xs font-Kurale">
          {isVisualized ? (
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
      <div className="mb-4 font-Kurale">
        <h3 className="font-bold">Task info</h3>
        <div>Address: {order.locationData?.address}</div>
        <div>Phone: {order.phoneNumber}</div>
      </div>
      {isVisualized && (
        <div className="space-y-4 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center bg-[#E9F0CD]/10 p-4 rounded-lg">
              <img alt={item.title} src={item.image} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div className="flex-1">
                <div className="flex justify-between font-Kurale">
                  <span>{item.title}</span>
                  <span>x{item.quantity}</span>
                </div>
              </div>
              <div className="font-bold font-Playfair flex items-center">
                <FaRupeeSign className="mr-1" />
                {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-right text-xl font-bold mt-4 font-Playfair flex items-center justify-end">
        Total: <FaRupeeSign className="mx-1" /> {order.total.toFixed(2)}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onUpdateStatus(order._id, status, order.userId)}
              className={`px-4 py-2 mb-2 transition duration-700 ease-in-out transform rounded-full ${
                order.status === status ? "bg-[#A8B67C] text-[#172B25]" : "bg-[#E9F0CD] hover:bg-[#A8B67C] text-[#172B25]"
              } font-Kurale font-bold flex items-center`}
            >
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="ml-2">{status}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="font-bold font-Kurale m-2 text-2xl underline">
        Current Status: <span className="font-RobotoCondensed text-lg">{order.status}</span>
      </p>
    </div>
  );
};

export default OrderDetails;
