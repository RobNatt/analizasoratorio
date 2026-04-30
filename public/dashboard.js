(function () {
  "use strict";

  if (!window.ASAuth || !window.ASAuth.requireDashboard()) return;

  var POSTS_KEY = "as_blog_posts";
  var VISITS_KEY = "as_site_visits";

  function ensurePosts() {
    if (localStorage.getItem(POSTS_KEY)) return;
    var now = new Date().toISOString();
    localStorage.setItem(
      POSTS_KEY,
      JSON.stringify([
        {
          id: "p1",
          title: "When should you review your beneficiary designations?",
          excerpt:
            "Life changes fast in Chesapeake—marriages, births, and new homes all affect who should receive policy proceeds. A quick review now prevents confusion later.",
          body:
            "Most people set beneficiaries once and forget them. Virginia law and carrier rules can both affect how proceeds are paid. Schedule an annual check-in: confirm primary and contingent names, percentages, and whether minors need a trust.",
          scheduledAt: "",
          likes: 0,
          reads: 0,
          createdAt: now,
        },
        {
          id: "p2",
          title: "Indexed annuities without the jargon",
          excerpt:
            "Caps, participation rates, and floors sound intimidating. Here is how we map each feature to your income goal—so you can decide with confidence, not confusion.",
          body:
            "An indexed annuity links growth to an external index while protecting principal from market loss—subject to contract terms. We walk through hypothetical scenarios using your actual retirement date.",
          scheduledAt: "",
          likes: 0,
          reads: 0,
          createdAt: now,
        },
        {
          id: "p3",
          title: "Term vs. permanent life: a Hampton Roads checklist",
          excerpt:
            "Mortgages, business loans, and growing families often point to term coverage first—but permanent policies can build cash value for long-range goals. Start with this checklist.",
          body:
            "List every obligation you want insured: mortgage balance years remaining, education estimates, final expenses, and business buy-sell triggers. Compare term length to those timelines.",
          scheduledAt: "",
          likes: 0,
          reads: 0,
          createdAt: now,
        },
      ])
    );
  }

  ensurePosts();

  var session = window.ASAuth.getSession();
  document.getElementById("dash-email").textContent = session.email || "";

  function getPosts() {
    try {
      return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  function getVisits() {
    try {
      return JSON.parse(localStorage.getItem(VISITS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatSchedule(iso) {
    if (!iso) return "—";
    try {
      var d = new Date(iso);
      return isNaN(d.getTime()) ? "—" : d.toLocaleString();
    } catch (e) {
      return "—";
    }
  }

  function renderPosts() {
    var tbody = document.getElementById("posts-tbody");
    var posts = getPosts();
    tbody.innerHTML = posts
      .map(function (p) {
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(p.title) +
          "</strong></td>" +
          "<td>" +
          escapeHtml(formatSchedule(p.scheduledAt)) +
          "</td>" +
          "<td>" +
          (p.reads || 0) +
          "</td>" +
          "<td>" +
          (p.likes || 0) +
          "</td>" +
          '<td><div class="dash-actions">' +
          '<button type="button" data-edit="' +
          escapeHtml(p.id) +
          '">Edit</button>' +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");

    tbody.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-edit"));
      });
    });
  }

  function renderAnalytics() {
    var el = document.getElementById("analytics-stats");
    var map = getVisits();
    var keys = Object.keys(map).sort();
    if (!keys.length) {
      el.innerHTML =
        '<p class="stat-pill"><span>No visits recorded yet. Open Home, About, or Blog in this browser to populate counts.</span></p>';
      return;
    }
    el.innerHTML = keys
      .map(function (k) {
        return (
          '<div class="stat-pill"><strong>' +
          map[k] +
          '</strong><span>' +
          escapeHtml(k) +
          "</span></div>"
        );
      })
      .join("");
  }

  var modal = document.getElementById("edit-modal");
  var form = document.getElementById("edit-form");

  function openModal(id) {
    var posts = getPosts();
    var p = posts.filter(function (x) {
      return x.id === id;
    })[0];
    if (!p) return;
    document.getElementById("edit-id").value = p.id;
    document.getElementById("edit-title").value = p.title;
    document.getElementById("edit-excerpt").value = p.excerpt;
    document.getElementById("edit-body").value = p.body;
    var sched = document.getElementById("edit-scheduled");
    if (p.scheduledAt) {
      var d = new Date(p.scheduledAt);
      if (!isNaN(d.getTime())) {
        var pad = function (n) {
          return n < 10 ? "0" + n : String(n);
        };
        sched.value =
          d.getFullYear() +
          "-" +
          pad(d.getMonth() + 1) +
          "-" +
          pad(d.getDate()) +
          "T" +
          pad(d.getHours()) +
          ":" +
          pad(d.getMinutes());
      } else {
        sched.value = "";
      }
    } else {
      sched.value = "";
    }
    modal.removeAttribute("hidden");
    document.getElementById("edit-title").focus();
  }

  function closeModal() {
    modal.setAttribute("hidden", "");
  }

  document.getElementById("edit-cancel").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) closeModal();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("edit-id").value;
    var posts = getPosts();
    var i;
    for (i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        posts[i].title = document.getElementById("edit-title").value.trim();
        posts[i].excerpt = document.getElementById("edit-excerpt").value.trim();
        posts[i].body = document.getElementById("edit-body").value.trim();
        var v = document.getElementById("edit-scheduled").value;
        posts[i].scheduledAt = v ? new Date(v).toISOString() : "";
        break;
      }
    }
    savePosts(posts);
    closeModal();
    renderPosts();
  });

  document.getElementById("logout-btn").addEventListener("click", function () {
    window.ASAuth.logout();
    window.location.href = "login.html";
  });

  renderPosts();
  renderAnalytics();
})();
