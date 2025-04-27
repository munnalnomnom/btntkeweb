document.addEventListener('DOMContentLoaded', function() {

    const cartItemsContainer = document.querySelector('.cart-table tbody');
    const cartHasItems = document.getElementById('cart-has-items');
    const emptyCart = document.getElementById('empty-cart');
    const clearCartBtn = document.querySelector('.clear-cart');
    const subtotalDisplay = document.getElementById('subtotal-value');
    const discountDisplay = document.getElementById('discount-value');
    const shippingDisplay = document.getElementById('shipping-value');
    const totalDisplay = document.getElementById('total-value');
    const promoInput = document.getElementById('promo-code-input');
    const applyPromoBtn = document.getElementById('apply-promo');
    const checkoutBtn = document.getElementById('checkout-button');

    let currentDiscount = 0;

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }

    function parseCurrency(str) {

        if (!str) return 0;
        return parseInt(str.replace(/\D/g, '')) || 0;
    }


    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }


    function fixImagePath(imagePath) {
        if (!imagePath) {
            console.log('Không có đường dẫn ảnh');
            return '/image/placeholder.webp'; 
        }
        
        if (imagePath.startsWith('//')) {
            const fixedPath = imagePath.replace('//', '/');
            return fixedPath;
        }
        
        return imagePath;
    }

    function renderCart() {
        const cart = getCart();
        

        if (cart.length === 0) {
            if (cartHasItems) cartHasItems.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }
        
        if (cartHasItems) cartHasItems.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
        

        if (!cartItemsContainer) {
            console.error('Không tìm thấy phần tử cartItemsContainer');
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((product, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', product.id);
            

            const imagePath = fixImagePath(product.image);
            
            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <img src="${imagePath}" alt="${product.name}" class="product-image" onerror="this.src='/image/placeholder.webp'; this.onerror=null;">
                        <div class="product-details">
                            <h4>${product.name || 'Sản phẩm không tên'}</h4>
                            <p>${product.description || ''}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="product-price">${formatCurrency(product.price)}</span>
                </td>
                <td>
                    <div class="quantity-control">
                        <button class="decrease-btn">-</button>
                        <input type="number" min="1" value="${product.quantity}" class="quantity-input">
                        <button class="increase-btn">+</button>
                    </div>
                </td>
                <td>
                    <span class="product-total">${formatCurrency(product.price * product.quantity)}</span>
                </td>
                <td>
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            
            cartItemsContainer.appendChild(row);
        });
        

        addEventListeners();
        

        updateTotal();
    }

    function addEventListeners() {

        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const productId = this.closest('tr').getAttribute('data-id');
                updateQuantity(productId, parseInt(input.value) + 1);
            });
        });
        

        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.nextElementSibling;
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    const productId = this.closest('tr').getAttribute('data-id');
                    updateQuantity(productId, currentValue - 1);
                }
            });
        });
        

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                let value = parseInt(this.value);
                if (value < 1 || isNaN(value)) {
                    value = 1;
                    this.value = 1;
                }
                const productId = this.closest('tr').getAttribute('data-id');
                updateQuantity(productId, value);
            });
        });
        

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeProduct(index);
            });
        });
    }


    function updateQuantity(productId, newQuantity) {
        const cart = getCart();
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
            cart[productIndex].quantity = newQuantity;
            saveCart(cart);
            renderCart();
        }
    }


    function removeProduct(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
    }


    function calculateSubtotal() {
        const cart = getCart();
        let subtotal = 0;
        
        cart.forEach(product => {
            subtotal += product.price * product.quantity;
        });
        
        return subtotal;
    }


    function updateTotal() {

        const subtotal = calculateSubtotal();
        

        console.log('Tạm tính:', subtotal);
        

        if (subtotalDisplay) {
            subtotalDisplay.textContent = formatCurrency(subtotal);
        } else {
            console.warn('Không tìm thấy phần tử subtotalDisplay');
        }
        

        let shipping = 30000; 
        if (shippingDisplay) {
            shipping = parseCurrency(shippingDisplay.textContent);
        }
        

        if (discountDisplay) {
            discountDisplay.textContent = formatCurrency(currentDiscount);
        }
        

        const total = subtotal + shipping - currentDiscount;
        

        console.log('Phí vận chuyển:', shipping);
        console.log('Giảm giá:', currentDiscount);
        console.log('Tổng cộng:', total);
        

        if (totalDisplay) {
            totalDisplay.textContent = formatCurrency(total);
        } else {
            console.warn('Không tìm thấy phần tử totalDisplay');
        }
    }


    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            const confirmClear = confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?');
            if (confirmClear) {
                localStorage.removeItem('cart');

                currentDiscount = 0;
                renderCart();
            }
        });
    }

    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            if (!promoInput) return;
            
            const promoCode = promoInput.value.trim();
            
            if (promoCode === 'HEXON10') {

                const subtotal = calculateSubtotal();
                

                currentDiscount = Math.round(subtotal * 0.1);
                

                updateTotal();
                alert('Đã áp dụng mã giảm giá HEXON10 thành công!');
            } else if (promoCode) {
                alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
            }
        });
    }


    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }
            
            alert('Đang chuyển hướng đến trang thanh toán...');

        });
    }

    renderCart();
});