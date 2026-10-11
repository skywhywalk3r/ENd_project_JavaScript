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

// Які розміри показувати для кожної категорії
const sizesByCategory = {
    'Кросівки': ['40', '41', '42', '43', '44'],
    'Худі': ['S', 'M', 'L', 'XL', 'XXL'],
    'Футболки': ['S', 'M', 'L', 'XL', 'XXL'],
    'Кепки': ['One size'],
};

let quantity = 1;
let cartTotal = 0;

// Відкрити модалку і заповнити її даними з картки
function openModal(card) {
    const category = card.querySelectorAll('p')[0].textContent.trim();
    const name = card.querySelector('h3').textContent.trim();
    const price = card.querySelectorAll('p')[1].textContent.trim();
    const cardImg = card.querySelector('img');

    // Фото саме цього товару
    imgEl.src = cardImg.getAttribute('src');
    imgEl.alt = cardImg.alt;

    // Перше слово назви - жирне, решта - тонка
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

    // Розміри
    sizesEl.textContent = '';
    const sizes = sizesByCategory[category] || ['One size'];
    sizes.forEach(function (size, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal__size' + (i === 0 ? ' active' : '');
        btn.textContent = size;
        sizesEl.appendChild(btn);
    });

    // Кількість скидаємо на 1
    quantity = 1;
    qtyEl.textContent = quantity;

    modal.hidden = false;
    document.body.style.overflow = 'hidden'; // забороняємо прокрутку сторінки
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
}

// Кнопки "У кошик" відкривають модалку
document.querySelectorAll('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        openModal(btn.closest('li'));
    });
});

// Вибір розміру
sizesEl.addEventListener('click', function (e) {
    if (e.target.tagName !== 'BUTTON') return;
    sizesEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
});

// Кількість
minusBtn.addEventListener('click', function () {
    if (quantity > 1) quantity--;
    qtyEl.textContent = quantity;
});
plusBtn.addEventListener('click', function () {
    if (quantity < 10) quantity++;
    qtyEl.textContent = quantity;
});

// Додати в кошик: збільшуємо лічильник біля іконки кошика і закриваємо
addBtn.addEventListener('click', function () {
    cartTotal += quantity;
    if (cartBadge) cartBadge.textContent = cartTotal;
    if (cartIcon) {
        cartIcon.className = 'bi bi-' + Math.min(cartTotal, 9) + '-circle-fill';
    }
    closeModal();
});

// Закриття: хрестик, клік повз вікно, Escape
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
});