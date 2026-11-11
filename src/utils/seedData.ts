import { collection, doc, writeBatch, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category } from '../types';

const CATEGORIES: Partial<Category>[] = [
  { id: 'all', name: 'All' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'meat', name: 'Meat' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks' },
];

const PRODUCTS: Partial<Product>[] = [
  {
    name: 'Banana',
    categoryId: 'fruits',
    price: 1.20,
    unit: 'kg',
    description: 'Fresh and ripe yellow bananas, perfect for a quick snack or smoothies.',
    image: '/src/assets/images/product_banana_1794389103031.jpg',
    rating: 4.8,
    reviewsCount: 120,
    isPopular: true,
    isDailyEssential: true,
    stock: 100
  },
  {
    name: 'Avocado',
    categoryId: 'fruits',
    price: 2.50,
    unit: 'pc',
    description: 'Creamy and rich Hass avocados, full of healthy fats and nutrients.',
    image: '/src/assets/images/product_avocado_1794389102685.jpg',
    rating: 4.9,
    reviewsCount: 85,
    isPopular: true,
    isDailyEssential: true,
    stock: 50
  },
  {
    name: 'Blueberry',
    categoryId: 'fruits',
    price: 3.20,
    unit: '125g',
    description: 'Sweet and antioxidant-rich organic blueberries.',
    image: '/src/assets/images/product_blueberry_1794389103061.jpg',
    rating: 4.7,
    reviewsCount: 95,
    isPopular: true,
    isDailyEssential: true,
    stock: 40
  },
  {
    name: 'Cherry',
    categoryId: 'fruits',
    price: 2.80,
    unit: '250g',
    description: 'Vibrant and juicy red cherries, hand-picked for quality.',
    image: '/src/assets/images/product_cherry_1794389103705.jpg',
    rating: 4.6,
    reviewsCount: 60,
    isPopular: true,
    isDailyEssential: true,
    stock: 30
  },
  {
    name: 'Broccoli',
    categoryId: 'vegetables',
    price: 2.10,
    unit: 'kg',
    description: 'Fresh green broccoli heads, rich in vitamins and minerals.',
    image: '/src/assets/images/product_broccoli_1794389103903.jpg',
    rating: 4.5,
    reviewsCount: 110,
    isPopular: true,
    isDailyEssential: true,
    stock: 80
  },
  {
    name: 'Carrot',
    categoryId: 'vegetables',
    price: 1.40,
    unit: 'kg',
    description: 'Crunchy and sweet organic carrots with green tops.',
    image: '/src/assets/images/product_carrot_1794389103565.jpg',
    rating: 4.4,
    reviewsCount: 130,
    isPopular: true,
    isDailyEssential: true,
    stock: 150
  },
  {
    name: 'Spinach',
    categoryId: 'vegetables',
    price: 1.60,
    unit: 'bunch',
    description: 'Fresh and tender organic spinach leaves.',
    image: '/src/assets/images/product_spinach_1794389119249.jpg',
    rating: 4.8,
    reviewsCount: 75,
    isPopular: false,
    isDailyEssential: true,
    stock: 60
  },
  {
    name: 'Capsicum',
    categoryId: 'vegetables',
    price: 2.20,
    unit: 'kg',
    description: 'Assorted colorful bell peppers, perfect for salads and cooking.',
    image: '/src/assets/images/product_capsicum_1794389103231.jpg',
    rating: 4.3,
    reviewsCount: 90,
    isPopular: false,
    isDailyEssential: true,
    stock: 70
  },
  {
    name: 'Tomato',
    categoryId: 'vegetables',
    price: 1.80,
    unit: 'kg',
    description: 'Juicy and ripe vine tomatoes, great for cooking or raw use.',
    image: '/src/assets/images/product_tomato_1794389103779.jpg',
    rating: 4.5,
    reviewsCount: 150,
    isPopular: true,
    isDailyEssential: true,
    stock: 200
  },
  {
    name: 'Cucumber',
    categoryId: 'vegetables',
    price: 1.30,
    unit: 'kg',
    description: 'Crisp and hydrating organic cucumbers.',
    image: '/src/assets/images/product_cucumber_1794389116796.jpg',
    rating: 4.2,
    reviewsCount: 80,
    isPopular: false,
    isDailyEssential: true,
    stock: 100
  },
  {
    name: 'Potato',
    categoryId: 'vegetables',
    price: 1.20,
    unit: 'kg',
    description: 'Versatile and earthy organic potatoes.',
    image: '/src/assets/images/product_potato_1794389117428.jpg',
    rating: 4.6,
    reviewsCount: 200,
    isPopular: true,
    isDailyEssential: true,
    stock: 300
  },
  {
    name: 'Onion',
    categoryId: 'vegetables',
    price: 1.10,
    unit: 'kg',
    description: 'Essential red onions for flavor and aroma.',
    image: '/src/assets/images/product_onion_1794389116882.jpg',
    rating: 4.4,
    reviewsCount: 180,
    isPopular: true,
    isDailyEssential: true,
    stock: 250
  },
  {
    name: 'Garlic',
    categoryId: 'vegetables',
    price: 1.80,
    unit: '100g',
    description: 'Strong and aromatic fresh garlic bulbs.',
    image: '/src/assets/images/product_garlic_1794389117487.jpg',
    rating: 4.7,
    reviewsCount: 95,
    isPopular: false,
    isDailyEssential: true,
    stock: 80
  },
  {
    name: 'Ginger',
    categoryId: 'vegetables',
    price: 2.00,
    unit: '100g',
    description: 'Spicy and aromatic fresh organic ginger root.',
    image: '/src/assets/images/product_ginger_1794389117480.jpg',
    rating: 4.6,
    reviewsCount: 70,
    isPopular: false,
    isDailyEssential: true,
    stock: 50
  },
  {
    name: 'Green Chili',
    categoryId: 'vegetables',
    price: 1.00,
    unit: '100g',
    description: 'Spicy and fresh green chilies.',
    image: '/src/assets/images/product_green_chili_1794389117691.jpg',
    rating: 4.5,
    reviewsCount: 65,
    isPopular: false,
    isDailyEssential: true,
    stock: 40
  },
  {
    name: 'Sweet Corn',
    categoryId: 'vegetables',
    price: 1.50,
    unit: 'pc',
    description: 'Sweet and vibrant fresh corn cobs.',
    image: '/src/assets/images/product_sweet_corn_1794389117777.jpg',
    rating: 4.8,
    reviewsCount: 85,
    isPopular: false,
    isDailyEssential: true,
    stock: 90
  },
];

export const seedData = async () => {
  const productsQuery = query(collection(db, 'products'), limit(1));
  const snapshot = await getDocs(productsQuery);
  
  if (!snapshot.empty) {
    console.log('Database already seeded.');
    return;
  }

  const batch = writeBatch(db);

  CATEGORIES.forEach((cat) => {
    const docRef = doc(collection(db, 'categories'), cat.id);
    batch.set(docRef, cat);
  });

  PRODUCTS.forEach((prod) => {
    const docRef = doc(collection(db, 'products'));
    batch.set(docRef, prod);
  });

  await batch.commit();
  console.log('Database seeded successfully!');
};
