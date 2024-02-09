document.addEventListener("DOMContentLoaded", async function () {
  const valeurParametre = getParametreFromURL("id");

  // On récupère les div qui vont contenir les informations
  const containers = {
    details: document.getElementById("details"),
    description: document.getElementById("description"),
  };

  try {
    // Chargement des données JSON depuis le fichier
    const response = await fetch("../assets/js/bdd.json");
    const jsonData = await response.json();

    const articlesMap = {};
    Object.keys(jsonData.articles).forEach((categorie) => {
      jsonData.articles[categorie].forEach((article) => {
        articlesMap[article.id] = article;
      });
    });

    const selectedArticle = articlesMap[valeurParametre];

    // Vérifie si le produit a été trouvé
    if (selectedArticle) {
      // Utilise le produit pour générer la section des détails

      generateDetailsSection(containers, selectedArticle);
    } else {
      console.error("Produit non trouvé");
    }

    setTimeout(function () {
      $(".slider-for").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: ".slider-nav",
      });
      $(".slider-nav").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: ".slider-for",
        dots: false,
        centerMode: true,
        focusOnSelect: true,
      });
    }, 100);
  } catch (error) {}
});

function generateDetailsSection(containers, product) {
  // Crée le conteneur des détails
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("detailsContainer");

  // Crée le carrousel d'images
  const imagesForContainer = document.createElement("div");
  imagesForContainer.classList.add("detailsContainerImagesFor", "slider-for");
  product.images.forEach((imageSrc) => {
    const image = document.createElement("img");
    image.src = imageSrc;
    image.alt = `image du produit`;
    image.classList.add("detailsContainerImagesForContent");
    imagesForContainer.appendChild(image);
  });

  // Crée la navigation du carrousel
  const imagesNavContainer = document.createElement("div");
  imagesNavContainer.classList.add("detailsContainerImagesNav", "slider-nav");
  product.images.forEach((imageSrc) => {
    const image = document.createElement("img");
    image.src = imageSrc;
    image.alt = `image du produit`;
    image.classList.add("detailsContainerImagesNavContent");
    imagesNavContainer.appendChild(image);
  });

  // Ajoute les éléments au conteneur des détails
  detailsContainer.appendChild(imagesForContainer);
  detailsContainer.appendChild(imagesNavContainer);

  // Crée le conteneur du contenu des détails
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("detailsContainerContent");

  // Ajoute les détails du produit au conteneur du contenu
  const title = document.createElement("h2");
  title.classList.add("detailsContainerContentTitle");
  title.textContent = product.title;

  const price = document.createElement("p");
  price.classList.add("detailsContainerContentPrix");

  if (product.discount !== 0) {
    const originalPriceSpan = document.createElement("span");
    originalPriceSpan.textContent = `${product.price.toFixed(2)}€`;
    price.appendChild(originalPriceSpan);

    const discountSpan = document.createElement("span");
    discountSpan.classList.add("discount");
    discountSpan.textContent = `-${product.discount}%`;
    price.appendChild(discountSpan);

    const discountedPriceSpan = document.createElement("span");
    discountedPriceSpan.textContent = `${(
      product.price *
      (1 - product.discount / 100)
    ).toFixed(2)}€`;
    price.appendChild(discountedPriceSpan);
  } else {
    // Si pas de réduction, ajoute directement le prix à la balise p
    price.innerHTML = `${product.price.toFixed(2)}€`;
  }

  const featuresTitle = document.createElement("p");
  featuresTitle.classList.add("detailsContainerContentCaracteristiques");
  featuresTitle.textContent = "Caractéristiques :";

  const featuresList = document.createElement("div");
  featuresList.classList.add("detailsContainerContentFeatures");

  const categoryOption = document.createElement("p");
  categoryOption.classList.add("detailsContainerContentFeaturesCategory");
  categoryOption.textContent = product.category;
  featuresList.appendChild(categoryOption);

  const subCategoryOption = document.createElement("p");
  subCategoryOption.classList.add("detailsContainerContentFeaturesSubCategory");
  subCategoryOption.textContent = product.sub_category;
  featuresList.appendChild(subCategoryOption);

  for (const [key, value] of Object.entries(product.features)) {
    const option = document.createElement("p");
    option.classList.add("detailsContainerContentFeatures" + key);
    option.textContent = value;
    featuresList.appendChild(option);
  }

  const gestionContainer = document.createElement("div");
  gestionContainer.classList.add("detailsContainerContentGestion");

  const moinsButton = document.createElement("button");
  moinsButton.classList.add("detailsContainerContentGestionMoins");
  moinsButton.setAttribute("idproduitmoins", product.id);
  moinsButton.innerHTML =
    '<span class="material-symbols-outlined">remove</span>';
  moinsButton.addEventListener("click", () => adjustQuantity(product.id, -1));

  const inputQuantity = document.createElement("input");
  inputQuantity.classList.add("detailsContainerContentGestionInput");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.setAttribute("value", "1");
  inputQuantity.setAttribute("min", "1");
  inputQuantity.setAttribute("idproduitinput", product.id);

  const plusButton = document.createElement("button");
  plusButton.classList.add("detailsContainerContentGestionPlus");
  plusButton.setAttribute("idproduitplus", product.id);
  plusButton.innerHTML = '<span class="material-symbols-outlined">add</span>';
  plusButton.addEventListener("click", () => adjustQuantity(product.id, 1));

  gestionContainer.appendChild(moinsButton);
  gestionContainer.appendChild(inputQuantity);
  gestionContainer.appendChild(plusButton);

  const addToCartButton = document.createElement("button");
  addToCartButton.classList.add("detailsContainerContentAjout");
  addToCartButton.setAttribute("onclick", `addPanier(${product.id})`);
  addToCartButton.setAttribute("tabindex", "0");
  addToCartButton.textContent = "Ajouter au panier";

  // Ajoute les éléments au conteneur du contenu
  contentContainer.appendChild(title);
  contentContainer.appendChild(price);
  contentContainer.appendChild(featuresTitle);
  contentContainer.appendChild(featuresList);
  contentContainer.appendChild(gestionContainer);
  contentContainer.appendChild(addToCartButton);

  const MAX_DESCRIPTION_LENGTH = 150;

  const containerText = document.createElement("div");
  containerText.classList.add("descriptionContent");

  const descriptionText = document.createElement("p");
  descriptionText.classList.add("descriptionContentTexte");

  let truncatedDescription = product.description.substring(
    0,
    MAX_DESCRIPTION_LENGTH
  );
  let fullDescriptionHidden =
    product.description.length > MAX_DESCRIPTION_LENGTH;

  // Ajoute "..." si la description est tronquée
  if (fullDescriptionHidden) {
    truncatedDescription += " ... ";
    descriptionText.textContent = truncatedDescription;
  }

  const voirPlusButton = document.createElement("button");
  voirPlusButton.classList.add("descriptionContentButton");
  voirPlusButton.textContent = "Voir plus";

  voirPlusButton.onclick = () => {
    // Remplace la description tronquée par la description complète
    descriptionText.textContent = product.description;
    // Cache le bouton "Voir plus"
    voirPlusButton.style.display = "none";
    // Affiche le bouton "Voir moins"
    voirMoinsButton.style.display = "inline-block";
  };

  const voirMoinsButton = document.createElement("button");
  voirMoinsButton.classList.add("descriptionContentButton");
  voirMoinsButton.textContent = "Voir moins";
  voirMoinsButton.style.display = "none"; 

  voirMoinsButton.onclick = () => {
    // Remplace la description complète par la description tronquée
    descriptionText.textContent = truncatedDescription;
    // Cache le bouton "Voir moins"
    voirMoinsButton.style.display = "none";
    // Affiche le bouton "Voir plus"
    voirPlusButton.style.display = "inline-block";
  };

  // Ajoute la description au conteneur de la section de description + boutons
  containerText.appendChild(descriptionText);
  containerText.appendChild(voirPlusButton);
  containerText.appendChild(voirMoinsButton);
  containers.description.appendChild(containerText);
  // Ajoute les conteneurs des détails à la section principale
  containers.details.appendChild(detailsContainer);
  containers.details.appendChild(contentContainer);

  articlesMap[product.id] = product;
}

// Fonction pour ajuster la quantité
function adjustQuantity(productId, change) {
  const inputElement = document.querySelector(
    `.detailsContainerContentGestionInput[idproduitinput="${productId}"]`
  );

  if (inputElement) {
    let currentQuantity = parseInt(inputElement.value, 10);
    currentQuantity += change;

    currentQuantity = Math.max(currentQuantity, 1);

    inputElement.value = currentQuantity;

    // Mettre à jour la fonction addPanier dans l'attribut onclick
    const addButton = document.querySelector(".detailsContainerContentAjout");

    if (addButton) {
      addButton.setAttribute(
        "onclick",
        `addPanier(${productId},${currentQuantity})`
      );
    }
  }
}
