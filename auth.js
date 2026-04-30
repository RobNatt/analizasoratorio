(function (global) {
  "use strict";
  var SESSION_KEY = "as_client_session";
  var DEMO_EMAIL = "analiza@example.com";
  var DEMO_PASSWORD = "chesapeake";

  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    var s = getSession();
    return !!(s && s.email && s.expires && s.expires > Date.now());
  }

  function login(email, password) {
    if (email && String(email).trim().length > 0 && password === DEMO_PASSWORD) {
      var session = {
        email: email.trim(),
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  function requireDashboard() {
    if (!isLoggedIn()) {
      window.location.href = "login.html?next=dashboard.html";
      return false;
    }
    return true;
  }

  global.ASAuth = {
    SESSION_KEY: SESSION_KEY,
    DEMO_EMAIL: DEMO_EMAIL,
    getSession: getSession,
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
    requireDashboard: requireDashboard,
  };
})(typeof window !== "undefined" ? window : this);
