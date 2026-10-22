const modal = document.getElementById('product-modal');
const closeBtn = modal.querySelector('.modal__close');
const imgEl = document.getElementById('modal-img');
const metaEl = document.getElementById('modal-meta');
const titleEl = document.getElementById('modal-title');
const priceEl = document.getElementById('modal-price');
const descEl = document.getElementById('modal-desc');
const sizesEl = document.getElementById('modal-sizes');
const qtyEl = document.getElementById('modal-qty');
const minusBtn = document.getElementById('qty-minus');
const plusBtn = document.getElementById('qty-plus');
const addBtn = document.getElementById('modal-add');
const cartIcon = document.querySelector('.cart-count i');
const cartBadge = document.querySelector('.cart-badge');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');
const cartCountSummary = document.getElementById('cartCountSummary');
const cartTotalPrice = document.getElementById('cartTotalPrice');

const sizesByCategory = {
    'Кросівки': ['40', '41', '42', '43', '44'],
    'Худі': ['S', 'M', 'L', 'XL', 'XXL'],
    'Футболки': ['S', 'M', 'L', 'XL', 'XXL'],
    'Кепки': ['One size'],
};

let quantity = 1;
let cartTotal = 0;
let cart = [];

function formatPrice(value) {
    return Number(value).toLocaleString('en-US') + ' $';
}

function renderCart() {
    if (!cartItems || !cartBadge || !cartIcon) return;

    const totalItems = cart.reduce(function (sum, item) {
        return sum + item.qty;
    }, 0);

    const totalPrice = cart.reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0);

    const headerCount = document.getElementById('cartHeaderCount');
    if (headerCount) headerCount.textContent = totalItems;

    cartBadge.textContent = totalItems;
    cartIcon.className = 'bi bi-' + Math.min(totalItems, 9) + '-circle-fill';

    if (totalItems === 0) {
        cartItems.innerHTML = '';
        if (cartEmpty) cartEmpty.hidden = false;
        if (cartSummary) cartSummary.hidden = true;
        return;
    }

    if (cartEmpty) cartEmpty.hidden = true;
    if (cartSummary) cartSummary.hidden = false;

    cartItems.innerHTML = cart.map(function (item, index) {
        return `
            <div class="cart-item">
                <img class="cart-item__img" src="${item.img}" alt="${item.name}">
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__meta">${item.size}</div>
                    <div class="cart-item__controls">
                        <div class="cart-item__qty">
                            <button type="button" data-action="minus" data-index="${index}">-</button>
                            <span>${item.qty}</span>
                            <button type="button" data-action="plus" data-index="${index}">+</button>
                        </div>
                        <button type="button" class="cart-item__remove" data-role="remove" data-index="${index}">Видалити</button>
                    </div>
                </div>
                <span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
            </div>
        `;
    }).join('');

    if (cartCountSummary) cartCountSummary.textContent = totalItems;
    if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(totalPrice);

    cartItems.querySelectorAll('button[data-action]').forEach(function (button) {
        button.addEventListener('click', function () {
            const index = Number(button.dataset.index);
            const action = button.dataset.action;
            const item = cart[index];
            if (!item) return;

            if (action === 'plus') {
                item.qty += 1;
            } else {
                item.qty -= 1;
                if (item.qty <= 0) {
                    cart.splice(index, 1);
                }
            }

            renderCart();
        });
    });

    cartItems.querySelectorAll('button[data-role="remove"]').forEach(function (button) {
        button.addEventListener('click', function () {
            const index = Number(button.dataset.index);
            if (!Number.isNaN(index)) {
                cart.splice(index, 1);
                renderCart();
            }
        });
    });
}

function addToCart(product) {
    const existing = cart.find(function (item) {
        return item.name === product.name && item.size === product.size;
    });

    if (existing) {
        existing.qty += product.qty;
    } else {
        cart.push(product);
    }

    renderCart();
}

function openModal(card) {
    const category = card.querySelectorAll('p')[0].textContent.trim();
    const name = card.querySelector('h3').textContent.trim();
    const price = card.querySelectorAll('p')[1].textContent.trim();
    const cardImg = card.querySelector('img');

    imgEl.src = cardImg.getAttribute('src');
    imgEl.alt = cardImg.alt;

    const firstSpace = name.indexOf(' ');
    const firstWord = name.slice(0, firstSpace);
    const rest = name.slice(firstSpace);

    metaEl.textContent = (card.dataset.brand || 'URBN') + ' · ' + category;
    titleEl.textContent = '';
    const bold = document.createElement('b');
    bold.textContent = firstWord;
    titleEl.append(bold, rest);

    priceEl.textContent = price;
    descEl.textContent = card.dataset.desc || '';

    sizesEl.textContent = '';
    const sizes = sizesByCategory[category] || ['One size'];
    sizes.forEach(function (size, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal__size' + (i === 0 ? ' active' : '');
        btn.textContent = size;
        sizesEl.appendChild(btn);
    });

    quantity = 1;
    qtyEl.textContent = quantity;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
}

document.querySelectorAll('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        openModal(btn.closest('li'));
    });
});

sizesEl.addEventListener('click', function (e) {
    if (e.target.tagName !== 'BUTTON') return;
    sizesEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
});

minusBtn.addEventListener('click', function () {
    if (quantity > 1) quantity--;
    qtyEl.textContent = quantity;
});
plusBtn.addEventListener('click', function () {
    if (quantity < 10) quantity++;
    qtyEl.textContent = quantity;
});

addBtn.addEventListener('click', function () {
    const selectedSize = document.querySelector('.modal__size.active')?.textContent.trim() || 'One size';
    const priceValue = Number(priceEl.textContent.replace(/\D/g, '')) || 0;
    const productName = titleEl.textContent.replace(/\s+/g, ' ').trim();
    const productImg = imgEl.getAttribute('src');

    addToCart({
        name: productName,
        size: selectedSize,
        price: priceValue,
        qty: quantity,
        img: productImg
    });

    closeModal();
    if (typeof openCart === 'function') openCart();
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
});

openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
    }
});