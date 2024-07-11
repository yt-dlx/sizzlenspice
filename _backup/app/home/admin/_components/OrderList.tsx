// app/home/admin/_components/OrderList.tsx
import type Order from "@/app/_src/types/Order";

const OrderList: React.FC<{
  orders: Order[];
  selectedOrderId: string | undefined;
  onSelectOrder: (order: Order) => void;
}> = ({ orders, selectedOrderId, onSelectOrder }) => {
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
                    Customer: <span className="text-semibold italic font-Playfair">{order.customerName}</span>
                  </li>
                  <li>
                    Status: <span className="text-semibold italic font-Playfair animate-pulse">#{order.status}</span>
                  </li>
                  <li>
                    OrderID: <span className="text-semibold italic font-Playfair">#{order._id}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderList;
