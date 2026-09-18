// ===== Добавление товара в корзину =====
const buttons = document.querySelectorAll(".buy");

if (buttons.length > 0) {
  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      const productCard = button.closest(".product");

      if (!productCard) {
        console.log("Карточка товара не найдена");
        return;
      }

      const title = productCard.querySelector(".product-title").textContent.trim();
      const priceText = productCard.querySelector(".product-price").textContent;
      const price = Number(priceText.replace(/[^0-9]/g, ""));

      // Получаем текущую корзину
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Проверяем, есть ли уже такой товар
      const existing = cart.find(function(item) {
        return item.title === title;
      });

      if (existing) {
        // Если товар уже есть — увеличиваем количество
        existing.quantity += 1;
      } else {
        // Если нет — добавляем новый
        cart.push({
          title: title,
          price: price,
          quantity: 1
        });
      }

      // Сохраняем
      localStorage.setItem("cart", JSON.stringify(cart));

      // Меняем кнопку
      button.textContent = "Добавлено";
      button.style.backgroundColor = "green";
      button.style.color = "white";

      console.log("Корзина обновлена:", cart);
    });
  });
}

// ===== Отображение корзины =====
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const table = document.querySelector("table");

  if (!table) return;

  // Удаляем все строки кроме заголовка
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  let total = 0;

  cart.forEach(function(item) {
    const sum = item.price * item.quantity;
    total += sum;

    const row = table.insertRow();
    row.innerHTML = `
      <td>${item.title}</td>
      <td class="price">${item.price.toLocaleString()} ₸</td>
      <td>
        <input type="number" class="quantity" value="${item.quantity}" min="0">
      </td>
      <td class="sum">${sum.toLocaleString()} ₸</td>
    `;
  });

  // Строка итога
  const totalRow = table.insertRow();
  totalRow.innerHTML = `
    <td colspan="3"><strong>Итого:</strong></td>
    <td class="total">${total.toLocaleString()} ₸</td>
  `;
}

// Запускаем отрисовку только на странице корзины
if (window.location.href.includes("cart.html")) {
  renderCart();
}
// ===== Очистить корзину =====
const clearBtn = document.querySelector("#clear-cart");

if (clearBtn) {
  clearBtn.addEventListener("click", function() {
    localStorage.removeItem("cart");

    // Если есть функция отрисовки — обновляем таблицу
    if (typeof renderCart === "function") {
      renderCart();
    }

    alert("Корзина очищена");
  });
}

// ===== После оформления заказа =====
const submitOrderBtn = document.querySelector("#submit-order");

if (submitOrderBtn) {
  submitOrderBtn.addEventListener("click", function(event) {
    event.preventDefault(); // чтобы форма не перезагружала страницу

    // Очищаем корзину
    localStorage.removeItem("cart");

    alert("Заказ оформлен! Спасибо за покупку.");

    // Переходим на главную (по желанию)
    window.location.href = "index.html";
  });
}
// ===== Фильтр товаров =====
const filterForm = document.querySelector("#filter-form");
const products = document.querySelectorAll(".product");

if (filterForm && products.length > 0) {
  filterForm.addEventListener("submit", function(event) {
    event.preventDefault(); // не перезагружаем страницу

    // Какие типы выбраны
    const checked = document.querySelectorAll('input[name="type"]:checked');
    const selectedTypes = [];

    checked.forEach(function(checkbox) {
      selectedTypes.push(checkbox.value);
    });

    // Если ничего не выбрано — показываем все товары
    if (selectedTypes.length === 0) {
      products.forEach(function(product) {
        product.style.display = "block";
      });
      return;
    }

    // Показываем только подходящие
    products.forEach(function(product) {
      const type = product.dataset.type; // data-type

      if (selectedTypes.includes(type)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });

  // Кнопка "Сбросить"
  const resetBtn = document.querySelector("#reset-filter");
  if (resetBtn) {
    resetBtn.addEventListener("click", function() {
      products.forEach(function(product) {
        product.style.display = "block";
      });
    });
  }
}
function filterBySearch(text) {
  const items = document.querySelectorAll(".product");
  text = (text || "").toLowerCase().trim();

  items.forEach(function(item) {
    const title = item.textContent.toLowerCase();

    if (text === "" || title.includes(text)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Берём запрос из адреса
const query = new URLSearchParams(window.location.search).get("q");

// Фильтруем сразу, если есть запрос
if (query) {
  filterBySearch(query);
}

// Если поле поиска есть — подставляем текст и включаем живой поиск
const searchInput = document.querySelector("#search");

if (searchInput) {
  if (query) {
    searchInput.value = query;
  }

  searchInput.addEventListener("input", function() {
    filterBySearch(searchInput.value);
  });
}
<!--Калькулятор на корзину-->
const quantities = document.querySelectorAll(".quantity");

function updateCart() {
  let total = 0;

  quantities.forEach(function(input) {
    const row = input.closest("tr");
    const priceCell = row.querySelector(".price");
    const sumCell = row.querySelector(".sum");

    const price = Number(priceCell.textContent.replace(/[^0-9]/g, ""));
    const quantity = Number(input.value) || 0;
    const sum = price * quantity;

    sumCell.textContent = sum.toLocaleString() + " ₸";
    total += sum;
  });

  // Записываем общий итог
  const totalCell = document.querySelector(".total");
  if (totalCell) {
    totalCell.textContent = total.toLocaleString() + " ₸";
  }
}

// Считаем при изменении любого количества
quantities.forEach(function(input) {
  input.addEventListener("input", updateCart);
});

// Сразу считаем один раз при загрузке страницы
updateCart();