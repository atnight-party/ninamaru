/* ========================================
   になまる NightParty - Main JS
   ======================================== */

(function () {
  "use strict";

  /* ---------- Sparkle Effect ---------- */
  const canvas = document.getElementById("sparkle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const sparkles = [];
    const MAX_SPARKLES = 35;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Sparkle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.015 + 0.005;
        this.growing = Math.random() > 0.5;

        const colors = ["#FF1493", "#8B5CF6", "#00D4FF", "#ffffff"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speedY;

        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 1) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0) this.reset();
        }

        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 4;
        ctx.shadowColor = this.color;

        // Draw a 4-point star
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - s * 2);
        ctx.lineTo(this.x + s * 0.5, this.y - s * 0.5);
        ctx.lineTo(this.x + s * 2, this.y);
        ctx.lineTo(this.x + s * 0.5, this.y + s * 0.5);
        ctx.lineTo(this.x, this.y + s * 2);
        ctx.lineTo(this.x - s * 0.5, this.y + s * 0.5);
        ctx.lineTo(this.x - s * 2, this.y);
        ctx.lineTo(this.x - s * 0.5, this.y - s * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    for (let i = 0; i < MAX_SPARKLES; i++) {
      sparkles.push(new Sparkle());
    }

    function animateSparkles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparkles.forEach((s) => {
        s.update();
        s.draw();
      });
      requestAnimationFrame(animateSparkles);
    }

    animateSparkles();
  }

  /* ---------- Scroll Reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".info__card, .rule__item, .entry__lead, .entry__btn, .section__title"
  );

  revealTargets.forEach((el) => el.classList.add("js-reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Stagger animation for grid/list items ---------- */
  const staggerContainers = document.querySelectorAll(".info__grid, .rule__list");

  staggerContainers.forEach((container) => {
    const children = container.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  /* ---------- Accordion ---------- */
  const accordionTriggers = document.querySelectorAll(".accordion__trigger");

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const content = document.getElementById(
        trigger.getAttribute("aria-controls")
      );

      if (!content) return;

      trigger.setAttribute("aria-expanded", String(!expanded));

      if (expanded) {
        content.classList.remove("is-open");
        setTimeout(() => {
          content.hidden = true;
        }, 400);
      } else {
        content.hidden = false;
        // Force reflow for transition
        void content.offsetHeight;
        content.classList.add("is-open");
      }
    });
  });

  /* ---------- Smooth Scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
