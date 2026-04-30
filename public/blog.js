(function () {
  "use strict";

  var POSTS_KEY = "as_blog_posts";
  var VISITOR_LIKES_KEY = "as_visitor_post_likes";
  var READ_KEY = "as_post_reads_session";

  function seedPosts() {
    if (localStorage.getItem(POSTS_KEY)) return;
    var now = new Date().toISOString();
    var posts = [
      {
        id: "p1",
        title: "When should you review your beneficiary designations?",
        excerpt:
          "Life changes fast in Chesapeake—marriages, births, and new homes all affect who should receive policy proceeds. A quick review now prevents confusion later.",
        body:
          "Most people set beneficiaries once and forget them. Virginia law and carrier rules can both affect how proceeds are paid. Schedule an annual check-in: confirm primary and contingent names, percentages, and whether minors need a trust. If you have divorced or lost a loved one listed as beneficiary, update immediately. We help clients document intent clearly so the claim process stays smooth for the family left behind.",
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
          "An indexed annuity links growth to an external index while protecting principal from market loss—subject to contract terms. We walk through hypothetical scenarios using your actual retirement date, other income sources, and risk tolerance. You will see side-by-side illustrations before any paperwork. Questions are welcome in plain language; that is the standard we hold carriers to as well.",
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
          "List every obligation you want insured: mortgage balance years remaining, education estimates, final expenses, and business buy-sell triggers. Compare term length to those timelines. If you need lifelong protection, estate liquidity, or tax-advantaged accumulation, explore permanent designs. We never recommend a product until the checklist shows why it fits your Chesapeake household or practice.",
        scheduledAt: "",
        likes: 0,
        reads: 0,
        createdAt: now,
      },
    ];
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

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

  function getVisitorLikes() {
    try {
      return JSON.parse(localStorage.getItem(VISITOR_LIKES_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function addVisitorLike(id) {
    var arr = getVisitorLikes();
    if (arr.indexOf(id) !== -1) return false;
    arr.push(id);
    localStorage.setItem(VISITOR_LIKES_KEY, JSON.stringify(arr));
    return true;
  }

  function visitorLiked(id) {
    return getVisitorLikes().indexOf(id) !== -1;
  }

  function getReadSession() {
    try {
      return JSON.parse(sessionStorage.getItem(READ_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function markReadCounted(id) {
    var arr = getReadSession();
    if (arr.indexOf(id) !== -1) return false;
    arr.push(id);
    sessionStorage.setItem(READ_KEY, JSON.stringify(arr));
    return true;
  }

  function bumpReads(id) {
    if (!markReadCounted(id)) return;
    var posts = getPosts();
    var i;
    for (i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        posts[i].reads = (posts[i].reads || 0) + 1;
        break;
      }
    }
    savePosts(posts);
  }

  function bumpLikes(id) {
    if (!addVisitorLike(id)) return;
    var posts = getPosts();
    var i;
    for (i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        posts[i].likes = (posts[i].likes || 0) + 1;
        break;
      }
    }
    savePosts(posts);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render() {
    var list = document.getElementById("blog-list");
    if (!list) return;
    var posts = getPosts();
    list.innerHTML = posts
      .map(function (p) {
        var liked = visitorLiked(p.id);
        return (
          '<article class="blog-card" data-post-id="' +
          escapeHtml(p.id) +
          '" tabindex="0">' +
          '<div class="blog-card__body">' +
          '<span class="blog-card__meta">Insights · Chesapeake, VA</span>' +
          "<h2>" +
          escapeHtml(p.title) +
          "</h2>" +
          '<p class="blog-card__selectable">' +
          escapeHtml(p.excerpt) +
          "</p>" +
          '<p class="blog-card__hint">Select text in the preview above (drag across a sentence) to expand the full article. The heart unlocks after you expand.</p>' +
          '<div class="blog-card__full">' +
          escapeHtml(p.body).replace(/\n/g, "<br>") +
          "</div>" +
          "</div>" +
          '<div class="blog-card__actions">' +
          '<button type="button" class="heart-btn' +
          (liked ? " is-liked" : "") +
          '" data-heart-for="' +
          escapeHtml(p.id) +
          '" aria-pressed="' +
          (liked ? "true" : "false") +
          '" aria-disabled="' +
          (liked ? "false" : "true") +
          '" aria-label="Like this article (available after you expand the post)">' +
          '<svg class="heart-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '<svg class="heart-fill" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' +
          "</button>" +
          '<span class="heart-count">' +
          (p.likes || 0) +
          " likes</span>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    list.querySelectorAll(".heart-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-heart-for");
        if (!id || btn.getAttribute("aria-disabled") === "true" || btn.classList.contains("is-liked")) return;
        bumpLikes(id);
        btn.classList.add("is-liked");
        btn.setAttribute("aria-pressed", "true");
        var n = getPosts().filter(function (x) {
          return x.id === id;
        })[0];
        var countEl = btn.closest(".blog-card__actions").querySelector(".heart-count");
        if (countEl && n) countEl.textContent = (n.likes || 0) + " likes";
      });
    });
  }

  function selectionExpands() {
    var sel = document.getSelection();
    if (!sel || !sel.rangeCount) return;
    var text = sel.toString().trim();
    if (text.length < 18) return;
    var node = sel.anchorNode;
    if (!node) return;
    var el = node.nodeType === 1 ? node : node.parentElement;
    if (!el) return;
    var selectable = el.closest && el.closest(".blog-card__selectable");
    if (!selectable) return;
    var card = selectable.closest(".blog-card");
    if (!card || card.classList.contains("is-expanded")) return;
    card.classList.add("is-expanded");
    var id = card.getAttribute("data-post-id");
    if (id) bumpReads(id);
    var hb = card.querySelector(".heart-btn");
    if (hb && !hb.classList.contains("is-liked")) {
      hb.setAttribute("aria-disabled", "false");
    }
  }

  document.addEventListener("mouseup", function () {
    requestAnimationFrame(selectionExpands);
  });

  seedPosts();
  render();
})();
