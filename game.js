(() => {
  "use strict";

  const STORAGE_KEY = "halloweenDecodeProgress";
  const LEVELS = {
    "1.html": 0,
    "2.html": 1,
    "3.html": 2,
    "通关.html": 3
  };

  function getProgress() {
    try {
      const n = Number.parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      return Number.isFinite(n) ? Math.max(0, Math.min(3, n)) : 0;
    } catch (_) {
      return 0;
    }
  }

  function setProgress(n) {
    try { localStorage.setItem(STORAGE_KEY, String(n)); } catch (_) {}
  }

  function currentPage() {
    const parts = decodeURIComponent(location.pathname).split("/");
    return parts[parts.length - 1] || "index.html";
  }

  function initAccessControl() {
    const page = currentPage();
    const required = LEVELS[page];
    if (required === undefined) return;

    const progress = getProgress();
    if (required > progress) {
      const box = document.querySelector(".box") || document.body;
      box.innerHTML = '<h1>尚未解锁</h1><p class="message">请先完成前面的关卡，再来这里挑战。</p><a class="button" href="index.html">返回首页</a>';
      return;
    }

    if (page === "通关.html" && progress < 3) {
      location.replace("3.html");
    }
  }

  window.checkAnswer = function(event, expected, messageId, nextId, progressAfter) {
    if (event) event.preventDefault();

    const input = document.getElementById("answer");
    const message = document.getElementById(messageId);
    const next = document.getElementById(nextId);
    const form = input ? input.closest("form") : null;
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;

    if (!input || !message || !next) return false;

    const value = input.value.trim().toLowerCase().replace(/\s+/g, " ");
    const normalizedExpected = expected.trim().toLowerCase().replace(/\s+/g, " ");

    if (value === normalizedExpected) {
      message.textContent = "答案正确！已解锁下一步。";
      message.style.color = "#ff3030";
      next.classList.remove("hidden");
      setProgress(progressAfter);
      input.disabled = true;
      if (submitButton) submitButton.disabled = true;
    } else {
      message.textContent = "答案不正确，再检查一下线索吧。";
      message.style.color = "#ff3030";
      next.classList.add("hidden");
    }
    return false;
  };

  document.addEventListener("DOMContentLoaded", initAccessControl);
})();