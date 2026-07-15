// My Shoes Hub - Google OAuth & Supabase Encryption Authentication Handler

(function () {
  // Wait until CONFIG is loaded
  if (typeof CONFIG === "undefined") {
    console.error("Configuration CONFIG is not defined. Please verify js/config.js loads first.");
    return;
  }

  let supabaseClient = null;

  // Initialize Supabase Client if credentials are provided
  if (CONFIG.supabase && CONFIG.supabase.url && CONFIG.supabase.anonKey) {
    supabaseClient = supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
  } else {
    console.warn("Supabase credentials missing from js/config.js. Authentication features will be disabled until configured.");
  }

  // Encryption helper using CryptoJS (AES-256)
  function encryptData(text, key) {
    if (!text || !key) return "";
    try {
      return CryptoJS.AES.encrypt(text, key).toString();
    } catch (e) {
      console.error("Encryption failed:", e);
      return "";
    }
  }

  function hashEmailAddress(email) {
    if (!email) return "";
    return CryptoJS.SHA256(email.toLowerCase().trim()).toString();
  }

  // Render Auth UI in Navbar & Mobile Drawer
  function renderAuthUI(userSession) {
    const desktopContainer = document.getElementById("auth-container");
    const mobileContainer = document.getElementById("mobile-auth-container");

    if (!supabaseClient) {
      const missingConfigHtml = `<span class="text-xs text-red-500 font-semibold border border-red-200 bg-red-50 p-2 rounded">Configure Supabase Keys</span>`;
      if (desktopContainer) desktopContainer.innerHTML = missingConfigHtml;
      if (mobileContainer) mobileContainer.innerHTML = missingConfigHtml;
      return;
    }

    if (userSession) {
      const user = userSession.user;
      const userMeta = user.user_metadata || {};
      const fullName = userMeta.full_name || userMeta.name || "Hub User";
      const avatarUrl = userMeta.avatar_url || "";
      const firstName = fullName.split(" ")[0];

      // Encrypt and Sync data into the Supabase database
      syncUserDataToSupabase(user.email, fullName, avatarUrl);

      // Desktop Navbar logged-in state
      if (desktopContainer) {
        desktopContainer.innerHTML = `
          <div class="flex items-center space-x-3 pl-2 border-l border-white/10">
            <div class="flex items-center space-x-2 group">
              ${
                avatarUrl
                  ? `<img src="${avatarUrl}" alt="${fullName}" class="w-9 h-9 rounded-full object-cover border border-[#C98A2B]/20" />`
                  : `<div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#C98A2B]"><i data-lucide="user" class="w-5 h-5"></i></div>`
              }
              <span class="text-xs font-semibold text-gray-300 max-w-[100px] truncate hidden md:inline">${firstName}</span>
            </div>
            <button id="auth-logout-btn" class="p-2 bg-red-950/20 text-red-400 rounded-full hover:bg-red-900/30 hover:text-red-300 transition-all border border-red-900/20" title="Sign Out">
              <i data-lucide="log-out" class="w-4 h-4"></i>
            </button>
          </div>
        `;
      }

      // Mobile Drawer logged-in state
      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <div class="flex flex-col space-y-3 p-3 bg-cream-dark/30 rounded-premium border border-warm/20">
            <div class="flex items-center space-x-3">
              ${
                avatarUrl
                  ? `<img src="${avatarUrl}" alt="${fullName}" class="w-10 h-10 rounded-full object-cover border border-[#C98A2B]/20" />`
                  : `<div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#C98A2B]"><i data-lucide="user" class="w-6 h-6"></i></div>`
              }
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">${fullName}</p>
                <p class="text-xs text-gray-500 truncate">${user.email}</p>
              </div>
            </div>
            <button id="mobile-logout-btn" class="w-full py-2.5 bg-red-50 text-red-600 font-semibold rounded-button text-center flex items-center justify-center hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100">
              <i data-lucide="log-out" class="w-4 h-4 mr-2"></i> Sign Out
            </button>
          </div>
        `;
      }

      // Hook logout events
      document.getElementById("auth-logout-btn")?.addEventListener("click", handleLogout);
      document.getElementById("mobile-logout-btn")?.addEventListener("click", handleLogout);

    } else {
      // Logged out state - show login triggers
      const loginBtnHtml = `
        <button id="auth-login-btn" class="inline-flex items-center px-4 py-2 bg-transparent border border-white/20 text-gray-200 text-sm font-semibold rounded-button hover:bg-white/5 hover:border-accent transition-all shadow-sm">
          <i data-lucide="log-in" class="w-4 h-4 mr-2 text-accent"></i> Login
        </button>
      `;

      const mobileLoginBtnHtml = `
        <button id="mobile-login-btn" class="w-full py-2.5 bg-white border border-warm text-gray-700 font-semibold rounded-button text-center flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
          <i data-lucide="log-in" class="w-4 h-4 mr-2 text-accent"></i> Sign In with Google
        </button>
      `;

      if (desktopContainer) desktopContainer.innerHTML = loginBtnHtml;
      if (mobileContainer) mobileContainer.innerHTML = mobileLoginBtnHtml;

      // Hook login events
      document.getElementById("auth-login-btn")?.addEventListener("click", handleLogin);
      document.getElementById("mobile-login-btn")?.addEventListener("click", handleLogin);
    }

    // Re-create icons for new elements
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Handle Google OAuth authentication
  async function handleLogin() {
    if (!supabaseClient) return;
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (e) {
      console.error("Sign in failed:", e);
      showToast("Authentication Failed. Please check your credentials.", "error");
    }
  }

  async function handleLogout() {
    if (!supabaseClient) return;
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      window.location.reload();
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  }

  // Encrypt and save user details in Supabase custom 'users' table
  async function syncUserDataToSupabase(email, name, image) {
    if (!supabaseClient) return;

    const emailHash = hashEmailAddress(email);
    const encKey = CONFIG.security.encryptionKey || "default-key-32-chars-long";

    const encryptedEmail = encryptData(email, encKey);
    const encryptedName = encryptData(name, encKey);
    const encryptedImage = image ? encryptData(image, encKey) : "";

    try {
      // Check if user already exists
      const { data: existingUser } = await supabaseClient
        .from("users")
        .select("id")
        .eq("email_hash", emailHash)
        .maybeSingle();

      if (!existingUser) {
        // Create user profile
        const { error: insertError } = await supabaseClient
          .from("users")
          .insert({
            email_hash: emailHash,
            encrypted_email: encryptedEmail,
            encrypted_name: encryptedName,
            encrypted_image: encryptedImage,
            role: "CUSTOMER"
          });
        
        if (insertError) console.error("Error creating user in Supabase:", insertError);
      } else {
        // Update user profile fields (encrypted)
        const { error: updateError } = await supabaseClient
          .from("users")
          .update({
            encrypted_name: encryptedName,
            encrypted_image: encryptedImage,
            updated_at: new Date().toISOString()
          })
          .eq("email_hash", emailHash);

        if (updateError) console.error("Error updating user in Supabase:", updateError);
      }
    } catch (e) {
      console.error("Data syncing failed:", e);
    }
  }

  // Toast utility helper (hooked to page's toaster if available)
  function showToast(message, type) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `p-4 rounded-premium shadow-xl border flex items-start space-x-3 max-w-sm transition-all duration-300 transform translate-y-2 opacity-0 ${
      type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800"
    }`;

    toast.innerHTML = `
      <div class="text-xs font-semibold leading-relaxed">${message}</div>
      <button class="text-gray-400 hover:text-gray-650" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    setTimeout(() => {
      toast.classList.add("translate-y-2", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // Listen to Auth State changes on Page Load
  document.addEventListener("DOMContentLoaded", async () => {
    if (!supabaseClient) {
      renderAuthUI(null);
      return;
    }

    // Get current session
    const { data: { session } } = await supabaseClient.auth.getSession();
    renderAuthUI(session);

    // Listen to changes (sign in, sign out, token refreshed)
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      renderAuthUI(session);
    });
  });
})();
