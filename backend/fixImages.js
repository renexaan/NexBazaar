require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for image fixing...');
    
    const products = await Product.find({});
    
    for (const product of products) {
      // Use a reliable placeholder or picsum image.
      // placehold.co provides a nice clean colored block with text.
      // Using the brand blue #1d3d8a.
      const newImage = `https://placehold.co/400x400/1d3d8a/ffffff?text=${encodeURIComponent(product.name.replace(' ', '+'))}`;
      
      product.image = newImage;
      await product.save();
    }
    
    console.log(`🚀 Successfully updated images for ${products.length} products!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating database:', err);
    process.exit(1);
  }
};

fixImages();
