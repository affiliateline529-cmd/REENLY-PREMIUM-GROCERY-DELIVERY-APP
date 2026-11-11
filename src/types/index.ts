export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  photoURL?: string;
  savedAddresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string; // Home, Office, etc.
  street: string;
  city: string;
  area: string;
  instructions?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  unit: string; // kg, gram, piece, etc.
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isDailyEssential?: boolean;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: 'cod' | 'bank_transfer' | 'online';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
