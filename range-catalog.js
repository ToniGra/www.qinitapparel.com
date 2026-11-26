(function () {
  "use strict";

  const catalog = window.QinitCatalog;
  const grid = document.querySelector("[data-catalog-grid]");
  const pageTitle = document.querySelector("[data-catalog-title]");
  const pageDescription = document.querySelector("[data-catalog-description]");
  const range = catalog && catalog.ranges[document.body.dataset.range];

  if (!catalog || !grid || !range) {
    throw new Error("This fabric catalog page is not configured correctly.");
  }

  document.title = range.title + " | Qinit Apparel";
  pageTitle.textContent = range.title;
  pageDescription.textContent = range.products.length
    ? "Choose a fabric below. All prices are per fabric piece."
    : "Price: " + catalog.formatPrice(range.defaultPrice) +
      " per fabric piece. Add products to range-products.js to list 20 or more photos here.";

  if (range.products.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "catalog-empty";
    emptyState.textContent = "Fabric photos are coming soon. Add each photo filename and product name to range-products.js, then save the photo in " + range.imageFolder + " to list it here.";
    grid.appendChild(emptyState);
    return;
  }

  range.products.forEach(function (product) {
    const card = document.createElement("article");
    card.className = "fabric-card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.addEventListener("error", function () {
      const message = document.createElement("p");
      message.className = "image-error";
      message.textContent = "Photo not found: " + product.image;
      image.replaceWith(message);
    }, { once: true });

    const details = document.createElement("div");
    details.className = "fabric-details";

    const name = document.createElement("h2");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "fabric-price";
    price.textContent = catalog.formatPrice(product.price) + " / fabric piece";

    const addButton = document.createElement("button");
    addButton.className = "btn btn-blue add-to-cart";
    addButton.type = "button";
    addButton.dataset.productId = product.id;
    addButton.textContent = "Add to Cart";

    details.append(name, price, addButton);
    card.append(image, details);
    grid.appendChild(card);
  });
}());
