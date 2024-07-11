export default interface Order {
  _id: string;
  userId: string;
  createdAt: string;
  total: number;
  status: string;
  phoneNumber: string;
  customerName: string;
  items: Array<{
    title: string;
    price: number;
    image: string;
    quantity: number;
    selectedSize: string;
  }>;
  locationData?: {
    address: string;
    pincode: string;
  };
}
