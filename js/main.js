// ==================== МОДАЛЬНОЕ ОКНО ЗАЯВКИ ====================
// Работает только на страницах, где есть #order-dialog
// (index.html, order.html)

const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
    const orderButtons = document.querySelectorAll('[data-product]');
    const closeDialogButton = document.getElementById('close-order-dialog');
    const selectedProductInput = document.getElementById('selected-product');

    orderButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productName = button.dataset.product;
            selectedProductInput.value = productName;
            orderDialog.showModal();
        });
    });

    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', () => {
            orderDialog.close();
        });
    }
}

// ==================== ОБРАБОТКА ФОРМЫ ЗАЯВКИ ====================
// Работает только на страницах, где есть #order-form

const orderForm = document.getElementById('order-form');

if (orderForm) {
    const successMessage = document.getElementById('success-message');

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formElements = Array.from(orderForm.elements);

        formElements.forEach((element) => {
            if (element.willValidate) {
                element.removeAttribute('aria-invalid');
            }
        });

        if (!orderForm.checkValidity()) {
            formElements.forEach((element) => {
                if (element.willValidate && !element.checkValidity()) {
                    element.setAttribute('aria-invalid', 'true');
                }
            });

            orderForm.reportValidity();
            return;
        }

        if (successMessage) {
            successMessage.hidden = false;
        }

        orderForm.reset();

        if (orderDialog) {
            orderDialog.close();
        }
    });
}



// ==================== ТЕЛЕФОН ====================
// Автоматически форматирует ввод в +7 (900) 123-45-67

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach((input) => {
    input.addEventListener('input', () => {
        // Оставляем только цифры
        let digits = input.value.replace(/\D/g, '');

        // Если пусто — очищаем поле
        if (digits.length === 0) {
            input.value = '';
            return;
        }

        // Если начинается с 8 — заменяем на 7
        if (digits.startsWith('8')) {
            digits = '7' + digits.slice(1);
        }

        // Если начинается не с 7 — добавляем 7 в начало
        if (!digits.startsWith('7')) {
            digits = '7' + digits;
        }

        // Ограничиваем 11 цифрами (7 + 10)
        digits = digits.slice(0, 11);

        // Формируем строку
        let formatted = '+7';

        if (digits.length > 1) {
            formatted += ' (' + digits.slice(1, 4);
        }
        if (digits.length >= 5) {
            formatted += ') ' + digits.slice(4, 7);
        }
        if (digits.length >= 8) {
            formatted += '-' + digits.slice(7, 9);
        }
        if (digits.length >= 10) {
            formatted += '-' + digits.slice(9, 11);
        }

        input.value = formatted;
    });

    // При вставке из буфера — тоже форматируем
    input.addEventListener('paste', (event) => {
        event.preventDefault();
        const pasted = (event.clipboardData || window.clipboardData).getData('text');
        const digits = pasted.replace(/\D/g, '');
        input.value = digits;
        input.dispatchEvent(new Event('input'));
    });
});
