// app/_src/types/Order.ts
export default interface Order {
  _id: string;
  items: Array<{
    title: string;
    price: number;
    image: string;
    quantity: number;
    selectedSize: string;
  }>;
  phoneNumber: string;
  locationData?: {
    address: string;
    pincode: string;
    latitude: string;
    longitude: string;
  };
  customerEmail: string;
  userId: string;
  status: string;
  createdAt: string;
  total: number;
}
