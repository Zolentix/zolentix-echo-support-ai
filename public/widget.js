// Echo Widget Embed Script
// Usage: <script src="https://echo.zolentix.com/widget.js"></script>
(function () {
  var iframe = document.createElement("iframe");
  iframe.src = (window.ECHO_HOST || "https://echo.zolentix.com") + "/embed";
  iframe.style.cssText =
    "position:fixed;bottom:0;right:0;width:420px;height:640px;border:none;z-index:99999;background:transparent;pointer-events:none;";
  iframe.allow = "clipboard-write";
  iframe.title = "Echo Support Chat";
  document.body.appendChild(iframe);

  // Allow interaction when widget is visible
  window.addEventListener("message", function (e) {
    if (e.data === "echo:open") iframe.style.pointerEvents = "auto";
    if (e.data === "echo:close") iframe.style.pointerEvents = "none";
  });
})();
