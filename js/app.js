// My Shoes Hub - Main Application Logic
document.addEventListener("DOMContentLoaded", () => {
  if (typeof CONFIG === "undefined") {
    console.error("Configuration file (js/config.js) failed to load.");
    return;
  }

  lucide.createIcons();

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);

  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const state = { cart: [] };

  function getWhatsAppUrl(messageText) {
    const cleanMsg = encodeURIComponent(messageText);
    return `https://wa.me/${CONFIG.business.whatsappNumber}?text=${cleanMsg}`;
  }

  function initializeWhatsAppButtons() {
    const buttons = [
      document.getElementById("hero-whatsapp-btn"),
      document.getElementById("nav-whatsapp-btn"),
      document.getElementById("mobile-whatsapp-btn"),
      document.getElementById("contact-whatsapp-btn")
    ];

    const defaultMessage = `Hello My Shoes Hub, I visited your website and would like to enquire about your footwear services in Bardoli.`;

    buttons.forEach((button) => {
      if (button) {
        button.href = getWhatsAppUrl(defaultMessage);
      }
    });
  }

  initializeWhatsAppButtons();

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function toggleMobileMenu() {
    const isHidden = mobileDrawer.classList.contains("hidden");
    if (isHidden) {
      mobileDrawer.classList.remove("hidden");
      menuIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    } else {
      mobileDrawer.classList.add("hidden");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileDrawer.classList.contains("hidden")) {
        toggleMobileMenu();
      }
    });
  });

  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("glass-nav-scrolled");
      navbar.classList.remove("py-1");
    } else {
      navbar.classList.remove("glass-nav-scrolled");
      navbar.classList.add("py-1");
    }
  });

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px",
    threshold: 0
  };

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("text-primary", "border-primary");
          link.classList.add("border-transparent");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("text-primary", "border-primary");
            link.classList.remove("border-transparent");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => activeObserver.observe(section));

  const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  reveals.forEach((el) => revealObserver.observe(el));

  const counters = document.querySelectorAll(".counter");
  const statsSection = document.querySelector(".counter")?.closest("section");

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach((counter) => {
          const target = Number(counter.getAttribute("data-target"));
          const duration = 2000;
          const increment = target / (duration / 16);
          let count = 0;

          const updateCount = () => {
            count += increment;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 16);
            } else {
              counter.innerText = target;
            }
          };

          updateCount();
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    counterObserver.observe(statsSection);
  }

  const productsContainer = document.getElementById("products-grid-container");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const catalogSearch = document.getElementById("catalog-search");
  const catalogCondition = document.getElementById("catalog-condition");

  function renderProducts(categoryFilter = "all") {
    if (!productsContainer) return;

    const searchText = catalogSearch?.value.trim().toLowerCase() || "";
    const selectedCondition = catalogCondition?.value || "all";

    const filteredBooks = CONFIG.books.filter((book) => {
      const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
      const matchesSearch = !searchText || [book.title, book.author, book.category]
        .join(" ")
        .toLowerCase()
        .includes(searchText);
      const matchesCondition = selectedCondition === "all" || book.condition === selectedCondition;
      return matchesCategory && matchesSearch && matchesCondition;
    });

    productsContainer.innerHTML = "";

    if (!filteredBooks.length) {
      productsContainer.innerHTML = `
        <div class="col-span-full rounded-premium border border-dashed border-warm bg-white p-8 text-center text-sm text-gray-600">
          No shoe pairs matched the current search. Try another style or switch categories.
        </div>
      `;
      return;
    }

    filteredBooks.forEach((book, index) => {
      const card = document.createElement("article");
      card.className = "card-premium rounded-premium overflow-hidden flex flex-col justify-between opacity-0 translate-y-4 transition-all duration-500";
      card.style.transitionDelay = `${index * 80}ms`;

      const conditionBadge = book.condition === "NEW"
        ? `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">${book.condition}</span>`
        : `<span class="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">${book.condition}</span>`;

      card.innerHTML = `
        <div class="relative image-zoom-parent h-60 w-full bg-cream-dark">
          <img src="${book.coverImageUrl}" alt="${book.title}" class="w-full h-full object-cover">
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] uppercase font-bold text-primary tracking-widest">${book.category}</span>
              ${conditionBadge}
            </div>
            <h3 class="text-lg font-bold text-gray-900 leading-snug">${book.title}</h3>
            <p class="text-xs text-gray-500 font-semibold">${book.author}</p>
            <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">${book.description}</p>
          </div>

          <div class="space-y-3 pt-3 border-t border-warm">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Buy price</p>
                <p class="text-lg font-black text-gray-900">${formatCurrency(book.price)}</p>
              </div>
              ${book.isRentable ? `<div class="text-right"><p class="text-[10px] font-bold text-primary uppercase tracking-wide">Rent</p><p class="text-lg font-black text-primary">${formatCurrency(book.rentalPricePerDay)}/day</p></div>` : ""}
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <button data-book-id="${book.id}" data-book-kind="buy" class="add-to-cart-btn py-2.5 px-2 bg-primary text-white font-bold rounded-button text-center hover:bg-primary-light transition-colors flex items-center justify-center">
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5 mr-1.5"></i>
                Add to cart
              </button>
              ${book.isRentable ? `<button data-book-id="${book.id}" data-book-kind="rent" class="add-to-cart-btn py-2.5 px-2 bg-amber-50 text-amber-800 border border-amber-200 font-bold rounded-button text-center hover:bg-amber-100 transition-colors flex items-center justify-center">
                <i data-lucide="calendar-days" class="w-3.5 h-3.5 mr-1.5 text-amber-700"></i>
                Rent
              </button>` : `<button class="py-2.5 px-2 bg-gray-100 text-gray-500 border border-gray-200 font-bold rounded-button text-center cursor-not-allowed">Not rentable</button>`}
            </div>

            <button data-book-name="${book.title}" data-book-category="${book.category}" class="custom-enquiry-btn w-full py-2 bg-gray-50 text-gray-600 border border-gray-200 text-center font-semibold rounded-button text-[11px] hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center">
              <i data-lucide="mail" class="w-3 h-3 mr-1"></i>
              Send custom enquiry
            </button>
          </div>
        </div>
      `;

      productsContainer.appendChild(card);
      setTimeout(() => card.classList.remove("opacity-0", "translate-y-4"), 50);
    });

    lucide.createIcons();
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((item) => {
        item.classList.remove("active", "bg-primary", "text-white", "border-primary");
        item.classList.add("bg-white", "text-gray-700", "border-warm");
      });

      tab.classList.add("active", "bg-primary", "text-white", "border-primary");
      tab.classList.remove("bg-white", "text-gray-700", "border-warm");
      renderProducts(tab.dataset.category);
    });
  });

  if (catalogSearch) {
    catalogSearch.addEventListener("input", () => {
      renderProducts(document.querySelector(".filter-tab.active")?.dataset.category || "all");
    });
  }

  if (catalogCondition) {
    catalogCondition.addEventListener("change", () => {
      renderProducts(document.querySelector(".filter-tab.active")?.dataset.category || "all");
    });
  }

  function addToCart(bookId, kind = "buy") {
    const book = CONFIG.books.find((entry) => entry.id === bookId);
    if (!book) return;

    const existingItem = state.cart.find((item) => item.bookId === bookId && item.kind === kind);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({
        bookId: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        price: kind === "rent" ? book.rentalPricePerDay : book.price,
        kind,
        condition: book.condition,
        quantity: 1
      });
    }

    renderCart();
  }

  const cartList = document.getElementById("cart-list");
  const cartCountBadge = document.getElementById("cart-count-badge");
  const cartSubtotal = document.getElementById("cart-subtotal");

  function renderCart() {
    if (!cartList || !cartCountBadge || !cartSubtotal) return;

    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;

    if (!state.cart.length) {
      cartList.innerHTML = `
        <div class="rounded-premium border border-dashed border-warm bg-cream p-4 text-sm text-gray-600">
          Your footwear cart is empty. Add a pair or rental to begin.
        </div>
      `;
      cartSubtotal.textContent = formatCurrency(0);
      return;
    }

    cartList.innerHTML = state.cart.map((item) => `
      <div class="border border-warm rounded-premium p-3 bg-cream">
        <div class="flex justify-between gap-3 items-start">
          <div>
            <p class="text-sm font-bold text-gray-900">${item.title}</p>
            <p class="text-[11px] text-gray-500 mt-1">${item.kind === "rent" ? "Rental" : "Purchase"} • ${item.condition}</p>
          </div>
          <button data-cart-remove="${item.bookId}" data-cart-kind="${item.kind}" class="text-xs font-bold text-red-600 hover:text-red-800">Remove</button>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button data-cart-action="decrement" data-cart-book-id="${item.bookId}" data-cart-kind="${item.kind}" class="w-8 h-8 rounded-full bg-white border border-warm text-lg leading-none">−</button>
            <span class="text-sm font-bold text-gray-900">${item.quantity}</span>
            <button data-cart-action="increment" data-cart-book-id="${item.bookId}" data-cart-kind="${item.kind}" class="w-8 h-8 rounded-full bg-white border border-warm text-lg leading-none">+</button>
          </div>
          <span class="text-sm font-bold text-primary">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      </div>
    `).join("");

    const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartSubtotal.textContent = formatCurrency(subtotal);
  }

  const reserveOrderButton = document.querySelector("#cart-list")?.closest("aside")?.querySelector("button");
  if (reserveOrderButton) {
    reserveOrderButton.addEventListener("click", () => {
      if (!state.cart.length) {
        showToast("error", "Your cart is empty. Add a pair or rental before reserving an order.");
        return;
      }

      const orderSummary = state.cart
        .map((item) => `${item.quantity} x ${item.title} (${item.kind === "rent" ? "rental" : "buy"})`)
        .join(", ");
      const message = `Hello My Shoes Hub, I would like to reserve the following footwear pairs: ${orderSummary}. Please confirm the available pickup and payment option.`;
      window.open(getWhatsAppUrl(message), "_blank");
    });
  }

  cartList?.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    const bookId = target.dataset.cartBookId || target.dataset.cartRemove;
    const kind = target.dataset.cartKind;
    const action = target.dataset.cartAction;

    if (target.dataset.cartRemove) {
      state.cart = state.cart.filter((item) => !(item.bookId === bookId && item.kind === kind));
      renderCart();
      return;
    }

    if (action === "increment") {
      const item = state.cart.find((entry) => entry.bookId === bookId && entry.kind === kind);
      if (item) item.quantity += 1;
    }

    if (action === "decrement") {
      const item = state.cart.find((entry) => entry.bookId === bookId && entry.kind === kind);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.cart = state.cart.filter((entry) => !(entry.bookId === bookId && entry.kind === kind));
        }
      }
    }

    renderCart();
  });

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart-btn");
    if (addButton) {
      addToCart(addButton.dataset.bookId, addButton.dataset.bookKind);
      showToast("success", "Added to your footwear cart.");
    }

    const enquiryButton = event.target.closest(".custom-enquiry-btn");
    if (enquiryButton) {
      scrollToContactForm(enquiryButton.dataset.bookCategory, enquiryButton.dataset.bookName);
    }
  });

  function scrollToContactForm(category, productName) {
    const contactSection = document.getElementById("contact");
    const formInterest = document.getElementById("form-interest");
    const formMessage = document.getElementById("form-message");
    const categoryMapping = {
      CHELSEA_BOOTS: "Chelsea Boots",
      SNEAKERS: "Sneakers",
      SPORT_SHOES: "Sport Shoes",
      RIDING_SHOES: "Riding Shoes",
      FORMAL_SHOES: "Formal Shoes - Buy"
    };

    if (formInterest) {
      formInterest.value = categoryMapping[category] || "Other enquiry";
    }

    if (formMessage) {
      formMessage.value = `Hello My Shoes Hub team, I would like to enquire about "${productName}" in Bardoli. Please share the latest availability and rental details.`;
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => document.getElementById("form-name")?.focus(), 800);
    }
  }

  window.scrollToContactForm = scrollToContactForm;

  renderProducts();
  renderCart();

  const testimonialsContainer = document.getElementById("testimonials-grid-container");
  function renderTestimonials() {
    if (!testimonialsContainer) return;

    testimonialsContainer.innerHTML = "";
    CONFIG.testimonials.forEach((testimonial) => {
      const card = document.createElement("div");
      card.className = "card-premium rounded-premium p-8 relative flex flex-col justify-between reveal";

      const starHTML = Array.from({ length: 5 }, (_, index) => {
        const starClass = index < testimonial.rating ? "text-accent fill-accent" : "text-gray-300";
        return `<i data-lucide="star" class="w-4 h-4 ${starClass}"></i>`;
      }).join("");

      card.innerHTML = `
        <div class="space-y-4">
          <div class="flex space-x-1">${starHTML}</div>
          <p class="text-sm text-gray-600 italic leading-relaxed">"${testimonial.quote}"</p>
        </div>
        <div class="flex items-center space-x-3.5 pt-6 mt-6 border-t border-warm">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
            ${testimonial.name.split(" ").map((part) => part[0]).join("")}
          </div>
          <div>
            <h4 class="font-bold text-gray-900 text-sm">${testimonial.name}</h4>
            <p class="text-[11px] text-gray-500 font-semibold">${testimonial.role} • ${testimonial.location}</p>
          </div>
        </div>
      `;

      testimonialsContainer.appendChild(card);
    });

    lucide.createIcons();
  }

  renderTestimonials();

  const rentalSelect = document.getElementById("rental-book-select");
  const rentalSlider = document.getElementById("rental-days-slider");
  const rentalDaysDisplay = document.getElementById("rental-days-display");
  const calcRate = document.getElementById("calc-rate");
  const calcDays = document.getElementById("calc-days");
  const calcRawTotal = document.getElementById("calc-raw-total");
  const calcDiscountRow = document.getElementById("calc-discount-row");
  const calcDiscountVal = document.getElementById("calc-discount-val");
  const calcFinalTotal = document.getElementById("calc-final-total");
  const calcRentBtn = document.getElementById("calc-rent-btn");

  const rentalBooks = CONFIG.books.filter((book) => book.isRentable);

  if (rentalSelect) {
    rentalSelect.innerHTML = rentalBooks.map((book) => `
      <option value="${book.id}" data-rate="${book.rentalPricePerDay}">${book.title} (${formatCurrency(book.rentalPricePerDay)}/day)</option>
    `).join("");
  }

  function runRentalCalculation() {
    if (!rentalSelect || !rentalSlider) return;

    const selectedOption = rentalSelect.options[rentalSelect.selectedIndex];
    const dailyRate = Number(selectedOption.getAttribute("data-rate"));
    const days = Number(rentalSlider.value);
    const deposit = CONFIG.rental.securityDeposit;

    const rawTotal = dailyRate * days;
    let discountPercent = 0;

    if (days >= 7) {
      discountPercent = CONFIG.rental.discountTier7Days;
    } else if (days >= 3) {
      discountPercent = CONFIG.rental.discountTier3Days;
    }

    const discountAmount = Math.round(rawTotal * discountPercent);
    const finalPayable = rawTotal - discountAmount + deposit;

    if (rentalDaysDisplay) rentalDaysDisplay.innerText = `${days} day${days > 1 ? "s" : ""}`;
    if (calcRate) calcRate.innerText = formatCurrency(dailyRate);
    if (calcDays) calcDays.innerText = days;
    if (calcRawTotal) calcRawTotal.innerText = formatCurrency(rawTotal);

    if (discountPercent > 0 && calcDiscountRow && calcDiscountVal) {
      calcDiscountRow.classList.remove("hidden");
      calcDiscountVal.innerText = `- ${formatCurrency(discountAmount)}`;
    } else if (calcDiscountRow) {
      calcDiscountRow.classList.add("hidden");
    }

    if (calcFinalTotal) calcFinalTotal.innerText = formatCurrency(finalPayable);

    if (calcRentBtn) {
      const selectedName = selectedOption.text.split(" (")[0];
      const enquiryText = `Hello My Shoes Hub, I would like to rent "${selectedName}" for ${days} days starting from _________ (Specify date). Total rental charges: ${formatCurrency(rawTotal - discountAmount)} + refundable deposit: ${formatCurrency(deposit)}.`;
      calcRentBtn.onclick = () => window.open(getWhatsAppUrl(enquiryText), "_blank");
    }
  }

  if (rentalSelect) rentalSelect.addEventListener("change", runRentalCalculation);
  if (rentalSlider) rentalSlider.addEventListener("input", runRentalCalculation);

  if (rentalSelect && rentalSlider) {
    runRentalCalculation();
  }

  const contactForm = document.getElementById("enquiry-form");
  const contactFields = {
    name: {
      input: document.getElementById("form-name"),
      error: document.getElementById("error-name"),
      validate: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return "Name is required.";
        if (trimmed.length < 3) return "Name must be at least 3 characters.";
        if (!/^[a-zA-Z\s]+$/.test(trimmed)) return "Name can only contain alphabets and spaces.";
        return null;
      }
    },
    phone: {
      input: document.getElementById("form-phone"),
      error: document.getElementById("error-phone"),
      validate: (value) => {
        const cleaned = value.trim().replace(/\s+/g, "");
        if (!cleaned) return "Phone number is required.";
        if (!/^\d{10}$/.test(cleaned)) return "Phone number must be exactly 10 digits.";
        return null;
      }
    },
    interest: {
      input: document.getElementById("form-interest"),
      error: document.getElementById("error-interest"),
      validate: (value) => {
        if (!value) return "Please select an interest.";
        return null;
      }
    },
    message: {
      input: document.getElementById("form-message"),
      error: document.getElementById("error-message"),
      validate: (value) => {
        const trimmed = value.trim();
        if (!trimmed) return "Message is required.";
        if (trimmed.length < 10) return "Please enter at least 10 characters.";
        return null;
      }
    }
  };

  function clearError(fieldKey) {
    const field = contactFields[fieldKey];
    if (!field || !field.error || !field.input) return;
    field.error.textContent = "";
    field.error.classList.add("hidden");
    field.input.classList.remove("border-red-500", "focus:border-red-500");
    field.input.classList.add("border-white/15", "focus:border-accent");
  }

  function showError(fieldKey, message) {
    const field = contactFields[fieldKey];
    if (!field || !field.error || !field.input) return;
    field.error.textContent = message;
    field.error.classList.remove("hidden");
    field.input.classList.add("border-red-500", "focus:border-red-500");
    field.input.classList.remove("border-white/15", "focus:border-accent");
  }

  Object.keys(contactFields).forEach((key) => {
    const field = contactFields[key];
    if (!field.input) return;

    field.input.addEventListener("blur", () => {
      const error = field.validate(field.input.value);
      if (error) showError(key, error);
      else clearError(key);
    });

    field.input.addEventListener("input", () => {
      const error = field.validate(field.input.value);
      if (!error) clearError(key);
    });
  });

  const toastContainer = document.getElementById("toast-container");
  function showToast(type, message) {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "p-4 rounded-premium shadow-xl border flex items-start space-x-3 max-w-sm transition-all duration-300 transform translate-y-2 opacity-0 select-none";

    if (type === "success") {
      toast.className += " bg-green-50 border-green-200 text-green-800";
    } else {
      toast.className += " bg-red-50 border-red-200 text-red-800";
    }

    const iconName = type === "success" ? "check-circle-2" : "alert-triangle";
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="w-5 h-5 shrink-0 ${type === "success" ? "text-green-600" : "text-red-600"}"></i>
      <div class="flex-1 text-xs font-semibold leading-relaxed">${message}</div>
      <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.remove()" aria-label="Close Notification">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    toastContainer.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => toast.classList.remove("translate-y-2", "opacity-0"), 50);
    setTimeout(() => {
      toast.classList.add("translate-y-2", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let hasErrors = false;
      const payload = {};

      Object.keys(contactFields).forEach((key) => {
        const field = contactFields[key];
        const value = field.input.value;
        const error = field.validate(value);

        if (error) {
          showError(key, error);
          hasErrors = true;
        } else {
          clearError(key);
          payload[key] = value.trim();
        }
      });

      if (hasErrors) {
        showToast("error", "Please correct the highlighted fields before submitting.");
        return;
      }

      const submitButton = contactForm.querySelector("button[type='submit']");
      const originalLabel = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i>Submitting...`;
      lucide.createIcons();

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
        lucide.createIcons();

        if (!response.ok) {
          const serverErrors = result.errors || {};
          Object.keys(serverErrors).forEach((key) => {
            if (contactFields[key]) {
              showError(key, serverErrors[key]);
            }
          });
          throw new Error("Server validation error");
        }

        showToast("success", `Thank you ${payload.name}! Your enquiry for ${payload.interest} was submitted successfully.`);
        contactForm.reset();
      } catch (error) {
        console.error(error);
        showToast("error", "The form could not be submitted right now. Please call or WhatsApp the store directly.");
      }
    });
  }

  const sellForm = document.getElementById("sell-form");
  const sellFields = {
    bookTitle: {
      input: document.getElementById("sell-title"),
      error: document.getElementById("sell-error-title"),
      validate: (value) => {
        if (!value.trim()) return "Shoe model is required.";
        if (value.trim().length < 3) return "Shoe model must be at least 3 characters.";
        return null;
      }
    },
    author: {
      input: document.getElementById("sell-author"),
      error: document.getElementById("sell-error-author"),
      validate: (value) => {
        if (!value.trim()) return "Brand / style is required.";
        if (value.trim().length < 3) return "Brand / style must be at least 3 characters.";
        return null;
      }
    },
    condition: {
      input: document.getElementById("sell-condition"),
      error: document.getElementById("sell-error-condition"),
      validate: (value) => {
        if (!value) return "Please select a condition.";
        return null;
      }
    },
    conditionDescription: {
      input: document.getElementById("sell-notes"),
      error: document.getElementById("sell-error-notes"),
      validate: (value) => {
        if (!value.trim()) return "Please describe the shoe condition.";
        if (value.trim().length < 10) return "Please add a bit more detail about the shoe condition.";
        return null;
      }
    },
    proposedPriceByOwner: {
      input: document.getElementById("sell-price"),
      error: document.getElementById("sell-error-price"),
      validate: (value) => {
        if (!value || Number(value) <= 0) return "Expected price must be greater than zero.";
        return null;
      }
    }
  };

  function sellShowError(fieldKey, message) {
    const field = sellFields[fieldKey];
    if (!field || !field.error || !field.input) return;
    field.error.textContent = message;
    field.error.classList.remove("hidden");
    field.input.classList.add("border-red-500", "focus:border-red-500");
    field.input.classList.remove("border-warm", "focus:border-primary");
  }

  function sellClearError(fieldKey) {
    const field = sellFields[fieldKey];
    if (!field || !field.error || !field.input) return;
    field.error.textContent = "";
    field.error.classList.add("hidden");
    field.input.classList.remove("border-red-500", "focus:border-red-500");
    field.input.classList.add("border-warm", "focus:border-primary");
  }

  Object.keys(sellFields).forEach((key) => {
    const field = sellFields[key];
    if (!field.input) return;

    field.input.addEventListener("blur", () => {
      const error = field.validate(field.input.value);
      if (error) sellShowError(key, error);
      else sellClearError(key);
    });

    field.input.addEventListener("input", () => {
      const error = field.validate(field.input.value);
      if (!error) sellClearError(key);
    });
  });

  const sellStatusCard = document.getElementById("sell-status-card");
  const sellStatusBadge = document.getElementById("sell-status-badge");
  const sellStatusSteps = document.getElementById("sell-status-steps");

  function renderSellStatus(value = "PENDING") {
    if (!sellStatusCard || !sellStatusBadge || !sellStatusSteps) return;

    sellStatusCard.classList.remove("hidden");
    sellStatusBadge.textContent = value;

    const statuses = ["PENDING", "REVIEWED", "OFFER_MADE", "ACCEPTED", "COMPLETED"];
    sellStatusSteps.innerHTML = statuses.map((status) => `
      <div class="rounded-button border ${status === value ? "border-primary bg-primary/10 text-primary" : "border-warm bg-white text-gray-500"} px-2 py-2 text-center font-bold">
        ${status.replace("_", " ")}
      </div>
    `).join("");
  }

  if (sellForm) {
    sellForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let hasErrors = false;
      const payload = {};

      Object.keys(sellFields).forEach((key) => {
        const field = sellFields[key];
        const value = field.input.value;
        const error = field.validate(value);

        if (error) {
          sellShowError(key, error);
          hasErrors = true;
        } else {
          sellClearError(key);
          payload[key] = key === "proposedPriceByOwner" ? Number(value) : value.trim();
        }
      });

      if (hasErrors) {
        showToast("error", "Please correct the highlighted buy-back fields before submitting.");
        return;
      }

      const submitButton = sellForm.querySelector("button[type='submit']");
      const originalLabel = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i>Submitting...`;
      lucide.createIcons();

      try {
        const response = await fetch("/api/sell", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            status: "PENDING"
          })
        });

        const result = await response.json().catch(() => ({}));
        submitButton.disabled = false;
        submitButton.innerHTML = originalLabel;
        lucide.createIcons();

        if (!response.ok) {
          const serverErrors = result.errors || {};
          Object.keys(serverErrors).forEach((key) => {
            if (sellFields[key]) {
              sellShowError(key, serverErrors[key]);
            }
          });
          throw new Error("Sell form validation failed");
        }

        renderSellStatus("PENDING");
        showToast("success", "Your buy-back request was saved successfully. Kritesh Yadav will review it shortly.");
        sellForm.reset();
      } catch (error) {
        console.error(error);
        showToast("error", "The buy-back request could not be submitted right now. Please contact the store directly.");
      }
    });
  }

  const wikiSearch = document.getElementById("wiki-search");
  const wikiGrid = document.getElementById("wiki-grid");

  function renderWikiEntries() {
    if (!wikiGrid) return;

    const searchTerm = wikiSearch?.value.trim().toLowerCase() || "";
    const entries = CONFIG.wikiEntries.filter((entry) => {
      const lookup = [entry.title, entry.author, entry.synopsis, entry.category, ...(entry.glossary?.terms || [])].join(" ").toLowerCase();
      return lookup.includes(searchTerm);
    });

    wikiGrid.innerHTML = "";

    if (!entries.length) {
      wikiGrid.innerHTML = `
        <div class="col-span-full rounded-premium border border-dashed border-warm bg-white p-8 text-center text-sm text-gray-600">
          No fit guide entries matched your search. Try a style, material, or fit term.
        </div>
      `;
      return;
    }

    entries.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "rounded-premium border border-warm bg-white p-6 shadow-sm reveal";
      card.innerHTML = `
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <p class="text-[10px] uppercase tracking-wider font-bold text-primary">${entry.category}</p>
            <h3 class="text-lg font-bold text-gray-900">${entry.title}</h3>
          </div>
          <span class="text-[10px] font-semibold text-gray-600 bg-cream px-2.5 py-1 rounded-full">${entry.seriesOrder}</span>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed">${entry.synopsis}</p>
        <div class="mt-4 pt-4 border-t border-warm">
          <p class="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Glossary</p>
          <div class="flex flex-wrap gap-2">
            ${(entry.glossary?.terms || []).map((term) => `<span class="text-xs rounded-full bg-primary/10 text-primary px-2.5 py-1 font-semibold">${term}</span>`).join("")}
          </div>
        </div>
      `;
      wikiGrid.appendChild(card);
    });
  }

  if (wikiSearch) {
    wikiSearch.addEventListener("input", renderWikiEntries);
  }

  renderWikiEntries();
});
