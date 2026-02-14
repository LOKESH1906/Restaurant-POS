let items = JSON.parse(localStorage.getItem("items")) || [];
let cart = [];
let editIndex = null;

function renderItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";
  items.forEach((item, i) => {
    list.innerHTML += `
      <div class="item" onclick="addToCart(${i})">
        <img src="${item.image}">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
      </div>`;
  });
}

function addToCart(index) {
  let existing = cart.find((c) => c.name === items[index].name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...items[index], qty: 1 });
  }
  renderCart();
}

function renderCart() {
  let total = 0;
  let count = 0;

  const cartBody = document.getElementById("cartItems");
  cartBody.innerHTML = "";

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    cartBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <button onclick="changeQty(${index}, -1)">-</button>
                    ${item.qty}
                    <button onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>₹${item.price}</td>
                <td>₹${itemTotal}</td>
            </tr>
        `;
  });

  document.getElementById("totalItems").innerText = count;
  document.getElementById("totalAmount").innerText = total;
}

function changeQty(i, val) {
  cart[i].qty += val;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  renderCart();
}

function showQR() {
  if (!cart || cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  const qr = localStorage.getItem("qr");
  if (!qr) {
    alert("Upload QR in management");
    return;
  }
  document.getElementById("qrImage").src = qr;
  document.getElementById("qrModal").style.display = "flex";
}

function completeOrder() {
  // Clear cart array
  cart = [];

  // Clear cart table UI
  document.getElementById("cartItems").innerHTML = "";

  // Reset totals
  document.getElementById("totalItems").innerText = "0";
  document.getElementById("totalAmount").innerText = "0";

  // Close modal
  document.getElementById("qrModal").style.display = "none";

  // Navigate to fresh index page
  window.location.replace("index.html");
}

function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

// function closeQR() {
//   document.getElementById("qrModal").style.display = "none";
// }

function closeQR() {
  document.getElementById("qrModal").style.display = "none";
}

function completePayment() {
  orders.push({
    date: new Date().toISOString(),
    items: cart,
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  updateCart();
  closeQR();

  setTimeout(() => location.reload(), 1000);
}

function checkLogin() {
  const pass = document.getElementById("adminPass").value;
  if (pass === "2026") {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("manageModal").style.display = "flex";
    renderManage();
  } else alert("Wrong Password");
}

function addItem() {
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const file = document.getElementById("itemImage").files[0];
  if (!name || !price) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = { name, price: Number(price), image: e.target.result };
    if (editIndex !== null) {
      items[editIndex] = data;
      editIndex = null;
    } else items.push(data);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
    renderManage();
  };
  if (file) reader.readAsDataURL(file);
}

function renderManage() {
  const m = document.getElementById("manageList");
  m.innerHTML = "";
  items.forEach((it, i) => {
    m.innerHTML += `
      <p>${it.name} - ₹${it.price}
      <button onclick="editItem(${i})">Edit</button>
      <button onclick="deleteItem(${i})">Delete</button>
      </p>`;
  });
}

function editItem(i) {
  document.getElementById("itemName").value = items[i].name;
  document.getElementById("itemPrice").value = items[i].price;
  editIndex = i;
}

function deleteItem(i) {
  items.splice(i, 1);
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
  renderManage();
}

function uploadQR(e) {
  const reader = new FileReader();
  reader.onload = function (ev) {
    localStorage.setItem("qr", ev.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
}

function closeManage() {
  document.getElementById("manageModal").style.display = "none";
}

renderItems();
