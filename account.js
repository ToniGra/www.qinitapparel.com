(function () {
  "use strict";

  const config = window.QinitSupabaseConfig;
  const status = document.querySelector("[data-account-status]");
  const tabs = Array.from(document.querySelectorAll('[role="tab"][aria-controls]'));
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const submitButtons = Array.from(document.querySelectorAll(".submit-button"));

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function selectTab(selectedTab, moveFocus) {
    tabs.forEach(function (tab) {
      const selected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
    });

    if (moveFocus) {
      selectedTab.focus();
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(tab, false);
      window.location.hash = tab.id === "login-tab" ? "login" : "signup";
      setStatus("", false);
    });

    tab.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const offset = event.key === "ArrowRight" ? 1 : -1;
        selectTab(tabs[(index + offset + tabs.length) % tabs.length], true);
      }
    });
  });

  function syncTabWithHash() {
    selectTab(window.location.hash === "#login" ? tabs[1] : tabs[0], false);
  }

  window.addEventListener("hashchange", syncTabWithHash);
  syncTabWithHash();

  const validConfig = config && /^https:\/\/[a-z0-9.-]+$/.test(config.url) &&
    typeof config.anonKey === "string" && config.anonKey.length > 0;

  if (!validConfig) {
    submitButtons.forEach(function (button) {
      button.disabled = true;
    });
    setStatus("Account sign-up and login will be available after the Supabase project URL and public anon/publishable key are configured in auth-config.js.", true);
    return;
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    submitButtons.forEach(function (button) {
      button.disabled = true;
    });
    setStatus("The Supabase authentication library could not be loaded. Check your internet connection and reload this page.", true);
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(signupForm);
    submitButtons.forEach(function (button) { button.disabled = true; });

    try {
      const result = await client.auth.signUp({
        email: formData.get("email"),
        password: formData.get("password"),
        options: {
          data: { full_name: formData.get("name") },
          emailRedirectTo: window.location.origin + window.location.pathname + "#login"
        }
      });

      if (result.error) {
        throw result.error;
      }

      if (result.data.session) {
        window.location.href = "home.html";
      } else {
        setStatus("Account created. Check your email to confirm your address before logging in.", false);
        selectTab(tabs[1], false);
        window.location.hash = "login";
      }
    } catch (error) {
      setStatus(error.message || "Sign up failed. Please try again.", true);
    } finally {
      submitButtons.forEach(function (button) { button.disabled = false; });
    }
  });

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    submitButtons.forEach(function (button) { button.disabled = true; });

    try {
      const result = await client.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password")
      });

      if (result.error) {
        throw result.error;
      }

      window.location.href = "home.html";
    } catch (error) {
      setStatus(error.message || "Login failed. Please try again.", true);
    } finally {
      submitButtons.forEach(function (button) { button.disabled = false; });
    }
  });
}());
