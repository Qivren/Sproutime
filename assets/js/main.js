/* ==========================================================================
   Sproutime — site behaviour
   No dependencies, no network calls, no tracking.
   ========================================================================== */

/*
 * EDIT THESE THREE VALUES BEFORE PUBLISHING.
 *
 * PLAY_STORE_URL   Full Google Play listing URL, for example:
 *                  "https://play.google.com/store/apps/details?id=com.sproutime.app"
 *                  Leave empty to keep the honest "coming soon" button.
 *
 * CONTACT_EMAIL    A monitored support address, for example:
 *                  "hello@sproutime.app"
 *                  This must match the contact address in Play Console.
 *
 * EFFECTIVE_DATE   The date the privacy policy takes effect, for example:
 *                  "4 November 2026"
 */
const SITE_CONFIG = {
  PLAY_STORE_URL: "",
  CONTACT_EMAIL: "qivren89@gmail.com",
  EFFECTIVE_DATE: "5 November 2026",
  DEVELOPER_NAME: "Qivren"
};

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---- Config placeholders ---------------------------------------------- */
  const playUrl = SITE_CONFIG.PLAY_STORE_URL.trim();
  const email = SITE_CONFIG.CONTACT_EMAIL.trim();
  const effectiveDate = SITE_CONFIG.EFFECTIVE_DATE.trim();
  const developer = SITE_CONFIG.DEVELOPER_NAME.trim();

  if (playUrl) {
    document.querySelectorAll("[data-play-link]").forEach(function (link) {
      link.href = playUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-describedby");
      const label = link.querySelector(".play-title");
      if (label && !link.hasAttribute("data-play-custom-label")) {
        label.textContent = "Google Play";
      }
    });

    const note = document.getElementById("play-store-note");
    if (note) {
      note.textContent =
        "Free to download on Google Play. Optional plans are purchased inside the app.";
      note.removeAttribute("aria-describedby");
    }
  } else {
    // No store URL yet — keep the button visual but don't scroll to an anchor.
    document.querySelectorAll("[data-play-link]").forEach(function (link) {
      link.href = "#";
      link.removeAttribute("aria-describedby");
      link.addEventListener("click", function (e) {
        e.preventDefault();
      });
    });
    const note = document.getElementById("play-store-note");
    if (note) {
      note.setAttribute("aria-describedby", "play-store-note");
    }
  }

  if (email) {
    document.querySelectorAll("[data-contact-email]").forEach(function (node) {
      node.textContent = email;
      if (node.tagName === "A") {
        node.href = "mailto:" + email;
        node.removeAttribute("aria-disabled");
      }
      node.classList.remove("placeholder");
    });
  } else {
    // An unconfigured mailto: link would open an empty draft, so make the
    // placeholder text inert until a real address is supplied above.
    document.querySelectorAll("a[data-contact-email]").forEach(function (node) {
      node.removeAttribute("href");
    });
  }

  if (effectiveDate) {
    document.querySelectorAll("[data-effective-date]").forEach(function (node) {
      node.textContent = effectiveDate;
      node.classList.remove("placeholder");
    });
  }

  if (developer) {
    document.querySelectorAll("[data-developer-name]").forEach(function (node) {
      node.textContent = developer;
      node.classList.remove("placeholder");
    });
  }

  /* ---- Header state ------------------------------------------------------ */
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile navigation ------------------------------------------------- */
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("site-nav");

  if (toggle && nav) {
    const setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        document.body.classList.contains("nav-open") &&
        !event.target.closest("#site-nav") &&
        !event.target.closest("[data-nav-toggle]")
      ) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980) setOpen(false);
    });
  }

  /* ---- Reveal on scroll -------------------------------------------------- */
  const reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      reveals.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ---- Current year ------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---- Table of contents scrollspy -------------------------------------- */
  const tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.toc a[href^="#"]')
  );

  if (tocLinks.length && "IntersectionObserver" in window) {
    const sections = tocLinks
      .map(function (link) {
        const id = link.getAttribute("href").slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    const setCurrent = function (id) {
      tocLinks.forEach(function (link) {
        const isCurrent = link.getAttribute("href") === "#" + id;
        link.classList.toggle("is-current", isCurrent);
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const spy = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

        if (visible.length) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -62% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }
})();
