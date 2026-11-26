(function () {
  "use strict";

  const ranges = {
    big: {
      label: "Big Range",
      title: "Big Range Fabrics",
      imageFolder: "big range/",
      sampleImage: "Big.jpg",
      defaultPrice: 16000,
      products: [
        { id: "big-01", name: "Big Fabric 1", image: "1.jpg", price: 14000 },
        { id: "big-02", name: "Big Fabric 2", image: "2.jpg", price: 14000 },
        { id: "big-03", name: "Big Fabric 3", image: "3.jpg", price: 14000 },
        { id: "big-04", name: "Big Fabric 4", image: "4.jpg", price: 16000 }
      ]
    },
    medium: {
      label: "Medium Range",
      title: "Medium Range Fabrics",
      imageFolder: "medium range/",
      sampleImage: "Main Qinit Apparel/Medium.jpg",
      defaultPrice: 6000,
      products: [
        { id: "medium-01", name: "Medium Fabric 01", image: "1.jpg", price: 6000 },
        { id: "medium-02", name: "Medium Fabric 02", image: "2.jpg", price: 6000 },
        { id: "medium-03", name: "Medium Fabric 03", image: "3.jpg", price: 6000 },
        { id: "medium-04", name: "Medium Fabric 04", image: "4.jpg", price: 6000 },
        { id: "medium-05", name: "Medium Fabric 05", image: "5.jpg", price: 6000 },
        { id: "medium-06", name: "Medium Fabric 06", image: "6.jpg", price: 6000 },
        { id: "medium-07", name: "Medium Fabric 07", image: "7.jpg", price: 6000 },
        { id: "medium-08", name: "Medium Fabric 08", image: "8.jpg", price: 6000 },
        { id: "medium-09", name: "Medium Fabric 09", image: "9.jpg" },
        { id: "medium-10", name: "Medium Fabric 10", image: "10.jpg" },
        { id: "medium-11", name: "Medium Fabric 11", image: "11.jpg" },
        { id: "medium-12", name: "Medium Fabric 12", image: "12.jpg" },
        { id: "medium-13", name: "Medium Fabric 13", image: "13.jpg" },
        { id: "medium-14", name: "Medium Fabric 14", image: "14.jpg" },
        { id: "medium-15", name: "Medium Fabric 15", image: "15.jpg" },
        { id: "medium-16", name: "Medium Fabric 16", image: "16.jpg" },
        { id: "medium-17", name: "Medium Fabric 17", image: "17.jpg" },
        { id: "medium-18", name: "Medium Fabric 18", image: "18.jpg" },
        { id: "medium-19", name: "Medium Fabric 19", image: "19.jpg" },
        { id: "medium-20", name: "Medium Fabric 20", image: "20.jpg" },
        { id: "medium-21", name: "Medium Fabric 21", image: "21.jpg" },
        { id: "medium-22", name: "Medium Fabric 22", image: "22.jpg" },
        { id: "medium-23", name: "Medium Fabric 23", image: "23.jpg" }
      ]
    },
    small: {
      label: "Small Range",
      title: "Small Range Fabrics",
      imageFolder: "small range/",
      sampleImage: "Main Qinit Apparel/Small.jpg",
      defaultPrice: 4000,
      products: [
        { id: "small-01", name: "Small Fabric", image: "IMG-20261120-WA0001.jpg" },
        { id: "small-02", name: "Small Fabric", image: "IMG-20261120-WA0002.jpg" },
        { id: "small-03", name: "Small Fabric", image: "IMG-20261120-WA0003.jpg" },
        { id: "small-04", name: "Small Fabric", image: "IMG-20261120-WA0004.jpg" },
        { id: "small-05", name: "Small Fabric", image: "IMG-20261120-WA0005.jpg" },
        { id: "small-06", name: "Small Fabric", image: "IMG-20261120-WA0006.jpg" },
        { id: "small-07", name: "Small Fabric", image: "IMG-20261120-WA0007.jpg" },
        { id: "small-08", name: "Small Fabric", image: "IMG-20261120-WA0008.jpg" },
        { id: "small-09", name: "Small Fabric", image: "IMG-20261120-WA0009.jpg" },
        { id: "small-10", name: "Small Fabric", image: "IMG-20261120-WA0010.jpg" },
        { id: "small-11", name: "Small Fabric", image: "IMG-20261120-WA0011.jpg" },
        { id: "small-12", name: "Small Fabric", image: "IMG-20261120-WA0012.jpg" },
        { id: "small-13", name: "Small Fabric", image: "IMG-20261120-WA0013.jpg" },
        { id: "small-14", name: "Small Fabric", image: "IMG-20261120-WA0014.jpg" },
        { id: "small-15", name: "Small Fabric", image: "IMG-20261120-WA0015.jpg" },
        { id: "small-16", name: "Small Fabric", image: "IMG-20261120-WA0016.jpg" },
        { id: "small-17", name: "Small Fabric", image: "IMG-20261120-WA0017.jpg" },
        { id: "small-18", name: "Small Fabric", image: "IMG-20261120-WA0018.jpg" },
        { id: "small-19", name: "Small Fabric", image: "IMG-20261120-WA0019.jpg" },
        { id: "small-20", name: "Small Fabric", image: "IMG-20261120-WA0020.jpg" },
        { id: "small-21", name: "Small Fabric", image: "IMG-20261120-WA0021.jpg" },
        { id: "small-22", name: "Small Fabric", image: "IMG-20261120-WA0022.jpg" },
        { id: "small-23", name: "Small Fabric", image: "IMG-20261120-WA0023.jpg" }
      ]
    }
  };

  const products = Object.create(null);
  const priceFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  });

  Object.keys(ranges).forEach(function (rangeId) {
    const range = ranges[rangeId];
    range.id = rangeId;
    range.products = range.products.map(function (entry) {
      if (!entry || typeof entry.id !== "string" || !entry.id ||
          typeof entry.name !== "string" || !entry.name ||
          typeof entry.image !== "string" || !entry.image) {
        throw new Error("Every catalog product needs an id, name, and image filename.");
      }

      const product = {
        id: entry.id,
        name: entry.name,
        image: range.imageFolder + entry.image,
        price: entry.price === undefined ? range.defaultPrice : entry.price,
        range: range.label
      };

      if (!Number.isSafeInteger(product.price) || product.price < 1) {
        throw new Error("Catalog prices must be whole Naira amounts greater than zero.");
      }
      if (products[product.id]) {
        throw new Error("Catalog product IDs must be unique: " + product.id);
      }

      products[product.id] = product;
      return product;
    });

    const sampleId = rangeId + "-range";
    if (products[sampleId]) {
      throw new Error("Catalog product IDs cannot use the reserved ID: " + sampleId);
    }
    products[sampleId] = {
      id: sampleId,
      name: range.label + " (assorted)",
      image: range.sampleImage,
      price: range.defaultPrice,
      range: range.label
    };
  });

  window.QinitCatalog = {
    ranges: ranges,
    products: products,
    formatPrice: function (amount) {
      return priceFormatter.format(amount);
    }
  };
}());
