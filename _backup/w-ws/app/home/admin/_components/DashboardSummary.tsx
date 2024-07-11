// app/home/admin/_components/DashboardSummary.tsx
import { FaRupeeSign } from "react-icons/fa";
import type Order from "@/app/_src/types/Order";

const DashboardSummary: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-[#E9F0CD]/10 p-4 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-[#E9F0CD]">
        <h3 className="text-xl font-bold font-Kurale">Total Orders</h3>
        <p className="text-4xl font-semibold font-Playfair">{totalOrders}</p>
      </div>
      <div className="bg-[#E9F0CD]/10 p-4 rounded-lg shadow shadow-[#131313] border-2 border-[#131313] text-[#E9F0CD]">
        <h3 className="text-xl font-bold font-Kurale">Total Revenue</h3>
        <p className="text-4xl font-semibold font-Playfair flex items-center">
          <FaRupeeSign size={20} className="mr-1" /> {totalRevenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DashboardSummary;
