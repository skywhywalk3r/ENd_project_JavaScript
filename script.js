const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const btnCatalog = document.getElementById('btnCatalog');

function openCart() {
    cartSidebar.classList.add('is-open');
    cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('is-open');
    cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
btnCatalog.addEventListener('click', closeCart);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeCart();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');
    const notFoundMessage = document.getElementById('notFoundMessage');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let hasVisibleProducts = false;

        productCards.forEach((card) => {
            const titleElement = card.querySelector('.product-title');
            const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';

            if (titleText.includes(query)) {
                card.style.display = '';
                hasVisibleProducts = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (notFoundMessage) {
            notFoundMessage.style.display = hasVisibleProducts ? 'none' : 'block';
        }
    });
});