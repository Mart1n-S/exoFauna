// Fonction pour récupérer les paramètres de l'URL
function getParametreFromURL(nom) {
  const url = new URL(window.location.href);
  return url.searchParams.get(nom);
}
// Déclaration d'un objet vide pour stocker les articles avec leur ID comme clé
let articlesMap = {};

// Fonction pour créer dynamiquement des cartes d'articles dans le DOM
function createCards(container, article) {
  // Crée un élément div pour la carte d'article
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("produitsContainerImage");
  cardDiv.setAttribute("produit-id", article.id);

  // Crée un élément div pour contenir les détails de la carte
  const cardImageDiv = document.createElement("div");
  cardImageDiv.classList.add("produitsContainerImageCard");

  // Crée un élément img pour l'image de l'article
  const img = document.createElement("img");
  img.src = article.images[0];
  img.alt = "image d'un animal";
  img.classList.add("produitsContainerImageCardPhoto");

  // Gestion des événements de survol pour changer l'image
  img.addEventListener("mouseover", () => (img.src = article.images[1]));
  img.addEventListener("mouseout", () => (img.src = article.images[0]));

  // Crée un élément p pour le titre de l'article
  const title = document.createElement("p");
  title.classList.add("produitsContainerImageCardTitre");
  title.textContent = article.title;

  // Crée un élément p pour le prix de l'article
  const price = document.createElement("p");
  price.classList.add("produitsContainerImageCardPrix");

  // Vérifie s'il y a une réduction
  if (article.discount !== 0) {
    // Crée un élément span pour le prix initial
    const originalPriceSpan = document.createElement("span");
    originalPriceSpan.innerHTML = `${article.price.toFixed(2)}€`;

    // Ajoute l'élément span pour le prix initial à la balise p
    price.appendChild(originalPriceSpan);

    // Crée un élément span pour la réduction en pourcentage
    const discountSpan = document.createElement("span");
    discountSpan.classList.add("discount");
    discountSpan.textContent = `-${article.discount}%`;

    // Crée un deuxième élément span pour le prix remisé
    const discountedPriceSpan = document.createElement("span");
    discountedPriceSpan.innerHTML = `${(
      article.price *
      (1 - article.discount / 100)
    ).toFixed(2)}€`;

    // Ajoute les éléments span pour la réduction et le prix remisé à la balise p
    price.appendChild(discountSpan);
    price.appendChild(discountedPriceSpan);
  } else {
    // Si pas de réduction, ajoute directement le prix à la balise p
    price.innerHTML = `${article.price.toFixed(2)}€`;
  }

  // Crée un élément div pour les options
  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("categorieContainerImageCardOption");

  const valeurParametre = getParametreFromURL("categorie");
  if (valeurParametre) {
    // Ajoute l'option pour la sub_category
    const subCategoryOption = document.createElement("p");
    subCategoryOption.classList.add(
      "categorieContainerImageCardOptionSubCategory"
    );
    subCategoryOption.textContent = article.sub_category;
    optionsDiv.appendChild(subCategoryOption);

    // Boucle sur les features/options et crée un élément p pour chaque option
    for (const [key, value] of Object.entries(article.features)) {
      const option = document.createElement("p");
      option.classList.add("categorieContainerImageCardOption" + key);
      option.textContent = value;
      optionsDiv.appendChild(option);
    }
  }
  // Crée un bouton pour ajouter au panier + un gestionnaire d'événements au bouton pour ajouter au panier
  const addButton = document.createElement("button");
  addButton.classList.add("produitsContainerImageCardBouton");
  addButton.textContent = "Ajouter au panier";
  addButton.setAttribute("onclick", `addPanier(${article.id})`);

  // Crée un lien pour voir les détails
  const detailsLink = document.createElement("a");
  detailsLink.href = `templates/details.html?id=${article.id}`;
  detailsLink.classList.add("produitsContainerImageCardLien");
  detailsLink.textContent = "Voir détails";

  // Ajoute les éléments à la carte d'article
  cardImageDiv.appendChild(img);
  cardImageDiv.appendChild(title);
  cardImageDiv.appendChild(price);
  cardImageDiv.appendChild(optionsDiv);
  cardImageDiv.appendChild(addButton);
  cardImageDiv.appendChild(detailsLink);

  // Ajoute la carte d'article au conteneur spécifié dans le DOM
  cardDiv.appendChild(cardImageDiv);
  container.appendChild(cardDiv);

  // Ajoute l'article à l'objet articlesMap avec l'ID comme clé
  articlesMap[article.id] = article;
}
