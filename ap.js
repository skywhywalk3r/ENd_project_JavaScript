const buttons = document.querySelectorAll('.category-filter button');
const form = document.getElementById('filter-form');
const sortSelect = document.getElementById('sort-select');
const stockCheckbox = document.querySelector('input[name="in-stock"]');
const list = document.getElementById('catalog-list');
const count = document.getElementById('products-count');

const items = Array.from(list.children); // всі картки товарів
let category = 'all';

// Дані картки: категорія, ціна, чи є в наявності
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
    // 1. Залишаємо тільки потрібні товари
    let shown = items.filter(function (item) {
        const rightCategory = category === 'all' || getCategory(item) === category;
        const rightStock = !stockCheckbox.checked || isInStock(item);
        return rightCategory && rightStock;
    });

    // 2. Сортуємо за ціною
    if (sortSelect.value === 'price-asc') {
        shown.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortSelect.value === 'price-desc') {
        shown.sort((a, b) => getPrice(b) - getPrice(a));
    }

    // 3. Ховаємо всі, потім показуємо потрібні в правильному порядку
    items.forEach(item => item.hidden = true);
    shown.forEach(function (item) {
        item.hidden = false;
        list.appendChild(item);
    });

    // 4. Лічильник
    count.textContent = shown.length + ' товарів';
}

// Клік по категорії
buttons.forEach(function (button) {
    button.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        category = button.dataset.category;
        update();
    });
});

// Зміна сортування та чекбокса
sortSelect.addEventListener('change', update);
stockCheckbox.addEventListener('change', update);

// Скидання фільтрів
form.addEventListener('reset', function () {
    category = 'all';
    buttons.forEach(b => b.classList.remove('active'));
    buttons[0].classList.add('active');
    setTimeout(update, 0); // чекаємо, поки форма реально скинеться
});

update();