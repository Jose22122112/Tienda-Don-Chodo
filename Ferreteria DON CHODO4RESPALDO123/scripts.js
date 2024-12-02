document.addEventListener('DOMContentLoaded', function () {
    const userFirstName = localStorage.getItem('userFirstName');
    const userProfilePic = localStorage.getItem('userProfilePic') || 'path/to/default/avatar.png';
    const userEmail = localStorage.getItem('userEmail');

    const loginSection = document.getElementById('login-section');
    const accountLink = document.getElementById('account-link');

    const urlParams = new URLSearchParams(window.location.search);
    const firstLogin = urlParams.get('firstLogin');

    if (userFirstName) {
        loginSection.innerHTML = '';
        accountLink.style.display = 'flex';
        accountLink.style.alignItems = 'center';
        accountLink.style.gap = '10px';

        const userInitial = document.createElement('span');
        userInitial.textContent = userFirstName[0].toUpperCase();
        userInitial.style.backgroundColor = '#ffa500';
        userInitial.style.color = 'white';
        userInitial.style.borderRadius = '50%';
        userInitial.style.width = '30px';
        userInitial.style.height = '30px';
        userInitial.style.display = 'flex';
        userInitial.style.justifyContent = 'center';
        userInitial.style.alignItems = 'center';
        userInitial.style.fontWeight = 'bold';

        const userDropdown = document.createElement('div');
        userDropdown.className = 'account-dropdown';

        const userDropdownContent = document.createElement('div');
        userDropdownContent.className = 'account-dropdown-content';

        const historyLink = document.createElement('a');
        historyLink.href = '#';
        historyLink.textContent = 'Ver Historial de Compras';
        historyLink.addEventListener('click', () => showPurchaseHistory());

        const profileLink = document.createElement('a');
        profileLink.href = '#';
        profileLink.textContent = 'Configurar Perfil';

        const anotherOptionLink = document.createElement('a');
        anotherOptionLink.href = '#';
        anotherOptionLink.textContent = 'Otra Opción';

        const logoutButton = document.createElement('a');
        logoutButton.href = '#';
        logoutButton.textContent = 'Cerrar Sesión';
        logoutButton.addEventListener('click', () => logoutUser());

        userDropdownContent.appendChild(historyLink);
        userDropdownContent.appendChild(profileLink);
        userDropdownContent.appendChild(anotherOptionLink);
        userDropdownContent.appendChild(logoutButton);
        userDropdown.appendChild(userDropdownContent);

        accountLink.appendChild(userInitial);
        accountLink.appendChild(document.createTextNode(userFirstName));
        accountLink.appendChild(userDropdown);
        loginSection.appendChild(accountLink);

        const welcomeMessage = document.getElementById('welcome-message');
        const userProfilePicElem = document.getElementById('user-profile-pic');
        const welcomeText = document.getElementById('welcome-text');

        userProfilePicElem.src = userProfilePic;
        welcomeText.textContent = `¡Bienvenido a DON CHODO, ${userFirstName}! 🛠️ Estamos emocionados de tenerte aquí. Explora nuestras herramientas de primera calidad y encuentra todo lo que necesitas para tus proyectos.`;

        if (firstLogin) {
            Swal.fire({
                title: '¡Bienvenido!',
                text: `¡Hola, ${userFirstName}! Has iniciado sesión correctamente.`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                welcomeMessage.style.display = 'flex';
            });
        } else {
            welcomeMessage.style.display = 'flex';
        }
    } else {
        loginSection.innerHTML = `
            <li><a href="Login1.Html">Iniciar sesión/Registrar</a></li>
        `;
    }

    function logoutUser() {
        localStorage.clear();
        Swal.fire({
            title: 'Cerraste sesión',
            text: 'Tu sesión se ha cerrado correctamente.',
            icon: 'info',
            confirmButtonText: 'Aceptar',
        }).then(() => {
            window.location.reload();
        });
    }

    function showPurchaseHistory() {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        if (purchaseHistory.length > 0) {
            const historyHtml = purchaseHistory
                .map(item => `<p>${item.product} - $${item.price.toFixed(2)}</p>`)
                .join('');
            Swal.fire({
                title: 'Historial de Compras',
                html: historyHtml,
                icon: 'info',
                confirmButtonText: 'Cerrar',
            });
        } else {
            Swal.fire({
                title: 'Historial de Compras',
                text: 'No tienes compras registradas aún.',
                icon: 'info',
                confirmButtonText: 'Cerrar',
            });
        }
    }
});

let cart = [];
let currentProduct = null;

function showProductDetails(product, price, image, description) {
    currentProduct = { product, price, image, description };
    document.getElementById('product-modal-title').textContent = product;
    document.getElementById('product-modal-image').src = image;
    document.getElementById('product-modal-description').textContent = description;
    document.getElementById('product-modal-price').textContent = `Precio: $${price.toFixed(2)}`;
    document.getElementById('product-modal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct.product, currentProduct.price);
        closeProductModal();
        Swal.fire({
            title: 'Producto agregado',
            text: `${currentProduct.product} ha sido agregado al carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
        });
    }
}

function addToCart(product, price) {
    if (!localStorage.getItem('userFirstName')) {
        window.location.href = 'Login1.Html';
        return;
    }
    cart.push({ product, price });
    updateCart();
    updateCartModal();
}

function updateCart() {
    document.getElementById('cart-count').textContent = cart.length;
}

function openCart() {
    document.getElementById('cart-modal').style.display = 'flex';
    updateCartModal();
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function updateCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <span>${item.product} - $${item.price}</span>
        `;
        cartItemsContainer.appendChild(div);
        total += item.price;
    });

    cartTotal.textContent = total.toFixed(2);
}

function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    if (!localStorage.getItem('userFirstName')) {
        window.location.href = 'Login1.Html';
        return;
    }

    let total = 0;
    cart.forEach(item => total += item.price);

    alert(`Total a pagar: $${total.toFixed(2)}`);
    cart = [];
    updateCart();
    closeCart();
    window.location.href = 'pagar.html';
}

document.getElementById('cart-icon').addEventListener('click', openCart);
