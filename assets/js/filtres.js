const sousCategorie = document.getElementById("sousCategorie");
const stadeElement = document.getElementById("caracteristique1");
const sexeElement = document.getElementById("caracteristique2");
const triPrixElement = document.getElementById("triPrix");

sousCategorie.addEventListener("change", handleFiltersChange);
stadeElement.addEventListener("change", handleFiltersChange);
sexeElement.addEventListener("change", handleFiltersChange);
triPrixElement.addEventListener("change", handleFiltersChange);

function handleFiltersChange() {
  const valeurFiltreSousCategorie = sousCategorie.value;
  const valeurFiltreStade = stadeElement.value;
  const valeurFiltreSexe = sexeElement.value;
  const valeurTriPrix = triPrixElement.value;

  trierEtFiltrerCartes(
    valeurFiltreSousCategorie,
    valeurTriPrix,
    valeurFiltreSexe,
    valeurFiltreStade
  );
}

function trierEtFiltrerCartes(
  filtreSousCategorie,
  ordrePrix,
  filtreSexe,
  filtreStade,
  triParId = false
) {
  const containerCategorie = document.getElementById("cardCategorie");
  const cartes = Array.from(
    containerCategorie.getElementsByClassName("produitsContainerImage")
  );

  // Applique le filtre par sexe et stade
  cartes.forEach((carte) => {
    const sexeCarte = extractSexeFromCard(carte);
    const stadeCarte = extractStadeFromCard(carte);
    const sousCategorieCarte = extractSousCategorie(carte);

    // Montre ou cache la carte en fonction des filtres (en ignorant la casse)
    const filtreSexeValide =
      filtreSexe === "tous" ||
      sexeCarte.toLowerCase() === filtreSexe.toLowerCase();
    const filtreStadeValide =
      filtreStade === "tous" ||
      stadeCarte.toLowerCase() === filtreStade.toLowerCase();
    const filtreSousCategorieValide =
      filtreSousCategorie === "tous" ||
      sousCategorieCarte.toLowerCase() === filtreSousCategorie.toLowerCase();

    if (filtreSexeValide && filtreStadeValide && filtreSousCategorieValide) {
      carte.style.display = "block";
    } else {
      carte.style.display = "none";
    }
  });

  // Trie les cartes en fonction de l'ID
  cartes.sort((a, b) => {
    const idA = parseInt(a.getAttribute("produit-id"));
    const idB = parseInt(b.getAttribute("produit-id"));

    if (ordrePrix === "croissant") {
      return triParId
        ? idA - idB
        : extractPrixFromCard(a) - extractPrixFromCard(b);
    } else {
      return triParId || ordrePrix === "defaut"
        ? idA - idB
        : extractPrixFromCard(b) - extractPrixFromCard(a);
    }
  });
  // Réorganise les cartes dans le conteneur
  cartes.forEach((carte) => {
    containerCategorie.appendChild(carte);
  });
  // Affiche le message "Aucun résultat" si aucune carte n'est affichée
  afficherMessageAucunResultat(cartes);

  function afficherMessageAucunResultat(cartes) {
    const messageAucunResultat = document.getElementById(
      "messageAucunResultat"
    );
const messageAucunResultatContainer = document.getElementById(
      "messageAucunResultatContainer"
    );
    // Si aucune carte n'est affichée, affiche le message, sinon, cache le message
    if (cartes.every((carte) => carte.style.display === "none")) {
      if (!messageAucunResultat) {
        const nouveauMessage = document.createElement("p");
        nouveauMessage.id = "messageAucunResultat";
        nouveauMessage.textContent = "Aucun résultat pour votre recherche";
        messageAucunResultatContainer.appendChild(nouveauMessage);
      }
    } else {
      if (messageAucunResultat) {
        messageAucunResultat.remove();
      }
    }
  }
}

// Fonction pour afficher le message "Aucun résultat" si aucune carte n'est affichée

function extractPrixFromCard(carte) {
  const prixText = carte.querySelector(
    ".produitsContainerImageCardPrix"
  ).textContent;
  const prix = parseFloat(prixText.replace("€", ""));
  return prix;
}

function extractSexeFromCard(carte) {
  const sexeText = carte.querySelector(
    ".categorieContainerImageCardOptionfeature2"
  ).textContent;
  return sexeText;
}

function extractStadeFromCard(carte) {
  const stadeText = carte.querySelector(
    ".categorieContainerImageCardOptionfeature1"
  ).textContent;
  return stadeText;
}

function extractSousCategorie(carte) {
  const sousCategorieText = carte.querySelector(
    ".categorieContainerImageCardOptionSubCategory"
  ).textContent;
  return sousCategorieText;
}

const resetFiltersButton = document.getElementById("resetFilters");
resetFiltersButton.addEventListener("click", resetFilters);

function resetFilters() {
  // Réinitialise la valeur du tri par prix
  triPrixElement.value = "defaut";

  // Réinitialise la valeur du filtre par sexe
  sexeElement.value = "tous";

  // Réinitialise la valeur du filtre par stade
  stadeElement.value = "tous";

  // Réinitialise la valeur du filtre par sous-catégorie
  sousCategorie.value = "tous";

  // Réorganise les cartes avec les filtres réinitialisés
  trierEtFiltrerCartes("tous", "defaut", "tous", "tous", true);
}
