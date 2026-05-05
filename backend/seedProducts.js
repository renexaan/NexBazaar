require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  // 1. Fruits & Vegetables
  { name: 'Fresh Banana', description: 'Single yellow banana.', price: 40, category: 'Fruits & Vegetables', stock: 100, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Fresh%2BBanana' },
  { name: 'Red Apple', description: 'Single crisp red apple.', price: 180, category: 'Fruits & Vegetables', stock: 80, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Red%2BApple' },
  { name: 'Potato', description: 'Clean brown potato.', price: 30, category: 'Fruits & Vegetables', stock: 200, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Potato' },
  { name: 'Onion', description: 'Simple red onion.', price: 50, category: 'Fruits & Vegetables', stock: 150, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Onion' },
  { name: 'Tomato', description: 'Single ripe tomato.', price: 40, category: 'Fruits & Vegetables', stock: 120, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Tomato' },

  // 2. Dairy & Bakery
  { name: 'Milk Bottle', description: 'Bottle of fresh milk.', price: 66, category: 'Dairy & Bakery', stock: 50, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Milk%2BBottle' },
  { name: 'Salted Butter', description: 'Simple block of butter.', price: 250, category: 'Dairy & Bakery', stock: 40, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Salted%2BButter' },
  { name: 'Paneer', description: 'Clean block of fresh paneer.', price: 90, category: 'Dairy & Bakery', stock: 60, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Paneer' },
  { name: 'Fresh Loaf', description: 'Minimalist bread loaf.', price: 45, category: 'Dairy & Bakery', stock: 30, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Fresh%2BLoaf' },
  { name: 'Greek Yogurt', description: 'Simple cup of yogurt.', price: 55, category: 'Dairy & Bakery', stock: 45, unit: 'cup', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Greek%2BYogurt' },

  // 3. Staples & Pulses
  { name: 'Basmati Rice', description: 'Bowl of white rice.', price: 650, category: 'Staples & Pulses', stock: 30, unit: 'bag', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Basmati%2BRice' },
  { name: 'Yellow Dal', description: 'Clean yellow pulses.', price: 160, category: 'Staples & Pulses', stock: 50, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Yellow%2BDal' },
  { name: 'White Sugar', description: 'Clean crystal sugar.', price: 48, category: 'Staples & Pulses', stock: 100, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=White%2BSugar' },
  { name: 'Wheat Flour', description: 'Simple bowl of flour.', price: 450, category: 'Staples & Pulses', stock: 40, unit: 'bag', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Wheat%2BFlour' },
  { name: 'Chickpeas', description: 'Dry white chickpeas.', price: 140, category: 'Staples & Pulses', stock: 50, unit: 'kg', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Chickpeas' },

  // 4. Snacks
  { name: 'Potato Chips', description: 'Bowl of simple chips.', price: 50, category: 'Snacks & Branded Foods', stock: 100, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Potato%2BChips' },
  { name: 'Dark Chocolate', description: 'Minimalist chocolate bar.', price: 120, category: 'Snacks & Branded Foods', stock: 60, unit: 'bar', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Dark%2BChocolate' },
  { name: 'Noodles', description: 'Simple bowl of noodles.', price: 96, category: 'Snacks & Branded Foods', stock: 80, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Noodles' },
  { name: 'Salted Nuts', description: 'Bowl of roasted nuts.', price: 350, category: 'Snacks & Branded Foods', stock: 30, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Salted%2BNuts' },
  { name: 'Cookies', description: 'Simple stack of cookies.', price: 80, category: 'Snacks & Branded Foods', stock: 50, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Cookies' },

  // 5. Beverages
  { name: 'Orange Juice', description: 'Bottle of orange juice.', price: 110, category: 'Beverages', stock: 60, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Orange%2BJuice' },
  { name: 'Coffee Beans', description: 'Minimalist coffee jar.', price: 450, category: 'Beverages', stock: 40, unit: 'jar', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Coffee%2BBeans' },
  { name: 'Green Tea', description: 'Clean box of tea.', price: 150, category: 'Beverages', stock: 50, unit: 'box', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Green%2BTea' },
  { name: 'Cola', description: 'Simple glass of cola.', price: 95, category: 'Beverages', stock: 80, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Cola' },
  { name: 'Still Water', description: 'Simple water bottle.', price: 20, category: 'Beverages', stock: 200, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Still%2BWater' },

  // 6. Personal Care
  { name: 'Soap Bar', description: 'Minimalist white soap.', price: 150, category: 'Personal Care', stock: 50, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Soap%2BBar' },
  { name: 'Shampoo', description: 'Clean shampoo bottle.', price: 350, category: 'Personal Care', stock: 40, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Shampoo' },
  { name: 'Toothbrush', description: 'Single bamboo toothbrush.', price: 95, category: 'Personal Care', stock: 70, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Toothbrush' },
  { name: 'Face Cream', description: 'Minimalist jar of cream.', price: 120, category: 'Personal Care', stock: 60, unit: 'tube', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Face%2BCream' },
  { name: 'Perfume', description: 'Elegant glass bottle.', price: 2500, category: 'Personal Care', stock: 20, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Perfume' },

  // 7. Home Care
  { name: 'Laundry Soap', description: 'Box of clean detergent.', price: 450, category: 'Home Care', stock: 40, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Laundry%2BSoap' },
  { name: 'Dish Soap', description: 'Simple dish liquid.', price: 105, category: 'Home Care', stock: 60, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Dish%2BSoap' },
  { name: 'Floor Cleaner', description: 'Clean surface liquid.', price: 180, category: 'Home Care', stock: 50, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Floor%2BCleaner' },
  { name: 'Spray Bottle', description: 'Simple spray cleaner.', price: 140, category: 'Home Care', stock: 50, unit: 'bottle', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Spray%2BBottle' },
  { name: 'Microfiber', description: 'Clean folded cloth.', price: 95, category: 'Home Care', stock: 40, unit: 'pack', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Microfiber' },

  // 8. Kitchen
  { name: 'Electric Kettle', description: 'Sleek metal kettle.', price: 1200, category: 'Kitchen Appliances', stock: 20, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Electric%2BKettle' },
  { name: 'Toaster', description: 'Minimalist white toaster.', price: 1800, category: 'Kitchen Appliances', stock: 15, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Toaster' },
  { name: 'Hand Mixer', description: 'Simple electric mixer.', price: 1500, category: 'Kitchen Appliances', stock: 15, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Hand%2BMixer' },
  { name: 'Coffee Press', description: 'Minimalist French press.', price: 3500, category: 'Kitchen Appliances', stock: 10, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Coffee%2BPress' },
  { name: 'Chef Knife', description: 'Single high-grade knife.', price: 2800, category: 'Kitchen Appliances', stock: 10, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Chef%2BKnife' },

  // 9. Electronics
  { name: 'Earbuds', description: 'White wireless pods.', price: 1999, category: 'Electronics', stock: 25, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Earbuds' },
  { name: 'Power Hub', description: 'Minimalist power bank.', price: 1299, category: 'Electronics', stock: 30, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Power%2BHub' },
  { name: 'Phone Stand', description: 'Simple metal desk mount.', price: 299, category: 'Electronics', stock: 100, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Phone%2BStand' },
  { name: 'Slim Mouse', description: 'Minimalist white mouse.', price: 599, category: 'Electronics', stock: 40, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Slim%2BMouse' },
  { name: 'Smart Watch', description: 'Minimalist fitness band.', price: 2499, category: 'Electronics', stock: 20, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Smart%2BWatch' },

  // 10. Home & Living
  { name: 'Cotton Sheets', description: 'Clean white bedding.', price: 850, category: 'Home & Living', stock: 30, unit: 'set', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Cotton%2BSheets' },
  { name: 'Bath Towel', description: 'Single soft white towel.', price: 450, category: 'Home & Living', stock: 50, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Bath%2BTowel' },
  { name: 'White Candle', description: 'Simple glass jar candle.', price: 250, category: 'Home & Living', stock: 40, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=White%2BCandle' },
  { name: 'Wall Clock', description: 'Minimalist analog clock.', price: 750, category: 'Home & Living', stock: 20, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Wall%2BClock' },
  { name: 'Modern Vase', description: 'Simple ceramic vase.', price: 3500, category: 'Home & Living', stock: 10, unit: 'piece', image: 'https://placehold.co/400x400/1d3d8a/ffffff?text=Modern%2BVase' },
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
