document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const productDashboard = document.getElementById("productDashboard");
  const cart = document.getElementById("cart");
  const calculatePriceButton = document.getElementById("calculatePrice");


  let products = [];
  let cartItems = [];


  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productImage = document.getElementById("productImage").value;

    if (
      isNaN(productPrice) ||
      !["jpg", "png", "gif"].includes(productImage.split(".").pop())
    ) {
      alert("Please enter a valid price and image URL.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName,
      price: parseFloat(productPrice),
      image: productImage,
    };

    products.push(newProduct);
    renderProducts();
    productForm.reset();
  });


  function renderProducts() {
    productDashboard.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "bg-white p-4 rounded shadow-md";
      productCard.innerHTML = `
                <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-32 object-cover mb-4 rounded">
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-700">$${product.price.toFixed(2)}</p>
                <input type="checkbox" class="mt-2" data-product-id="${
                  product.id
                }">
            `;
      productDashboard.appendChild(productCard);
    });

    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", handleProductSelection);
    });
  }


  function handleProductSelection() {
    const selectedProductIds = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => parseInt(cb.dataset.productId));
    cartItems = products.filter((product) =>
      selectedProductIds.includes(product.id)
    );

    renderCart();
  }


  function renderCart() {
    cart.innerHTML = "";
    if (cartItems.length === 0) {
      cart.innerHTML = '<p class="text-gray-700">No items in the cart.</p>';
      calculatePriceButton.classList.add("hidden");
    } else {
      cartItems.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "flex justify-between items-center mb-4";
        cartItem.innerHTML = `
                    <img src="${item.image}" alt="${
          item.name
        }" class="w-16 h-16 object-cover rounded mr-4">
                    <div>
                        <h3 class="text-lg font-semibold">${item.name}</h3>
                        <p class="text-gray-700">$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded delete-btn"><i class="px-2 fa-solid fa-trash-can"></i>Delete</button>
                `;
            const deleteButton = cartItem.querySelector('.delete-btn');
            deleteButton.addEventListener('click', () => deleteItem(item.id));

            cart.appendChild(cartItem);
        });
        calculatePriceButton.classList.remove("hidden");
    }
  }

  function deleteItem(id) {
    cartItems = cartItems.filter((item) => item.id !== id);
    renderCart();
}


  calculatePriceButton.addEventListener("click", () => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalPriceDisplay = document.createElement("p");
    totalPriceDisplay.className = "text-lg font-semibold mt-4";
    totalPriceDisplay.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

    const existingTotalPriceDisplay = cart.querySelector(".total-price-display");
    if (existingTotalPriceDisplay) {
        cart.removeChild(existingTotalPriceDisplay);
    }

    totalPriceDisplay.classList.add("total-price-display");
    cart.appendChild(totalPriceDisplay);
  });
});
