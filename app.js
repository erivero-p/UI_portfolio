import { init2048events } from "./2048/2048.js";

// Load the 2048 game
fetch('2048/2048.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('2048-game').innerHTML = html;
        init2048events();
    })
    .catch(error => {
        console.error('Error loading 2048 game:', error);
    });

document.addEventListener("DOMContentLoaded", () => {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
    
    // Animate elements on scroll
    function animateOnScroll() {
        var elements = document.querySelectorAll(".animate-fade-in, .animate-slide-up")
        elements.forEach((element) => {
        if (isElementInViewport(element)) {
            element.style.animationPlayState = "running"
        }
        })
    }
    
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect()
        return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    }
    
    window.addEventListener("scroll", animateOnScroll)
    animateOnScroll() // Run once on load
    })
    
    