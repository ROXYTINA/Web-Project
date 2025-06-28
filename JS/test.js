document.addEventListener('DOMContentLoaded', function () {
    const chooseBuyer = document.getElementById('choose-buyer');
    const chooseSeller = document.getElementById('choose-seller');
    const chooseCategory = document.getElementById('choose-category');
    const buyerFormPanel = document.getElementById('buyer-form-panel');
    const buyerInfoForm = document.getElementById('buyer-info-form');

    if (chooseBuyer) {
        chooseBuyer.addEventListener('click', function () {
            chooseCategory.classList.add('hidden');
            buyerFormPanel.classList.remove('hidden');
        });
    }
    if (chooseSeller) {
        chooseSeller.addEventListener('click', function () {
            window.location.href = "seller-panel.html";
        });
    }
    if (buyerInfoForm) {
        buyerInfoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Save user info to localStorage
            const name = document.getElementById('buyer-name').value;
            const email = document.getElementById('buyer-email').value;
            const phone = document.getElementById('buyer-phone').value;
            localStorage.setItem('customerInfo', JSON.stringify({ name, email, phone }));
            window.location.href = "customer-panel.html";
        });
    }
});
