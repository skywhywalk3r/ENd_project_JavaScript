const buttons = document.querySelectorAll('.category-filter button');
const form = document.getElementById('filter-form');
const sortSelect = document.getElementById('sort-select');
const stockCheckbox = document.querySelector('input[name="in-stock"]');
const list = document.getElementById('catalog-list');
const count = document.getElementById('products-count');
const searchInput = document.querySelector('.input-search');

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const btnCatalog = document.getElementById('btnCatalog');

const items = Array.from(list.children);
let category = 'all';

function openCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.add('is-open');
    cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove('is-open');
    cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
}

if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
    cartBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openCart();
        }
    });
}

if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (btnCatalog) btnCatalog.addEventListener('click', closeCart);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('is-open')) {
        closeCart();
    }
});

function getCategory(item) {
    return item.querySelectorAll('p')[0].textContent.trim();
}

function getPrice(item) {
    return parseInt(item.querySelectorAll('p')[1].textContent.replace(/\D/g, ''));
}

function isInStock(item) {
    return !item.querySelector('button[disabled]');
}

function update() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let shown = items.filter(function (item) {
        const rightCategory = category === 'all' || getCategory(item) === category;
        const rightStock = !stockCheckbox.checked || isInStock(item);

        const titleEl = item.querySelector('h3');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const desc = item.getAttribute('data-desc') ? item.getAttribute('data-desc').toLowerCase() : '';
        const cat = getCategory(item).toLowerCase();

        const rightSearch = !query || title.includes(query) || desc.includes(query) || cat.includes(query);

        return rightCategory && rightStock && rightSearch;
    });

    if (sortSelect.value === 'price-asc') {
        shown.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortSelect.value === 'price-desc') {
        shown.sort((a, b) => getPrice(b) - getPrice(a));
    }

    items.forEach(item => item.hidden = true);
    shown.forEach(function (item) {
        item.hidden = false;
        list.appendChild(item);
    });

    count.textContent = shown.length + ' товарів';
}

buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        category = button.dataset.category;
        update();
    });
});

sortSelect.addEventListener('change', update);
stockCheckbox.addEventListener('change', update);

if (searchInput) {
    searchInput.addEventListener('input', update);
}

form.addEventListener('reset', function () {
    category = 'all';
    buttons.forEach(b => b.classList.remove('active'));
    buttons[0].classList.add('active');
    if (searchInput) searchInput.value = '';
    setTimeout(update, 0);
});

update();