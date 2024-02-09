window.onload = function () {
    const panierCardContainerContent = document.getElementById("panierCardContainerContent");

    updatePanierDisplay(panierCardContainerContent);
  };

// Fonction pour créer le HTML d'un élément de panier sur la page panier
function createPanierItemHTML(containerCible,article) {
    // Créer les éléments HTML
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("panierCardContainerContent");

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("panierCardContainerContentCard");

    const img = document.createElement("img");
    img.src = article.image;
    img.alt = "image d'un animal";
    img.classList.add("produitsContainerImageCardPhotoT");

    const textDiv = document.createElement("div");
    textDiv.classList.add("panierCardContainerContentCardText");

    const titleP = document.createElement("p");
    titleP.classList.add("panierCardContainerContentCardTextTitre");
    titleP.textContent = article.title;

    const priceP = document.createElement("p");
    priceP.classList.add("panierCardContainerContentCardTextPrix");

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
    gestionDiv.classList.add("panierCardContainerContentGestion");

    const moinsButton = document.createElement("button");
    moinsButton.classList.add("panierCardContainerContentGestionMoins");
    moinsButton.innerHTML = '<span class="material-symbols-outlined">remove</span>';
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
    input.classList.add("panierCardContainerContentGestionInput");
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
            updateQuantityInLocalStoragePage(article.id, newQuantity);
        }

        // Mettre à jour l'affichage du panier et le prix total
        updatePanierDisplay(containerCible);
    });

    const plusButton = document.createElement("button");
    plusButton.classList.add("panierCardContainerContentGestionPlus");
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
    deleteButton.classList.add("panierCardContainerContentGestionDelete");
    deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
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
