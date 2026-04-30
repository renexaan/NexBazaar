require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  // 1. Fruits & Vegetables
  { name: 'Fresh Banana', description: 'Single yellow banana.', price: 40, category: 'Fruits & Vegetables', stock: 100, unit: 'kg', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=400&fm=jpg' },
  { name: 'Red Apple', description: 'Single crisp red apple.', price: 180, category: 'Fruits & Vegetables', stock: 80, unit: 'kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?q=80&w=400&fm=jpg' },
  { name: 'Potato', description: 'Clean brown potato.', price: 30, category: 'Fruits & Vegetables', stock: 200, unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?q=80&w=400&fm=jpg' },
  { name: 'Onion', description: 'Simple red onion.', price: 50, category: 'Fruits & Vegetables', stock: 150, unit: 'kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=400&fm=jpg' },
  { name: 'Tomato', description: 'Single ripe tomato.', price: 40, category: 'Fruits & Vegetables', stock: 120, unit: 'kg', image: 'https://images.unsplash.com/photo-1596199050105-6d5d32222916?q=80&w=400&fm=jpg' },

  // 2. Dairy & Bakery
  { name: 'Milk Bottle', description: 'Bottle of fresh milk.', price: 66, category: 'Dairy & Bakery', stock: 50, unit: 'bottle', image: 'https://images.unsplash.com/photo-1563636619-e91002933965?q=80&w=400&fm=jpg' },
  { name: 'Salted Butter', description: 'Simple block of butter.', price: 250, category: 'Dairy & Bakery', stock: 40, unit: 'pack', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=400&fm=jpg' },
  { name: 'Paneer', description: 'Clean block of fresh paneer.', price: 90, category: 'Dairy & Bakery', stock: 60, unit: 'pack', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=400&fm=jpg' },
  { name: 'Fresh Loaf', description: 'Minimalist bread loaf.', price: 45, category: 'Dairy & Bakery', stock: 30, unit: 'pack', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&fm=jpg' },
  { name: 'Greek Yogurt', description: 'Simple cup of yogurt.', price: 55, category: 'Dairy & Bakery', stock: 45, unit: 'cup', image: 'https://images.unsplash.com/photo-1485962391905-dc37bc33e547?q=80&w=400&fm=jpg' },

  // 3. Staples & Pulses
  { name: 'Basmati Rice', description: 'Bowl of white rice.', price: 650, category: 'Staples & Pulses', stock: 30, unit: 'bag', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&fm=jpg' },
  { name: 'Yellow Dal', description: 'Clean yellow pulses.', price: 160, category: 'Staples & Pulses', stock: 50, unit: 'kg', image: 'https://images.unsplash.com/photo-1585996853877-ad9aa5d6514f?q=80&w=400&fm=jpg' },
  { name: 'White Sugar', description: 'Clean crystal sugar.', price: 48, category: 'Staples & Pulses', stock: 100, unit: 'kg', image: 'https://images.unsplash.com/photo-1622484210965-0370f6d54d19?q=80&w=400&fm=jpg' },
  { name: 'Wheat Flour', description: 'Simple bowl of flour.', price: 450, category: 'Staples & Pulses', stock: 40, unit: 'bag', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&fm=jpg' },
  { name: 'Chickpeas', description: 'Dry white chickpeas.', price: 140, category: 'Staples & Pulses', stock: 50, unit: 'kg', image: 'https://images.unsplash.com/photo-1515942400420-2b98fed1f515?q=80&w=400&fm=jpg' },

  // 4. Snacks
  { name: 'Potato Chips', description: 'Bowl of simple chips.', price: 50, category: 'Snacks & Branded Foods', stock: 100, unit: 'pack', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=400&fm=jpg' },
  { name: 'Dark Chocolate', description: 'Minimalist chocolate bar.', price: 120, category: 'Snacks & Branded Foods', stock: 60, unit: 'bar', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&fm=jpg' },
  { name: 'Noodles', description: 'Simple bowl of noodles.', price: 96, category: 'Snacks & Branded Foods', stock: 80, unit: 'pack', image: 'https://images.unsplash.com/photo-1612927335773-a7f1a604ac12?q=80&w=400&fm=jpg' },
  { name: 'Salted Nuts', description: 'Bowl of roasted nuts.', price: 350, category: 'Snacks & Branded Foods', stock: 30, unit: 'pack', image: 'https://images.unsplash.com/photo-1536591040330-80255d642921?q=80&w=400&fm=jpg' },
  { name: 'Cookies', description: 'Simple stack of cookies.', price: 80, category: 'Snacks & Branded Foods', stock: 50, unit: 'pack', image: 'https://images.unsplash.com/photo-1499636136210-654ebee084af?q=80&w=400&fm=jpg' },

  // 5. Beverages
  { name: 'Orange Juice', description: 'Bottle of orange juice.', price: 110, category: 'Beverages', stock: 60, unit: 'bottle', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=400&fm=jpg' },
  { name: 'Coffee Beans', description: 'Minimalist coffee jar.', price: 450, category: 'Beverages', stock: 40, unit: 'jar', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&fm=jpg' },
  { name: 'Green Tea', description: 'Clean box of tea.', price: 150, category: 'Beverages', stock: 50, unit: 'box', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=400&fm=jpg' },
  { name: 'Cola', description: 'Simple glass of cola.', price: 95, category: 'Beverages', stock: 80, unit: 'bottle', image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?q=80&w=400&fm=jpg' },
  { name: 'Still Water', description: 'Simple water bottle.', price: 20, category: 'Beverages', stock: 200, unit: 'bottle', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?q=80&w=400&fm=jpg' },

  // 6. Personal Care
  { name: 'Soap Bar', description: 'Minimalist white soap.', price: 150, category: 'Personal Care', stock: 50, unit: 'pack', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=400&fm=jpg' },
  { name: 'Shampoo', description: 'Clean shampoo bottle.', price: 350, category: 'Personal Care', stock: 40, unit: 'bottle', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=400&fm=jpg' },
  { name: 'Toothbrush', description: 'Single bamboo toothbrush.', price: 95, category: 'Personal Care', stock: 70, unit: 'pack', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=400&fm=jpg' },
  { name: 'Face Cream', description: 'Minimalist jar of cream.', price: 120, category: 'Personal Care', stock: 60, unit: 'tube', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&fm=jpg' },
  { name: 'Perfume', description: 'Elegant glass bottle.', price: 2500, category: 'Personal Care', stock: 20, unit: 'bottle', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&fm=jpg' },

  // 7. Home Care
  { name: 'Laundry Soap', description: 'Box of clean detergent.', price: 450, category: 'Home Care', stock: 40, unit: 'pack', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&fm=jpg' },
  { name: 'Dish Soap', description: 'Simple dish liquid.', price: 105, category: 'Home Care', stock: 60, unit: 'bottle', image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=400&fm=jpg' },
  { name: 'Floor Cleaner', description: 'Clean surface liquid.', price: 180, category: 'Home Care', stock: 50, unit: 'bottle', image: 'https://images.unsplash.com/photo-1584622781514-f25086b0ec77?q=80&w=400&fm=jpg' },
  { name: 'Spray Bottle', description: 'Simple spray cleaner.', price: 140, category: 'Home Care', stock: 50, unit: 'bottle', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=400&fm=jpg' },
  { name: 'Microfiber', description: 'Clean folded cloth.', price: 95, category: 'Home Care', stock: 40, unit: 'pack', image: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=400&fm=jpg' },

  // 8. Kitchen
  { name: 'Electric Kettle', description: 'Sleek metal kettle.', price: 1200, category: 'Kitchen Appliances', stock: 20, unit: 'piece', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=400&fm=jpg' },
  { name: 'Toaster', description: 'Minimalist white toaster.', price: 1800, category: 'Kitchen Appliances', stock: 15, unit: 'piece', image: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?q=80&w=400&fm=jpg' },
  { name: 'Hand Mixer', description: 'Simple electric mixer.', price: 1500, category: 'Kitchen Appliances', stock: 15, unit: 'piece', image: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?q=80&w=400&fm=jpg' },
  { name: 'Coffee Press', description: 'Minimalist French press.', price: 3500, category: 'Kitchen Appliances', stock: 10, unit: 'piece', image: 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?q=80&w=400&fm=jpg' },
  { name: 'Chef Knife', description: 'Single high-grade knife.', price: 2800, category: 'Kitchen Appliances', stock: 10, unit: 'piece', image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=400&fm=jpg' },

  // 9. Electronics
  { name: 'Earbuds', description: 'White wireless pods.', price: 1999, category: 'Electronics', stock: 25, unit: 'piece', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&fm=jpg' },
  { name: 'Power Hub', description: 'Minimalist power bank.', price: 1299, category: 'Electronics', stock: 30, unit: 'piece', image: 'https://images.unsplash.com/photo-1560169897-bb334ee5b0e5?q=80&w=400&fm=jpg' },
  { name: 'Phone Stand', description: 'Simple metal desk mount.', price: 299, category: 'Electronics', stock: 100, unit: 'piece', image: 'https://images.unsplash.com/photo-1586105251261-72a756654a11?q=80&w=400&fm=jpg' },
  { name: 'Slim Mouse', description: 'Minimalist white mouse.', price: 599, category: 'Electronics', stock: 40, unit: 'piece', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&fm=jpg' },
  { name: 'Smart Watch', description: 'Minimalist fitness band.', price: 2499, category: 'Electronics', stock: 20, unit: 'piece', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&fm=jpg' },

  // 10. Home & Living
  { name: 'Cotton Sheets', description: 'Clean white bedding.', price: 850, category: 'Home & Living', stock: 30, unit: 'set', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&fm=jpg' },
  { name: 'Bath Towel', description: 'Single soft white towel.', price: 450, category: 'Home & Living', stock: 50, unit: 'piece', image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?q=80&w=400&fm=jpg' },
  { name: 'White Candle', description: 'Simple glass jar candle.', price: 250, category: 'Home & Living', stock: 40, unit: 'piece', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&fm=jpg' },
  { name: 'Wall Clock', description: 'Minimalist analog clock.', price: 750, category: 'Home & Living', stock: 20, unit: 'piece', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=400&fm=jpg' },
  { name: 'Modern Vase', description: 'Simple ceramic vase.', price: 3500, category: 'Home & Living', stock: 10, unit: 'piece', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&fm=jpg' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products.');
    await Product.insertMany(products);
    console.log(`🚀 Successfully seeded ${products.length} products with 100% minimalist, human-free imagery!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
