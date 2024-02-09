// Ouverture modal
const panierModal = document.getElementById("panierModal");
const panierIcon = document.getElementById("panier");
const closeBtn = document.querySelector(".close");

// Fonction pour ouvrir la modal
const ouvrirModal = () => {
  panierModal.style.display = "block";
  panierModal.style.right = "0";
};

// Fonction pour fermer la modal
const fermerModal = () => {
  panierModal.style.right = "-100%";
};

// Événement de clic sur l'icône de panier pour ouvrir la modal
panierIcon.addEventListener("click", ouvrirModal);

// Événement de clic sur le bouton de fermeture pour fermer la modal
closeBtn.addEventListener("click", fermerModal);

// Au chargement de la page on update le panier comme ça si le local storage n'est pas vide on affiche les produits dans le panier
window.onload = function () {
  const modalPanierContainerContent = document.getElementById(
    "modalPanierContainerContent"
  );
  updatePanierDisplay(modalPanierContainerContent);
};

//Création du panier
function createPanierItemHTML(containerCible,article) {
  // Créer les éléments HTML
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("modalPanierContainerContent");

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("modalPanierContainerContentCard");

  const img = document.createElement("img");
  img.src = article.image;
  img.alt = "image d'un animal";
  img.classList.add("produitsContainerImageCardPhotoT");

  const textDiv = document.createElement("div");
  textDiv.classList.add("modalPanierContainerContentCardText");

  const titleP = document.createElement("p");
  titleP.classList.add("modalPanierContainerContentCardTextTitre");
  titleP.textContent = article.title;

  const priceP = document.createElement("p");
  priceP.classList.add("modalPanierContainerContentCardTextPrix");

  if (article.discount !== 0) {
    // S'il y a une réduction, afficher l'ancien prix, la réduction et le nouveau prix
    const discountedPrice = article.price * (1 - article.discount / 100);

    const oldPriceSpan = document.createElement("span");
    oldPriceSpan.innerHTML = `${article.price.toFixed(2)}€`;

    const discountSpan = document.createElement("span");
    discountSpan.textContent = `-${article.discount}%`;

    const newPriceSpan = document.createElement("span");
    newPriceSpan.innerHTML = `${discountedPrice.toFixed(2)}€`;

    priceP.appendChild(oldPriceSpan);
    priceP.appendChild(discountSpan);
    priceP.appendChild(newPriceSpan);
  } else {
    // Sinon, afficher simplement le prix sans réduction
    priceP.innerHTML = `${article.price.toFixed(2)}€`;
  }

  // Ajouter les éléments HTML à la structure
  textDiv.appendChild(titleP);
  textDiv.appendChild(priceP);

  cardDiv.appendChild(img);
  cardDiv.appendChild(textDiv);

  const gestionDiv = document.createElement("div");
  gestionDiv.classList.add("modalPanierContainerContentGestion");

  const moinsButton = document.createElement("button");
  moinsButton.classList.add("modalPanierContainerContentGestionMoins");
  moinsButton.innerHTML =
    '<span class="material-symbols-outlined">remove</span>';
  moinsButton.setAttribute("idProduitMoins", article.id);

  // Ajoute un gestionnaire d'événements pour décrémenter la quantité
  moinsButton.addEventListener("click", function () {
    // Récupère le panier depuis le localStorage
    let panierItems = JSON.parse(localStorage.getItem("panier")) || [];

    // Recherche l'article dans le panier par son identifiant
    const targetItem = panierItems.find((item) => item.id === article.id);

    if (targetItem) {
      // Décrémente la quantité
      targetItem.quantity -= 1;

      // Vérifie si la quantité atteint 0
      if (targetItem.quantity === 0) {
        // Supprime l'élément du panier
        panierItems = panierItems.filter((item) => item.id !== article.id);
      }

      // Met à jour le panier dans le localStorage
      setPanierInLocalStorage(panierItems);

      // Mettre à jour l'affichage du panier et le prix total
      updatePanierDisplay(containerCible);
    }
  });

  const input = document.createElement("input");
  input.classList.add("modalPanierContainerContentGestionInput");
  input.type = "number";
  input.value = article.quantity;
  input.setAttribute("idProduitInput", article.id);

  input.addEventListener("change", function () {
    const newQuantity = parseInt(input.value, 10);

    if (newQuantity <= 0) {
      // Si la nouvelle quantité est égale à 0, supprimer l'article du localStorage
      removeItemFromLocalStorage(article.id);
    } else {
      // Sinon, mise à jour de la quantité dans le localStorage
      updateQuantityInLocalStorage(article.id, newQuantity);
    }

    // Mettre à jour l'affichage du panier et le prix total
    updatePanierDisplay(containerCible);
  });

  const plusButton = document.createElement("button");
  plusButton.classList.add("modalPanierContainerContentGestionPlus");
  plusButton.innerHTML = '<span class="material-symbols-outlined">add</span>';
  // Ajoute l'identifiant unique au bouton "plus"
  plusButton.setAttribute("idProduitPlus", article.id);

  // Ajoute un gestionnaire d'événements pour incrémenter la quantité
  plusButton.addEventListener("click", function () {
    // Récupère le panier depuis le localStorage
    let panierItems = JSON.parse(localStorage.getItem("panier")) || [];

    // Recherche l'article dans le panier par son identifiant
    const targetItem = panierItems.find((item) => item.id === article.id);

    if (targetItem) {
      // Incrémente la quantité
      targetItem.quantity += 1;

      // Met à jour le panier dans le localStorage
      setPanierInLocalStorage(panierItems);

      // Mettre à jour l'affichage du panier et le prix total
      updatePanierDisplay(containerCible);
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("modalPanierContainerContentGestionDelete");
  deleteButton.innerHTML =
    '<span class="material-symbols-outlined">delete</span>';
  deleteButton.setAttribute("idProduitDelete", article.id);

  // Ajoute un gestionnaire d'événements pour supprimer l'article du panier
  deleteButton.addEventListener("click", function () {
    // Récupère le panier depuis le localStorage
    let panierItems = JSON.parse(localStorage.getItem("panier")) || [];

    // Filtrer les articles pour exclure celui à supprimer
    panierItems = panierItems.filter((item) => item.id !== article.id);

    // Met à jour le panier dans le localStorage
    setPanierInLocalStorage(panierItems);
    // Mettre à jour l'affichage du panier et le prix total
    updatePanierDisplay(containerCible);
  });

  // Ajouter les boutons à la structure
  gestionDiv.appendChild(moinsButton);
  gestionDiv.appendChild(input);
  gestionDiv.appendChild(plusButton);
  gestionDiv.appendChild(deleteButton);

  // Ajouter toutes les parties à l'élément principal
  itemDiv.appendChild(cardDiv);
  itemDiv.appendChild(gestionDiv);

  // Ajouter l'élément principal à la modal
  return itemDiv;
}

//Ajout du produit au panier
function addPanier(articleId,defaultQuantity=1) {
  const article = articlesMap[articleId];
  const modalPanierContainerContent = document.getElementById(
    "modalPanierContainerContent"
  );
  if (article) {
    // Récupère le panier depuis le local storage
    let panierItems = JSON.parse(localStorage.getItem("panier")) || [];

    // Vérifie si l'article est déjà dans le panier
    const existingItem = panierItems.find((item) => item.id === article.id);

    if (existingItem) {
      // Si l'article est déjà dans le panier, mettez à jour la quantité
      existingItem.quantity += defaultQuantity;
    } else {
      // Sinon, ajoutez un nouvel élément au panier
      const newItem = {
        id: article.id,
        image: article.images[0],
        title: article.title,
        price: article.price,
        discount: article.discount,
        quantity: defaultQuantity,
      };

      panierItems.push(newItem);
      // Appelle la fonction pour créer dynamiquement le contenu HTML de l'article dans la modal du panier
      createPanierItemHTML(modalPanierContainerContent,newItem);
    }

    // Met à jour le panier dans le local storage
    setPanierInLocalStorage(panierItems);

    updatePanierDisplay(modalPanierContainerContent);
  }
  alert('Produit(s) ajouté(s) au panier 🙌');
}
