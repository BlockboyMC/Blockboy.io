// Cart Management System
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartButtons = document.querySelectorAll('#cart-btn');
    cartButtons.forEach(btn => btn.setAttribute('data-count', count));
}

function addToCart(item) {
    const cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart(cart);
    showToast(`${item.name} added to cart!`);
}

function removeFromCart(index) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1)[0];
        saveCart(cart);
        loadCartItems();
        updateSubtotal();
        showToast(`${removedItem.name} removed from cart`);
    }
}

function updateQuantity(index, quantity) {
    const cart = getCart();
    quantity = parseInt(quantity);
    
    if (index >= 0 && index < cart.length) {
        if (quantity <= 0) {
            removeFromCart(index);
        } else {
            cart[index].quantity = quantity;
            saveCart(cart);
            loadCartItems();
            updateSubtotal();
        }
    }
}

function loadCartItems() {
    const cart = getCart();
    const cartContainers = document.querySelectorAll('#cart-items');
    
    cartContainers.forEach(container => {
        container.innerHTML = '';
        
        if (cart.length === 0) {
            container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span class="fas fa-times remove-btn" onclick="removeFromCart(${index})"></span>
                <img src="${item.image}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                    <div class="price">${item.price}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            `;
            container.appendChild(cartItem);
        });
    });
    
    updateSubtotal();
}

function updateSubtotal() {
    const cart = getCart();
    const subtotalElements = document.querySelectorAll('#subtotal, #mini-subtotal');
    
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('GH₵', '').replace(',', '')) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);
    
    subtotalElements.forEach(el => {
        if (el) el.textContent = `GH₵${subtotal.toFixed(2)}`;
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    updateCartCount();
});