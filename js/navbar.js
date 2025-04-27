// Thêm vào đầu file navbar.js
console.log("Navbar script loaded!");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded!");
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log("Hamburger:", hamburger);
    console.log("Nav Menu:", navMenu);
    
    // Rest of your code...
});
// js để điều khiển navbar responsive
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle menu khi click vào hamburger
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Đóng menu khi click vào link
    document.querySelectorAll('.nav-menu li a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});