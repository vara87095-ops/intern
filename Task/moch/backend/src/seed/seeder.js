import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { users, products } from './productsData.js';
import { connectDB, disconnectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedDatabase = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create users individually to trigger bcrypt pre-save password hash
    const createdUsers = [];
    for (const u of users) {
      const newUser = await User.create(u);
      createdUsers.push(newUser);
    }

    const adminUser = createdUsers[0];
    const customerUser = createdUsers[1];

    // Insert products
    const createdProducts = await Product.insertMany(products);

    // Create 2 realistic demo orders for customerUser to showcase order tracking & admin status
    const sampleOrder1 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          quantity: 1,
          price: createdProducts[0].price,
          image: createdProducts[0].imageUrl,
        },
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          quantity: 1,
          price: createdProducts[2].price,
          image: createdProducts[2].imageUrl,
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        address: customerUser.address.street,
        city: customerUser.address.city,
        postalCode: customerUser.address.postalCode,
        country: customerUser.address.country,
        phone: customerUser.address.phone,
      },
      paymentMethod: 'Credit Card',
      paymentResult: {
        id: 'PAY-DEMO-1001',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: customerUser.email,
      },
      itemsPrice: 497.99,
      taxPrice: 39.84,
      shippingPrice: 0.00,
      totalPrice: 537.83,
      isPaid: true,
      paidAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      isDelivered: false,
      status: 'Processing',
    });

    const sampleOrder2 = new Order({
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          quantity: 1,
          price: createdProducts[4].price,
          image: createdProducts[4].imageUrl,
        },
      ],
      shippingAddress: {
        fullName: customerUser.name,
        address: customerUser.address.street,
        city: customerUser.address.city,
        postalCode: customerUser.address.postalCode,
        country: customerUser.address.country,
        phone: customerUser.address.phone,
      },
      paymentMethod: 'Credit Card',
      paymentResult: {
        id: 'PAY-DEMO-1002',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: customerUser.email,
      },
      itemsPrice: 429.00,
      taxPrice: 34.32,
      shippingPrice: 0.00,
      totalPrice: 463.32,
      isPaid: true,
      paidAt: new Date(Date.now() - 86400000 * 5),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 86400000 * 1),
      status: 'Delivered',
    });

    await sampleOrder1.save();
    await sampleOrder2.save();

    console.log(`[Seeder] Successfully seeded:`);
    console.log(`  - ${createdUsers.length} Users (Admin: ${adminUser.email}, Customer: ${customerUser.email})`);
    console.log(`  - ${createdProducts.length} Products`);
    console.log(`  - 2 Demo Orders`);
  } catch (error) {
    console.error(`[Seeder] Error during seeding: ${error.message}`);
    throw error;
  }
};

export const autoSeedIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Database] Database is empty. Auto-seeding initial data...');
      await seedDatabase();
    }
  } catch (error) {
    console.error('[Database] Auto-seed check failed:', error.message);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('[Seeder] All database records deleted!');
  } catch (error) {
    console.error(`[Seeder] Error clearing data: ${error.message}`);
    throw error;
  }
};

// Check if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  (async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
      await destroyData();
    } else {
      await seedDatabase();
    }
    await disconnectDB();
    process.exit();
  })();
}
