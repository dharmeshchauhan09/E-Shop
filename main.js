// Utility functions for cart management
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Login
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

  if (!storedUser) {
    alert("No user found. Please register first.");
    return;
  }

  if (storedUser.email !== email) {
    alert("Email not registered!");
    return;
  }

  if (storedUser.password !== password) {
    alert("Wrong password!");
    return;
  }

  localStorage.setItem("loggedInUser", storedUser.email);
  alert("Login successful!");
  window.location.href = "index.html";
}

// Sign Up
function signUpUser(event) {
  event.preventDefault();

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("registeredUser", JSON.stringify(user));
  alert("Registration successful!");
  window.location.href = "login.html";
}

// Add or update product in cart
function addToCart(product) {
  let cart = getCart();
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  alert("Product added to cart!");
}

// Remove product from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  displayCart();
}

// Update product quantity in cart
function updateQuantity(productId, quantity) {
  let cart = getCart();
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity = quantity;
    if (product.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(cart);
      displayCart();
    }
  }
}

// Display Cart
function displayCart() {
  const cart = getCart();
  const cartItemsDiv = document.getElementById("cart-items");
  if (!cartItemsDiv) return;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  let html = "<ul>";
  cart.forEach(item => {
    html += `
      <li>
        <img src="${item.image}" width="50" alt="${item.name}">
        ${item.name} - $${item.price} × 
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </li>`;
    total += item.price * item.quantity;
  });
  html += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
  cartItemsDiv.innerHTML = html;
}

// Checkout Summary
function showCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-summary');
  const cart = getCart();

  if (cart.length === 0) {
    summaryEl.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  let summaryHTML = '<strong>Order Summary:</strong><ul>';

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    summaryHTML += `<li>${item.name} - ${item.quantity} × $${item.price} = $${subtotal.toFixed(2)}</li>`;
  });

  summaryHTML += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
  summaryEl.innerHTML = summaryHTML;
}

function confirmOrder() {
  alert("Order confirmed! Thank you for your purchase.");
  localStorage.removeItem('cart'); // clear the cart
  window.location.href = "thankyou.html"; // or any confirmation page
}

// Load summary on page load
showCheckoutSummary();

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  alert("You have been logged out.");
  window.location.href = "login.html";
}
