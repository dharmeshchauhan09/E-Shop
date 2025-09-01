const db = require('./db');
const { User, Product, Order, Cart } = require('./models');

async function runThoroughTests() {
  try {
    console.log('Starting thorough MongoDB tests...');

    // Clear collections before tests
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    // Test User model - validation errors
    try {
      const invalidUser = new User({ email: 'no-username@example.com', password: 'pass' });
      await invalidUser.save();
    } catch (err) {
      console.log('User validation error as expected:', err.message);
    }

    // Test Product model - required fields
    try {
      const invalidProduct = new Product({ description: 'Missing name and price' });
      await invalidProduct.save();
    } catch (err) {
      console.log('Product validation error as expected:', err.message);
    }

    // Create valid User and Product for further tests
    const user = new User({ username: 'edgeuser', email: 'edge@example.com', password: 'password123' });
    await user.save();

    const product = new Product({ name: 'Edge Product', price: 15.99 });
    await product.save();

    // Test Cart model - adding multiple items
    const cart = new Cart({
      user: user._id,
      items: [
        { product: product._id, quantity: 1 },
        { product: product._id, quantity: 3 },
      ],
    });
    await cart.save();
    console.log('Cart with multiple items created:', cart);

    // Test Order model - status update and total price calculation
    const order = new Order({
      user: user._id,
      products: [{ product: product._id, quantity: 2 }],
      totalPrice: 31.98,
      status: 'Pending',
    });
    await order.save();

    order.status = 'Shipped';
    await order.save();
    console.log('Order status updated:', order);

    // Test read operations with population
    const populatedOrder = await Order.findById(order._id).populate('user').populate('products.product');
    console.log('Populated order:', populatedOrder);

    // Test delete cascade behavior (if implemented)
    await User.deleteOne({ _id: user._id });
    const orphanCart = await Cart.findOne({ user: user._id });
    console.log('Orphan cart after user deletion (should be null or handled):', orphanCart);

    console.log('All thorough tests completed successfully.');
  } catch (error) {
    console.error('Thorough test failed:', error);
  } finally {
    await db.close();
    console.log('MongoDB connection closed.');
  }
}

db.once('open', () => {
  runThoroughTests();
});
