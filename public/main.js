(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("quote-form");
  var formStatus = document.getElementById("form-status");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setHeaderScrolled() {
    if (!header) return;
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle("is-scrolled", y > 24);
  }

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      if (open) {
        mobileNav.setAttribute("hidden", "");
      } else {
        mobileNav.removeAttribute("hidden");
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        mobileNav.setAttribute("hidden", "");
      });
    });
  }

  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.textContent =
        "Thank you — your message is a demo preview. Connect this form to your email or CRM, or call (757) 968-3769.";
      form.reset();
    });
  }
})();
