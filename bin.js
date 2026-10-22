(function () {
    'use strict';

    const CURRENCY_SYMBOL = '₴';

    const STORAGE_KEY = 'krok_street_cart_v1';

    let cartBtn = null;
    let cartSidebar = null;
    let cartOverlay = null;
    let cartClose = null;
    let btnCatalog = null;
    let cartIcon = null;
    let cartBadge = null;
    let cartItems = null;
    let cartEmpty = null;
    let cartSummary = null;
    let cartCountSummary = null;
    let cartTotalPrice = null;
    let cartHeaderCount = null;

    let cart = [];

    function loadCartFromStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    cart = parsed;
                }
            }
        } catch (err) {
            console.warn('[Cart] Помилка зчитування LocalStorage:', err);
            cart = [];
        }
    }

    function saveCartToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (err) {
            console.warn('[Cart] Помилка запису в LocalStorage:', err);
        }
    }

    function formatPrice(value) {
        return Number(value || 0).toLocaleString('uk-UA') + ' ' + CURRENCY_SYMBOL;
    }

    function cacheDOMElements() {
        cartBtn = document.getElementById('cartBtn');
        cartSidebar = document.getElementById('cartSidebar');
        cartOverlay = document.getElementById('cartOverlay');
        cartClose = document.getElementById('cartClose');
        btnCatalog = document.getElementById('btnCatalog');
        cartIcon = document.querySelector('.cart-count i');
        cartBadge = document.querySelector('.cart-badge');
        cartItems = document.getElementById('cartItems');
        cartEmpty = document.getElementById('cartEmpty');
        cartSummary = document.getElementById('cartSummary');
        cartCountSummary = document.getElementById('cartCountSummary');
        cartTotalPrice = document.getElementById('cartTotalPrice');
        cartHeaderCount = document.getElementById('cartHeaderCount');
    }

    function openCart() {
        if (!cartSidebar || !cartOverlay) cacheDOMElements();
        if (!cartSidebar || !cartOverlay) return;

        cartSidebar.classList.add('is-open');
        cartOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        if (!cartSidebar || !cartOverlay) cacheDOMElements();
        if (!cartSidebar || !cartOverlay) return;

        cartSidebar.classList.remove('is-open');
        cartOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function renderCart() {
        if (!cartItems) cacheDOMElements();

        const totalItems = cart.reduce(function (sum, item) {
            return sum + (Number(item.qty) || 1);
        }, 0);

        const totalPrice = cart.reduce(function (sum, item) {
            const price = Number(item.price) || 0;
            const qty = Number(item.qty) || 1;
            return sum + price * qty;
        }, 0);

        if (cartHeaderCount) {
            cartHeaderCount.textContent = totalItems;
        }

        if (cartBadge) {
            cartBadge.textContent = totalItems;
        }

        if (cartIcon) {
            cartIcon.className = 'bi bi-' + Math.min(totalItems, 9) + '-circle-fill';
        }

        if (totalItems === 0) {
            if (cartItems) cartItems.innerHTML = '';
            if (cartEmpty) cartEmpty.hidden = false;
            if (cartSummary) cartSummary.hidden = true;
            return;
        }

        if (cartEmpty) cartEmpty.hidden = true;
        if (cartSummary) cartSummary.hidden = false;

        if (cartItems) {
            cartItems.innerHTML = cart.map(function (item, index) {
                const itemImg = item.img || 'images/logo.webp';
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.qty) || 1;
                const lineTotal = itemPrice * itemQty;
                const itemSizeHtml = item.size ? `<div class="cart-item__meta">Розмір: ${item.size}</div>` : '';

                return `
                    <div class="cart-item" data-index="${index}">
                        <img class="cart-item__img" src="${itemImg}" alt="${item.name}">
                        <div class="cart-item__info">
                            <div class="cart-item__name">${item.name}</div>
                            ${itemSizeHtml}
                            <div class="cart-item__controls">
                                <div class="cart-item__qty">
                                    <button type="button" data-action="minus" data-index="${index}" aria-label="Зменшити">−</button>
                                    <span>${itemQty}</span>
                                    <button type="button" data-action="plus" data-index="${index}" aria-label="Збільшити">+</button>
                                </div>
                                <button type="button" class="cart-item__remove" data-action="remove" data-index="${index}">Видалити</button>
                            </div>
                        </div>
                        <span class="cart-item__price">${formatPrice(lineTotal)}</span>
                    </div>
                `;
            }).join('');
        }

        if (cartCountSummary) cartCountSummary.textContent = totalItems;
        if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(totalPrice);
    }

    function addToCart(product) {
        if (!product || !product.name) return;

        const qtyToAdd = Math.max(1, Number(product.qty) || 1);
        const priceVal = Math.max(0, Number(product.price) || 0);
        const sizeVal = product.size ? String(product.size).trim() : 'One size';
        const imgVal = product.img || '';

        const existing = cart.find(function (item) {
            return item.name === product.name && item.size === sizeVal;
        });

        if (existing) {
            existing.qty += qtyToAdd;
        } else {
            cart.push({
                name: product.name,
                price: priceVal,
                qty: qtyToAdd,
                size: sizeVal,
                img: imgVal
            });
        }

        saveCartToStorage();
        renderCart();
    }

    function removeFromCart(index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            saveCartToStorage();
            renderCart();
        }
    }

    function changeQuantity(index, delta) {
        const item = cart[index];
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            cart.splice(index, 1);
        }

        saveCartToStorage();
        renderCart();
    }

    function clearCart() {
        cart = [];
        saveCartToStorage();
        renderCart();
    }

    function setupEventListeners() {
        cacheDOMElements();

        if (cartBtn) {
            cartBtn.addEventListener('click', openCart);
            cartBtn.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCart();
                }
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', closeCart);
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCart);
        }

        if (btnCatalog) {
            btnCatalog.addEventListener('click', closeCart);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('is-open')) {
                closeCart();
            }
        });

        if (cartItems) {
            cartItems.addEventListener('click', function (e) {
                const button = e.target.closest('button[data-action]');
                if (!button) return;

                const action = button.dataset.action;
                const index = Number(button.dataset.index);
                if (Number.isNaN(index)) return;

                if (action === 'plus') {
                    changeQuantity(index, 1);
                } else if (action === 'minus') {
                    changeQuantity(index, -1);
                } else if (action === 'remove') {
                    removeFromCart(index);
                }
            });
        }
    }

    function init() {
        loadCartFromStorage();
        setupEventListeners();
        renderCart();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.CartAPI = {
        open: openCart,
        close: closeCart,
        add: addToCart,
        remove: removeFromCart,
        changeQty: changeQuantity,
        clear: clearCart,
        render: renderCart,
        getItems: function () { return JSON.parse(JSON.stringify(cart)); },
        getTotalCount: function () {
            return cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
        },
        getTotalPrice: function () {
            return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
        }
    };

    window.openCart = openCart;
    window.closeCart = closeCart;
    window.addToCart = addToCart;
    window.renderCart = renderCart;
    window.formatPrice = formatPrice;
})();