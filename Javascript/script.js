document.addEventListener("DOMContentLoaded", function () {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
  const backToTopButton = document.querySelector(".back-to-top");
  const allNavLinks = document.querySelectorAll(
    '.nav-links a[href^="#"], .mobile-nav-links a[href^="#"]'
  );
  const resumeModal = document.getElementById("resume-modal");
  const resumeTriggers = document.querySelectorAll(".resume-trigger");
  const closeModalBtn = document.querySelector(".close-modal");
  const sections = document.querySelectorAll("section[id]");

  function toggleMobileMenu() {
    hamburgerMenu.classList.toggle("active");
    mobileNav.classList.toggle("active");
    document.body.style.overflow = mobileNav.classList.contains("active")
      ? "hidden"
      : "";
  }
  hamburgerMenu.addEventListener("click", toggleMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNav.classList.contains("active")) {
        toggleMobileMenu();
      }
    });
  });

  window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle("show", window.scrollY > 300);
  });

  const observerNav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          document
            .querySelectorAll(".nav-links a.active")
            .forEach((a) => a.classList.remove("active"));
          const newActiveLink = document.querySelector(
            `.nav-links a[href="#${id}"]`
          );
          if (newActiveLink) {
            newActiveLink.classList.add("active");
          }
        }
      });
    },
    { rootMargin: "-30% 0px -70% 0px" }
  );
  sections.forEach((section) => observerNav.observe(section));

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        lenis.scrollTo(href);
      }
    });
  });
  const resumeIframe = document.getElementById("resume-iframe");

  function openModal() {
    resumeModal.classList.add("show");
    document.body.style.overflow = "hidden";
    if (mobileNav.classList.contains("active")) {
      toggleMobileMenu();
    }

    if (!resumeIframe.src) {
      resumeIframe.contentWindow.document.body.innerHTML =
        '<p style="color: white; text-align: center; padding-top: 2rem;">Loading Resume...</p>';

      fetch("resume.pdf")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          resumeIframe.src = objectURL + "#toolbar=0&navpanes=0";
        })
        .catch((error) => {
          console.error("Error loading PDF:", error);
          resumeIframe.contentWindow.document.body.innerHTML =
            '<p style="color: #ff6b6b; text-align: center; padding-top: 2rem;">Failed to load resume. Please try downloading it instead.</p>';
        });
    }
  }
  function closeModal() {
    resumeModal.classList.remove("show");
    document.body.style.overflow = "";
  }
  resumeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });
  closeModalBtn.addEventListener("click", closeModal);
  resumeModal.addEventListener("click", (e) => {
    if (e.target === resumeModal) closeModal();
  });
  function initSwipers() {
    const projectSlider = new Swiper(".project-slider", {
      loop:
        document.querySelectorAll(".project-slider .swiper-slide").length > 3,
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: ".project-slider .swiper-button-next",
        prevEl: ".project-slider .swiper-button-prev",
      },
      breakpoints: {
        769: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
    const certificateSlider = new Swiper(".certificate-slider", {
      loop:
        document.querySelectorAll(".certificate-slider .swiper-slide").length >
        3,
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: ".certificate-slider .swiper-button-next",
        prevEl: ".certificate-slider .swiper-button-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }
  let slidersInitialized = false;

  const sliderObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting && !slidersInitialized) {
        console.log("Projects section is visible. Initializing sliders...");
        initSwipers();
        slidersInitialized = true;
        observer.unobserve(entries[0].target);
      }
    },
    {
      rootMargin: "0px 0px -300px 0px",
    }
  );

  sliderObserver.observe(document.querySelector("#projects"));
  const animatedElements = document.querySelectorAll(".fade-up");
  const scrollObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animatedElements.forEach((el) => scrollObserver.observe(el));

  const typingTextElement = document.getElementById("typing-text");
  const phrases = [
    "Engineering Student (EEE, AUST)",
    "Graphics Designer",
    "Web Developer",
    "Tech Enthusiast",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");
  const interactiveElements = document.querySelectorAll(
    'a, button, .hamburger-menu, .swiper-button-next, .swiper-button-prev, .close-modal, input[type="submit"], .cta-button'
  );

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate(
      { left: `${posX}px`, top: `${posY}px` },
      { duration: 500, fill: "forwards" }
    );
  });

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.classList.add("cursor-interactive");
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.classList.remove("cursor-interactive");
    });
  });
});
