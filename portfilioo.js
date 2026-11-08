
/* ==============================
   MOBILE NAVIGATION
============================== */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
    menuToggle.classList.remove("open");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();

        navItems.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

document.addEventListener("click", (event) => {
    if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMenu();
    }
});

/* ==============================
   PROJECTS INFINITE SLIDER
============================== */

const sliderViewport = document.getElementById("sliderViewport");
const projectsTrack = document.getElementById("projectsTrack");
const projectCards = Array.from(
    projectsTrack.querySelectorAll(".project-card")
);

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const sliderDots = document.getElementById("sliderDots");

let currentIndex = 0;
let visibleCards = 3;
let slideStep = 0;
let maxIndex = 0;

function updateSliderSettings() {
    if (!projectCards.length) return;

    const gap = parseFloat(getComputedStyle(projectsTrack).gap) || 0;
    const cardWidth = projectCards[0].getBoundingClientRect().width;

    if (window.innerWidth <= 760) {
        visibleCards = 1;
    } else if (window.innerWidth <= 1050) {
        visibleCards = 2;
    } else {
        visibleCards = 3;
    }

    slideStep = cardWidth + gap;
    maxIndex = Math.max(0, projectCards.length - visibleCards);

    currentIndex = Math.min(currentIndex, maxIndex);

    renderDots();
    updateSlider();
}

function renderDots() {
    sliderDots.innerHTML = "";

    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", `Show project group ${i + 1}`);

        dot.addEventListener("click", () => {
            currentIndex = i;
            updateSlider();
        });

        sliderDots.appendChild(dot);
    }
}

function updateSlider() {
    projectsTrack.style.transform =
        `translateX(${-currentIndex * slideStep}px)`;

    // Infinite loop: never disable the arrows.
    prevBtn.disabled = false;
    nextBtn.disabled = false;

    const dots = sliderDots.querySelectorAll(".slider-dot");

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
        dot.setAttribute(
            "aria-current",
            index === currentIndex ? "true" : "false"
        );
    });
}

function nextSlide() {
    if (maxIndex === 0) return;

    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
}

function prevSlide() {
    if (maxIndex === 0) return;

    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateSlider();
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

// Swipe support on mobile.
let touchStartX = 0;
let touchEndX = 0;

sliderViewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

sliderViewport.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;

    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) < 40) return;

    if (difference > 0) {
        nextSlide();
    } else {
        prevSlide();
    }
}, { passive: true });

// Recalculate after resizing.
let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        updateSliderSettings();
    }, 100);
});

window.addEventListener("load", updateSliderSettings);

/* ==============================
   ACTIVE NAVIGATION ON SCROLL
============================== */

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navItems.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${entry.target.id}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}

/* ==============================
   FOOTER YEAR
============================== */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

/* ==============================
   SCROLL REVEAL ANIMATION
============================== */

const revealElements = document.querySelectorAll(
    ".section-heading, .about-text, .feature-card, " +
    ".project-card, .skill-card, .service-card, .contact-box"
);

revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    if (
        element.classList.contains("feature-card") ||
        element.classList.contains("skill-card") ||
        element.classList.contains("service-card")
    ) {
        element.classList.add(`reveal-delay-${(index % 3) + 1}`);
    }
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("revealed");
    });
}
