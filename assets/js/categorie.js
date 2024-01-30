document.addEventListener("DOMContentLoaded", async function () {
  // Fonction pour récupérer les paramètres de l'URL
  function getParametreFromURL(nom) {
    const url = new URL(window.location.href);
    return url.searchParams.get(nom);
  }

  // Récupère la valeur du paramètre 'categorie' dans l'URL
  const valeurParametre = getParametreFromURL("categorie");

  try {
    // Chargement des données JSON depuis le fichier
    const response = await fetch("../assets/js/bdd.json");
    const jsonData = await response.json();

    // Liste des catégories disponibles
    const categories = Object.keys(jsonData.articles);
    const subTitleElement = document.getElementById("subTitle");

    if (categories.includes(valeurParametre)) {
      // Si la catégorie existe, affiche le titre de la page
      const resultatElement = document.getElementById("titleCategorie");

      // Mise à jour des labels en fonction du paramètre dans l'URL
    const labelStade = document.querySelector('label[for="caracteristique1"]');
    const labelSexe = document.querySelector('label[for="caracteristique2"]');

    if (valeurParametre === "alimentation") {
      labelStade.textContent = "Pour :";
      labelSexe.textContent = "Par :";
    }

      if (resultatElement) {
        resultatElement.textContent = valeurParametre;
        document.title = "Catégorie | " + valeurParametre;
      }

      if (subTitleElement) {
        // Logique conditionnelle pour définir le texte en fonction de la catégorie
        switch (valeurParametre) {
          case "amphibiens":
            subTitleElement.textContent =
              "Grenouilles, Salamandres, Crapauds...";
            break;
          case "serpents":
            subTitleElement.textContent = "Pythons, Boas, Couleuvres...";
            break;
          case "invertebres":
            subTitleElement.textContent = "Araignées, Phasmes, Iules...";
            break;
          case "lezards":
            subTitleElement.textContent = "Agames, Iguanes, Geckos...";
            break;
          case "alimentation":
            subTitleElement.textContent = "Blattes, Souris, Collemboles...";
            break;
          default:
            subTitleElement.textContent = "";
        }
      }

      // Récupère les sous-catégories spécifiques à la catégorie en cours
      const sousCategories = getSousCategories(
        jsonData.articles[valeurParametre]
      );
      createOptions("sousCategorie", sousCategories);

      // Récupère les stades spécifiques à la catégorie en cours
      const stades = getStades(jsonData.articles[valeurParametre]);
      createOptions("caracteristique1", stades);

      // Récupère les sexes spécifiques à la catégorie en cours
      const sexes = getSexes(jsonData.articles[valeurParametre]);
      createOptions("caracteristique2", sexes);

      const containerCategorie = document.getElementById("cardCategorie");
      const produits = jsonData.articles[valeurParametre];
      // Appelle la fonction pour créer les cards avec les articles filtrés
      createCards(containerCategorie, produits);
    } else {
      // Si la catégorie n'existe pas, affiche un message d'erreur
      const resultatElement = document.getElementById("titleCategorie");

      if (resultatElement) {
        resultatElement.textContent = "Erreur";
        document.title = "Erreur";
        subTitleElement.textContent = "Catégorie inexistante";

        // Supprime la section avec la classe "categorie"
        const categorieSection = document.querySelector(".categorie");

        if (categorieSection) {
          categorieSection.remove();
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données JSON", error);
  }
});

function getSousCategories(articles) {
  const sousCategories = new Set();
  articles.forEach((article) => {
    sousCategories.add(article.sub_category);
  });
  return Array.from(sousCategories);
}

function getStades(articles) {
  const stades = new Set();
  articles.forEach((article) => {
    stades.add(article.features.feature1);
  });
  return Array.from(stades);
}

function getSexes(articles) {
  const sexes = new Set();
  articles.forEach((article) => {
    sexes.add(article.features.feature2);
  });
  return Array.from(sexes);
}

function createOptions(selectId, optionsArray) {
  const selectElement = document.getElementById(selectId);
  // Supprime les anciennes options
  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
  // Ajoute l'option de choix initial non cliquable et non visible
  const defaultOption = document.createElement("option");
  defaultOption.textContent = "--Choisir--";
  defaultOption.value = "tous";
  // defaultOption.hidden = true;
  selectElement.appendChild(defaultOption);
  // Ajoute les nouvelles options
  optionsArray.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = option.textContent = optionValue;
    selectElement.appendChild(option);
  });
}

// Fonction pour créer les cards à partir des données
function createCards(container, articles) {
  articles.forEach((article) => {
    // Crée un nouvel élément div pour la card
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("produitsContainerImage");
    cardDiv.setAttribute("produit-id", article.id);

    // Crée un nouvel élément div pour contenir les infos de la card
    const cardImageDiv = document.createElement("div");
    cardImageDiv.classList.add("produitsContainerImageCard");

    // Crée un élément img pour l'image de l'article
    const img = document.createElement("img");
    img.src = article.images[0];
    img.alt = "image d'un animal";
    img.classList.add("produitsContainerImageCardPhoto");

    // Ajoute un gestionnaire d'événements pour changer l'image au survol
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
      discountedPriceSpan.style.fontWeight = "bold";

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

    // Ajoute l'option pour la sub_category
    const subCategoryOption = document.createElement("p");
    subCategoryOption.classList.add(
      "categorieContainerImageCardOptionSubCategory"
    );
    subCategoryOption.textContent = article.sub_category; // Assurez-vous que le nom de la propriété est correct
    optionsDiv.appendChild(subCategoryOption);

    // Boucle sur les features/options et crée un élément p pour chaque option
    for (const [key, value] of Object.entries(article.features)) {
      const option = document.createElement("p");
      option.classList.add("categorieContainerImageCardOption" + key);
      option.textContent = value;
      optionsDiv.appendChild(option);
    }

    // Crée un bouton pour ajouter au panier
    const addButton = document.createElement("button");
    addButton.classList.add("produitsContainerImageCardBouton");
    addButton.textContent = "Ajouter au panier";

    // Crée un lien pour voir les détails
    const detailsLink = document.createElement("a");
    detailsLink.href = `templates/detail.html?id=${article.id}`;
    detailsLink.classList.add("produitsContainerImageCardLien");
    detailsLink.textContent = "Voir détails";

    // Ajoute les éléments à la card
    cardImageDiv.appendChild(img);
    cardImageDiv.appendChild(title);
    cardImageDiv.appendChild(price);
    cardImageDiv.appendChild(optionsDiv);
    cardImageDiv.appendChild(addButton);
    cardImageDiv.appendChild(detailsLink);

    // Ajoute la card à l'élément conteneur
    cardDiv.appendChild(cardImageDiv);
    container.appendChild(cardDiv);
  });
}
