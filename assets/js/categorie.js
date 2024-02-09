// Fonction pour obtenir les sous-catégories spécifiques à la catégorie en cours
function getSousCategories(articles) {
  const sousCategories = new Set();
  articles.forEach((article) => {
    sousCategories.add(article.sub_category);
  });
  return Array.from(sousCategories);
}

// Fonction pour obtenir les stades spécifiques à la catégorie en cours
function getStades(articles) {
  const stades = new Set();
  articles.forEach((article) => {
    stades.add(article.features.feature1);
  });
  return Array.from(stades);
}

// Fonction pour obtenir les sexes spécifiques à la catégorie en cours
function getSexes(articles) {
  const sexes = new Set();
  articles.forEach((article) => {
    sexes.add(article.features.feature2);
  });
  return Array.from(sexes);
}

// Fonction pour créer les options du sélecteur
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
  selectElement.appendChild(defaultOption);
  // Ajoute les nouvelles options
  optionsArray.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = option.textContent = optionValue;
    selectElement.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
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
      const labelStade = document.querySelector(
        'label[for="caracteristique1"]'
      );
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
      produits.forEach((produit) => {
        createCards(containerCategorie, produit);
      });
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
