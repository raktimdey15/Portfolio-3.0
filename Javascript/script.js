document.addEventListener("DOMContentLoaded", function () {
  let e = new Lenis({
    duration: 1.2,
    easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
  });
  function t(r) {
    e.raf(r), requestAnimationFrame(t);
  }
  requestAnimationFrame(t);
  let r = document.querySelector(".hamburger-menu"),
    i = document.querySelector(".mobile-nav"),
    s = document.querySelectorAll(".mobile-nav a"),
    n = document.querySelector(".back-to-top"),
    l = document.querySelectorAll(
      '.nav-links a[href^="#"], .mobile-nav-links a[href^="#"]'
    ),
    o = document.getElementById("resume-modal"),
    a = document.querySelectorAll(".resume-trigger"),
    c = document.querySelector(".close-modal"),
    d = document.querySelectorAll("section[id]");
  function u() {
    r.classList.toggle("active"),
      i.classList.toggle("active"),
      (document.body.style.overflow = i.classList.contains("active")
        ? "hidden"
        : "");
  }
  r.addEventListener("click", u),
    s.forEach((e) => {
      e.addEventListener("click", () => {
        i.classList.contains("active") && u();
      });
    }),
    window.addEventListener("scroll", () => {
      n.classList.toggle("show", window.scrollY > 300);
    });
  let p = new IntersectionObserver(
    (e) => {
      e.forEach((e) => {
        if (e.isIntersecting) {
          let t = e.target.getAttribute("id");
          document
            .querySelectorAll(".nav-links a.active")
            .forEach((e) => e.classList.remove("active"));
          let r = document.querySelector(`.nav-links a[href="#${t}"]`);
          r && r.classList.add("active");
        }
      });
    },
    { rootMargin: "-30% 0px -70% 0px" }
  );
  d.forEach((e) => p.observe(e)),
    l.forEach((t) => {
      t.addEventListener("click", (r) => {
        let i = t.getAttribute("href");
        i.startsWith("#") && (r.preventDefault(), e.scrollTo(i));
      });
    });
  let v = document.getElementById("resume-iframe");
  function g() {
    o.classList.remove("show"), (document.body.style.overflow = "");
  }
  a.forEach((e) => {
    e.addEventListener("click", (e) => {
      e.preventDefault(),
        o.classList.add("show"),
        (document.body.style.overflow = "hidden"),
        i.classList.contains("active") && u(),
        v.src ||
          ((v.contentWindow.document.body.innerHTML =
            '<p style="color: white; text-align: center; padding-top: 2rem;">Loading Resume...</p>'),
          fetch("resume.pdf")
            .then((e) => {
              if (!e.ok) throw Error("Network response was not ok");
              return e.blob();
            })
            .then((e) => {
              let t = URL.createObjectURL(e);
              v.src = t + "#toolbar=0&navpanes=0";
            })
            .catch((e) => {
              console.error("Error loading PDF:", e),
                (v.contentWindow.document.body.innerHTML =
                  '<p style="color: #ff6b6b; text-align: center; padding-top: 2rem;">Failed to load resume. Please try downloading it instead.</p>');
            }));
    });
  }),
    c.addEventListener("click", g),
    o.addEventListener("click", (e) => {
      e.target === o && g();
    });
  let $ = !1,
    b = new IntersectionObserver(
      (e, t) => {
        e[0].isIntersecting &&
          !$ &&
          (console.log("Projects section is visible. Initializing sliders..."),
          new Swiper(".project-slider", {
            loop:
              document.querySelectorAll(".project-slider .swiper-slide")
                .length > 3,
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
          }),
          new Swiper(".certificate-slider", {
            loop:
              document.querySelectorAll(".certificate-slider .swiper-slide")
                .length > 3,
            grabCursor: !0,
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
          }),
          ($ = !0),
          t.unobserve(e[0].target));
      },
      { rootMargin: "0px 0px -300px 0px" }
    );
  b.observe(document.querySelector("#projects"));
  let w = document.querySelectorAll(".fade-up"),
    f = new IntersectionObserver(
      (e, t) => {
        e.forEach((e) => {
          e.isIntersecting &&
            (e.target.classList.add("visible"), t.unobserve(e.target));
        });
      },
      { threshold: 0.1 }
    );
  w.forEach((e) => f.observe(e));
  let m = document.getElementById("typing-text"),
    h = [
      "Engineering Student (EEE, AUST)",
      "Graphics Designer",
      "Web Developer",
      "Tech Enthusiast",
    ],
    y = 0,
    E = 0,
    L = !1;
  !(function e() {
    let t = h[y];
    L
      ? ((m.textContent = t.substring(0, E - 1)), E--)
      : ((m.textContent = t.substring(0, E + 1)), E++);
    let r = L ? 50 : 100;
    L || E !== t.length
      ? L && 0 === E && ((L = !1), (y = (y + 1) % h.length), (r = 500))
      : ((r = 2e3), (L = !0)),
      setTimeout(e, r);
  })();
  let x = document.getElementById("cursor-dot"),
    S = document.getElementById("cursor-outline"),
    _ = document.querySelectorAll(
      'a, button, .hamburger-menu, .swiper-button-next, .swiper-button-prev, .close-modal, input[type="submit"], .cta-button'
    );
  window.addEventListener("mousemove", (e) => {
    let t = e.clientX,
      r = e.clientY;
    (x.style.left = `${t}px`),
      (x.style.top = `${r}px`),
      S.animate(
        { left: `${t}px`, top: `${r}px` },
        { duration: 500, fill: "forwards" }
      );
  }),
    _.forEach((e) => {
      e.addEventListener("mouseenter", () => {
        S.classList.add("cursor-interactive");
      }),
        e.addEventListener("mouseleave", () => {
          S.classList.remove("cursor-interactive");
        });
    });
});
