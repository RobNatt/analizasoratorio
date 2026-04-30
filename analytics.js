(function () {
  "use strict";
  var KEY = "as_site_visits";
  var path = window.location.pathname || "/";
  if (path.endsWith("/") && path.length > 1) path = path.slice(0, -1);
  if (path === "") path = "/";

  try {
    var raw = localStorage.getItem(KEY);
    var map = raw ? JSON.parse(raw) : {};
    if (typeof map !== "object" || map === null) map = {};
    map[path] = (map[path] || 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch (e) {}
})();
