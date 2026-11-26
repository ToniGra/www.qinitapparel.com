(function () {
  "use strict";

  const storageKey = "qinitApparelCart";
  const catalog = window.QinitCatalog;
  if (!catalog) {
    throw new Error("The fabric catalog must load before the cart.");
  }
  const products = catalog.products;
  const cartItems = document.querySelector("[data-cart-items]");
  const status = document.querySelector("[data-cart-status]");
  const checkout = document.querySelector("[data-cart-checkout]");
  const summary = document.querySelector("[data-cart-summary]");
  const cartTotal = document.querySelector("[data-cart-total]");
  const cartTabs = Array.from(document.querySelectorAll('[role="tab"][aria-controls]'));

  function selectTab(selectedTab, moveFocus) {
    cartTabs.forEach(function (tab) {
      const isSelected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !isSelected;
    });

    if (moveFocus) {
      selectedTab.focus();
    }
  }

  cartTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectTab(tab, false);
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const offset = event.key === "ArrowRight" ? 1 : -1;
        const nextTab = cartTabs[(index + offset + cartTabs.length) % cartTabs.length];
        selectTab(nextTab, true);
      }
    });
  });

  function announce(message, isError) {
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.toggle("error", Boolean(isError));
  }

  function createButton(label, action, product) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.cartAction = action;
    button.dataset.productId = product.id;
    button.textContent = label;
    return button;
  }

  function readCart() {
    let savedCart;

    try {
      savedCart = localStorage.getItem(storageKey);
    } catch (error) {
      announce("Your browser could not access cart storage. Please enable local storage and try again.", true);
      return null;
    }

    if (!savedCart) {
      return [];
    }

    try {
      const cart = JSON.parse(savedCart);
      if (!Array.isArray(cart) || cart.some(function (item) {
        return !item || !products[item.id] ||
          !Number.isSafeInteger(item.quantity) || item.quantity < 1;
      })) {
        throw new Error("Invalid cart data");
      }
      return cart.map(function (item) {
        return Object.assign({}, products[item.id], { quantity: item.quantity });
      });
    } catch (error) {
      announce("Your saved cart could not be read. Clear your browser's Qinit Apparel cart data to continue.", true);
      return null;
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart.map(function (item) {
        return { id: item.id, quantity: item.quantity };
      })));
      return true;
    } catch (error) {
      announce("Your cart could not be saved. Please enable local storage and try again.", true);
      return false;
    }
  }

  function updateCount(cart) {
    const itemCount = (cart || []).reduce(function (total, item) {
      return total + item.quantity;
    }, 0);

    document.querySelectorAll("[data-cart-count]").forEach(function (count) {
      count.textContent = String(itemCount);
    });

    return itemCount;
  }

  function renderCart(cart) {
    const itemCount = updateCount(cart);

    if (!cartItems) {
      return;
    }

    if (cart === null) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "cart-empty";
      emptyMessage.textContent = "Cart details are unavailable. Please reload the page or clear the saved cart data.";
      cartItems.replaceChildren(emptyMessage);
      if (checkout) {
        checkout.setAttribute("aria-disabled", "true");
        checkout.tabIndex = -1;
        checkout.href = "#";
      }
      if (cartTotal) {
        cartTotal.textContent = "Total unavailable";
      }
      return;
    }

    if (cart.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "cart-empty";
      emptyMessage.textContent = "Your cart is empty. Browse our ranges to add some fabric.";
      cartItems.replaceChildren(emptyMessage);
    } else {
      const itemElements = cart.map(function (item) {
        const article = document.createElement("article");
        article.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = "";
        image.width = 96;
        image.height = 96;

        const info = document.createElement("div");
        info.className = "cart-item-info";
        const heading = document.createElement("h2");
        heading.textContent = item.name;
        const priceNote = document.createElement("p");
        priceNote.textContent = catalog.formatPrice(item.price) + " / fabric piece";
        const lineTotal = document.createElement("p");
        lineTotal.className = "line-total";
        lineTotal.textContent = "Subtotal: " + catalog.formatPrice(item.price * item.quantity);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";
        controls.setAttribute("aria-label", "Quantity for " + item.name);
        const decrease = createButton("−", "decrease", item);
        decrease.setAttribute("aria-label", "Decrease " + item.name + " quantity");
        const quantity = document.createElement("span");
        quantity.setAttribute("aria-live", "polite");
        quantity.textContent = String(item.quantity);
        const increase = createButton("+", "increase", item);
        increase.setAttribute("aria-label", "Increase " + item.name + " quantity");
        const remove = createButton("Remove", "remove", item);
        remove.className = "remove-item";

        controls.append(decrease, quantity, increase, remove);
        info.append(heading, priceNote, lineTotal, controls);
        article.append(image, info);
        return article;
      });
      cartItems.replaceChildren.apply(cartItems, itemElements);
    }

    if (summary) {
      summary.textContent = itemCount + (itemCount === 1 ? " fabric piece" : " fabric pieces");
    }

    const total = cart.reduce(function (amount, item) {
      return amount + item.price * item.quantity;
    }, 0);
    if (cartTotal) {
      cartTotal.textContent = "Total: " + catalog.formatPrice(total);
    }

    if (checkout) {
      checkout.href = itemCount ? "https://wa.me/2347034673506?text=" + encodeURIComponent(
        "Hello Qinit Apparel, I would like to order:\n" + cart.map(function (item) {
          return "- " + item.name + " (" + catalog.formatPrice(item.price) + " each) x " +
            item.quantity + " = " + catalog.formatPrice(item.price * item.quantity);
        }).join("\n") + "\nEstimated total: " + catalog.formatPrice(total) +
        "\nPlease confirm availability and delivery costs."
      ) : "#";
      checkout.setAttribute("aria-disabled", itemCount ? "false" : "true");
      checkout.tabIndex = itemCount ? 0 : -1;
    }
  }

  document.addEventListener("click", function (event) {
    const addButton = event.target.closest && event.target.closest("[data-product-id].add-to-cart");
    if (addButton) {
      const cart = readCart();
      if (cart === null) {
        renderCart(null);
        return;
      }

      const productId = addButton.dataset.productId;
      const product = products[productId];
      if (!product) {
        announce("This item is not available to add to your cart.", true);
        return;
      }
      const existing = cart.find(function (item) {
        return item.id === productId;
      });

      if (existing) {
        if (!Number.isSafeInteger(existing.quantity + 1)) {
          announce("That quantity is too large to add.", true);
          return;
        }
        existing.quantity += 1;
      } else {
        cart.push(Object.assign({}, product, { quantity: 1 }));
      }

      if (saveCart(cart)) {
        renderCart(cart);
        announce(product.name + " added to your cart.", false);
      }
      return;
    }

    const actionButton = event.target.closest && event.target.closest("[data-cart-action]");
    if (!actionButton) {
      return;
    }

    const cart = readCart();
    if (cart === null) {
      renderCart(null);
      return;
    }

    const productId = actionButton.dataset.productId;
    const item = cart.find(function (entry) {
      return entry.id === productId;
    });

    if (!item) {
      return;
    }

    if (actionButton.dataset.cartAction === "increase") {
      if (!Number.isSafeInteger(item.quantity + 1)) {
        announce("That quantity is too large to add.", true);
        return;
      }
      item.quantity += 1;
    } else if (actionButton.dataset.cartAction === "decrease") {
      item.quantity -= 1;
      if (item.quantity < 1) {
        cart.splice(cart.indexOf(item), 1);
      }
    } else if (actionButton.dataset.cartAction === "remove") {
      cart.splice(cart.indexOf(item), 1);
    }

    if (saveCart(cart)) {
      renderCart(cart);
      announce("Your cart has been updated.", false);
    }
  });

  const clearButton = document.querySelector("[data-cart-clear]");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      if (window.confirm("Remove all items from your cart?")) {
        if (saveCart([])) {
          renderCart([]);
          announce("Your cart is empty.", false);
        }
      }
    });
  }

  renderCart(readCart());
}());
