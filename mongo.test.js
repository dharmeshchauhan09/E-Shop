const db = require('./db');
const { User, Product, Order, Cart } = require('./models');

async function runTests() {
  try {
    console.log('Starting MongoDB tests...');

    // Clear collections before tests
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    // Test User model
    const user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    await user.save();
    console.log('User created:', user);

    // Test Product model
    const product = new Product({ name: 'Test Product', description: 'A product for testing', price: 9.99, stock: 100 });
    await product.save();
    console.log('Product created:', product);

    // Test Cart model
    const cart = new Cart({ user: user._id, items: [{ product: product._id, quantity: 2 }] });
    await cart.save();
    console.log('Cart created:', cart);

    // Test Order model
    const order = new Order({
      user: user._id,
      products: [{ product: product._id, quantity: 2 }],
      totalPrice: 19.98,
      status: 'Pending',
    });
    await order.save();
    console.log('Order created:', order);

    // Test read operations
    const foundUser = await User.findOne({ username: 'testuser' });
    console.log('Found user:', foundUser);

    const foundProduct = await Product.findOne({ name: 'Test Product' });
    console.log('Found product:', foundProduct);

    // Test update operation
    foundUser.email = 'updated@example.com';
    await foundUser.save();
    console.log('User updated:', foundUser);

    // Test delete operation
    await Product.deleteOne({ _id: product._id });
    const deletedProduct = await Product.findById(product._id);
    console.log('Deleted product found:', deletedProduct); // should be null

    console.log('All tests completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await db.close();
    console.log('MongoDB connection closed.');
  }
}

db.once('open', () => {
  runTests();
});
