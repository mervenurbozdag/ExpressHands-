// Kullanıcı veritabanı (simüle edilmiş basit bir array)
const users = [
    { username: "admin", password: "12345" } // Varsayılan kullanıcı
];

// HTML elemanlarını seç
const loginForm = document.getElementById('login-form');
const agreementCheckbox = document.getElementById('agreement');
const loginButton = document.getElementById('login-button');

// Onay kutusunu izleyerek butonun durumunu güncelle
agreementCheckbox.addEventListener('change', () => {
    loginButton.disabled = !agreementCheckbox.checked;
});

// Giriş formunu işle
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Basit kullanıcı doğrulama
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        alert("Giriş başarılı!");
        window.location.href = "dashboard.html"; // Dashboard sayfasına yönlendirme
    } else {
        alert("Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.");
    }
});

// İşaret dilini metne çevir butonu yönlendirmesi
// dashboard.html yönlendirme
document.getElementById('translate-button').addEventListener('click', function() {
    window.location.href = 'translate.html';
});


// Kaydırmalı resimlerin kontrolü
let currentIndex = 0;

function showSlide() {
    const slides = document.querySelectorAll('.slider img');
    slides.forEach((slide, index) => {
        slide.style.opacity = (index === currentIndex) ? '1' : '0';
    });

    currentIndex = (currentIndex + 1) % slides.length;
}

// Sayfa yüklendiğinde kaydırma başlasın
window.onload = () => {
    setInterval(showSlide, 3000); // Her 3 saniyede bir resim değişir
};
