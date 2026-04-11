require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexus';

async function checkDB() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('\n✅  Connected to database:', mongoose.connection.name);
    console.log('━'.repeat(50));

    const users = await User.find({}, { password: 0 }); // exclude passwords
    console.log(`\n👥  USERS (${users.length} found):`);
    if (users.length === 0) {
      console.log('   ⚠️  No users found in the database!');
    } else {
      users.forEach((u, i) => {
        console.log(`   [${i+1}] ${u.name} | ${u.email} | ID: ${u._id}`);
      });
    }

    const orders = await Order.find({});
    console.log(`\n📦  ORDERS (${orders.length} found):`);
    if (orders.length === 0) {
      console.log('   ⚠️  No orders found.');
    } else {
      orders.forEach((o, i) => {
        console.log(`   [${i+1}] User: ${o.userId} | Total: ₹${o.total} | Discount: ₹${o.discount}`);
      });
    }

    const carts = await Cart.find({});
    console.log(`\n🛒  CARTS (${carts.length} found):`);
    carts.forEach((c, i) => {
      console.log(`   [${i+1}] User: ${c.userId} | Items: ${c.items.length}`);
    });

    console.log('\n' + '━'.repeat(50));
    console.log('✅  Database check complete!');
  } catch (err) {
    console.error('❌  DB Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkDB();
