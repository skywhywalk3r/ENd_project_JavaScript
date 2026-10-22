const buttons = document.querySelectorAll('.category-filter button');
const form = document.getElementById('filter-form');
const sortSelect = document.getElementById('sort-select');
const stockCheckbox = document.querySelector('input[name="in-stock"]');
const list = document.getElementById('catalog-list');
const count = document.getElementById('products-count');

const items = Array.from(list.children);
let category = 'all';

function getCategory(item) {
    return item.querySelectorAll('p')[0].textContent.trim();
}
function getPrice(item) {
    return parseInt(item.querySelectorAll('p')[1].textContent.replace('$', ''));
}
function isInStock(item) {
    return !item.querySelector('button[disabled]');
}

function update() {
    let shown = items.filter(function (item) {
        const rightCategory = category === 'all' || getCategory(item) === category;
        const rightStock = !stockCheckbox.checked || isInStock(item);
        return rightCategory && rightStock;
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

form.addEventListener('reset', function () {
    category = 'all';
    buttons.forEach(b => b.classList.remove('active'));
    buttons[0].classList.add('active');
    setTimeout(update, 0); 
});

update();