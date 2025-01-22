import { init2048events } from "./2048/2048.js"

// Load the 2048 game
fetch("2048/2048.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("2048-game").innerHTML = html
    init2048events()
  })
  .catch((error) => {
    console.error("Error loading 2048 game:", error)
  })

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

// Language toggle functionality
const languageToggle = document.querySelector(".language-toggle")
const languageBtns = document.querySelectorAll(".language-btn")
let currentLanguage = "en"

const translations = {
  en: {
    greeting: "Hi! I'm erivero-p",
    intro:
      "I'm Elisa, a 42 student based in Malaga, Spain. Currently, I'm finishing the Common Core and specializing in web development.",
    skills: "Skills I'm working on:",
    currentlyWorking: "Currently working on",
    transcendenceDescription: "\'ft_transcendence\' is a multiplayer web-based single page application developed as the final project of the 42 Common Core. It combines a real-time gaming experience with social features, including user authentication, game invitations, and customizable profiles. It is a group project, and I'm in charge of the UX/UI design and front-end development, which is required to be implemented in vanilla JavaScript.",
    recentProjects: "Recent Projects",
    contact: "contact:",
    tooltipTitle: "The FullStack Piscine is a two weeks pedagogical project based course, in collaboration with Globant, aimed at learning the basics of web development technologies such as React."
  },
  es: {
    greeting: "¡Hola! Soy erivero-p",
    intro:
      "Soy Elisa, una estudiante de 42 en Málaga, España. Actualmente, estoy terminando el Common Core y especializándome en desarrollo web.",
    skills: "Habilidades en las que estoy trabajando:",
    currentlyWorking: "Trabajando actualmente en",
    transcendenceDescription: "«ft_transcendence» es una aplicación web multijugador single page desarrollada como proyecto final del common core de 42. Combina una experiencia de juego online, con features sociales incluyendo la autenticación, torneos y personalización de perfiles. Es un proyecto en grupo y yo estoy a cargo del diseño UX/UI y el desarrollo front-end. Éste debe implementarse en JavaScript Vanilla.",
    recentProjects: "Proyectos recientes",
    contact: "contacto:",
    tooltipTitle: "Se trata de una piscina pedagógica de 42 (aprendizaje basado en proyectos y entre pares), en colaboración con Globant, destinada a aprender los conceptos básicos de las tecnologías de desarrollo web utilizadas en el mercado actual, tales como React."

  },
}

function updateLanguage() {
  const elements = {
    greeting: document.querySelector('[data-translate-key="greeting"]'),
    intro: document.querySelector('[data-translate-key="intro"]'),
    transcendenceDescription: document.querySelector('[data-translate-key="transcendence-description"]'),
//    skills: document.querySelector(".skills h3"),
//    currentlyWorking: document.querySelector("section:nth-of-type(1) h2"),
//    recentProjects: document.querySelector("section:nth-of-type(2) h2"),
  }

  for (const [key, element] of Object.entries(elements)) {
    if (element) {
      element.textContent = translations[currentLanguage][key]
    }
  }

  const tooltipElement = document.querySelector('[data-translate-key="tooltipTitle"]');
  if (tooltipElement) {
    tooltipElement.setAttribute('title', translations[currentLanguage].tooltipTitle);
    // Reinitialize the tooltip to apply the new title
    const tooltip = new bootstrap.Tooltip(tooltipElement);
    tooltip.dispose();
    new bootstrap.Tooltip(tooltipElement);
  }
}

languageBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentLanguage = btn.dataset.lang
    languageToggle.dataset.active = currentLanguage
    updateLanguage()
  })
})

// Initial language update
updateLanguage()

