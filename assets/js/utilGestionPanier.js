// Fonction pour calculer le prix de chaque produit
function calculateItemPrice(item) {
  return item.discount ? item.price * (1 - item.discount / 100) : item.price;
}

// Fonction pour calculer le nouveau prix total
function calculateTotalPrice(panierItems) {
  return panierItems.reduce((total, item) => {
    const itemPrice = calculateItemPrice(item);
    return total + itemPrice * item.quantity;
  }, 0);
}

// Fonction pour mettre à jour le prix
function updateTotalPrice() {
  const panierItems = JSON.parse(localStorage.getItem("panier")) || [];
  const totalPrice = calculateTotalPrice(panierItems);

  const totalPanierElement = document.getElementById("totalPanier");
  totalPanierElement.textContent = totalPrice.toFixed(2) + "€";
}

function clearPanierContent(container) {
  container.innerHTML = "";
}

//Fonction pour mettre à jour la quantité d'un produit dans le local storage
function updateQuantityInLocalStorage(productId, newQuantity) {
  const panierItems = JSON.parse(localStorage.getItem("panier")) || [];
  const targetItem = panierItems.find((item) => item.id === productId);

  if (targetItem) {
    targetItem.quantity = newQuantity;
    setPanierInLocalStorage(panierItems);
  }
}

// Fonction pour récupérer le local storage
function getPanierFromLocalStorage() {
  return JSON.parse(localStorage.getItem("panier")) || [];
}
//Fonction pour mettre à jour le local storage
function setPanierInLocalStorage(panierItems) {
  localStorage.setItem("panier", JSON.stringify(panierItems));
}

function removeItemFromLocalStorage(articleId) {
  let panierItems = getPanierFromLocalStorage();

  // Filtrer les articles pour exclure celui à supprimer
  panierItems = panierItems.filter((item) => item.id !== articleId);

  // Met à jour le panier dans le localStorage
  setPanierInLocalStorage(panierItems);
}

function displayPanierItem(container, item) {
  const cardHTML = createPanierItemHTML(container, item);
  container.appendChild(cardHTML);
}

function updatePanierDisplay(container) {
  clearPanierContent(container);

  const panierItems = JSON.parse(localStorage.getItem("panier")) || [];

  panierItems.forEach((item) => {
    displayPanierItem(container, item);
  });

  updateTotalPrice();
}

function confirmAndClearLocalStorage(container) {
  const containerCible = document.getElementById(container);
  const confirmation = confirm(
    "Êtes-vous sûr de vouloir vider votre panier ? Cela supprimera tout."
  );

  if (confirmation) {
    clearLocalStorage(containerCible);
    // Vous pouvez ajouter d'autres actions ici si nécessaire
  }
}

// Fonction pour vider le panier
function clearLocalStorage(container) {
  localStorage.clear();
  updatePanierDisplay(container);
}
