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

  function wireLeadForm(formId, statusId, sourceTag) {
    var form = document.getElementById(formId);
    var formStatus = document.getElementById(statusId);
    if (!form || !formStatus) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint =
        typeof window.LEAD_FORM_ENDPOINT === "string" ? window.LEAD_FORM_ENDPOINT.trim() : "";
      var fd = new FormData(form);
      if (sourceTag) fd.set("form_source", sourceTag);

      var phone = "(757) 968-3769";

      /** FormSubmit /ajax/ expects JSON; Formspree accepts multipart FormData. */
      function isJsonFormEndpoint(url) {
        return /formsubmit\.co\/ajax\//i.test(url);
      }

      function formDataToPayload(fd) {
        var payload = {};
        fd.forEach(function (value, key) {
          if (key === "_gotcha") return;
          if (value !== null && value !== "") payload[key] = value;
        });
        return payload;
      }

      function thanksNoEmail() {
        formStatus.textContent =
          "Thank you. Please call " +
          phone +
          " so we can connect right away while email delivery is being finalized on this site.";
        form.reset();
      }

      function thanksOk() {
        formStatus.textContent =
          "Thank you—your message was sent. We’ll reply shortly. Questions? Call " + phone + ".";
        form.reset();
      }

      function thanksError() {
        formStatus.textContent =
          "We couldn’t send that just now. Please call " + phone + " or try again in a few minutes.";
      }

      if (!endpoint) {
        thanksNoEmail();
        return;
      }

      var gotcha = fd.get("_gotcha");
      if (gotcha && String(gotcha).trim() !== "") {
        form.reset();
        return;
      }

      formStatus.textContent = "Sending…";

      var reqInit;
      if (isJsonFormEndpoint(endpoint)) {
        var payload = formDataToPayload(fd);
        if (sourceTag) payload.form_source = sourceTag;
        reqInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        };
      } else {
        reqInit = {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        };
      }

      fetch(endpoint, reqInit)
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          return res.json().catch(function () {
            return {};
          });
        })
        .then(function () {
          thanksOk();
        })
        .catch(function () {
          thanksError();
        });
    });
  }

  wireLeadForm("quote-form", "form-status", "home_contact");
  wireLeadForm("about-quote-form", "about-form-status", "whole_life_insurance");
})();
