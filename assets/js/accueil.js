// On récupère les div qui vont contenir les cartes
const containerAmphibiens = document.getElementById("card");
const containerSerpents = document.getElementById("card2");
const containerInvertebres = document.getElementById("card3");
const containerLezards = document.getElementById("card4");
const containerAlimentation = document.getElementById("card5");

// On utilise fetch pour charger les données JSON depuis le fichier
fetch("./assets/js/bdd.json")
  .then((response) => response.json())
  .then((jsonData) => {
    // On récupère les articles depuis les données JSON
    const articles = jsonData.articles;

    // On traite les amphibiens
    const amphibiens = articles.amphibiens;
    createCards(containerAmphibiens, amphibiens);

    // On traite les serpents
    const serpents = articles.serpents;
    createCards(containerSerpents, serpents);

    // On traite les invertebres
    const invertebres = articles.invertebres;
    createCards(containerInvertebres, invertebres);

    // On traite les lezards
    const lezards = articles.lezards;
    createCards(containerLezards, lezards);

    // On traite l'alimentation'
    const alimentation = articles.alimentation;
    createCards(containerAlimentation, alimentation);

    // On initialise le carrousel Slick pour chaque section
    $(".produitsContainer").slick({
      infinite: false,
      arrows: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des données JSON", error)
  );

// Fonction pour créer les cards à partir des données
function createCards(container, articles) {
  // On boucle sur les articles pour créer chaque card
  articles.forEach((article) => {
    // Crée un nouvel élément div pour la card
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("produitsContainerImage");

    // Crée un nouvel élément div pour contenir les infos de la card
    const cardImageDiv = document.createElement("div");
    cardImageDiv.classList.add("produitsContainerImageCard");

    // Crée un élément img pour l'image de l'article
    const img = document.createElement("img");
    img.src = article.images[0];
    img.alt = "image d'un animal";
    img.classList.add("produitsContainerImageCardPhoto");

    // On ajoute un gestionnaire d'événements pour changer l'image au survol
    img.addEventListener("mouseover", function () {
      img.src = article.images[1];
    });

    // On ajoute un gestionnaire d'événements pour revenir à l'image par défaut
    img.addEventListener("mouseout", function () {
      img.src = article.images[0];
    });

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

    // Crée un bouton pour ajouter au panier
    const addButton = document.createElement("button");
    addButton.classList.add("produitsContainerImageCardBouton");
    addButton.textContent = "Ajouter au panier";

    // Crée un lien pour voir les détails
    const detailsLink = document.createElement("a");
    detailsLink.href = `id=${article.id}`;
    detailsLink.classList.add("produitsContainerImageCardLien");
    detailsLink.textContent = "Voir détails";

    // Ajoute les éléments à la card
    cardImageDiv.appendChild(img);
    cardImageDiv.appendChild(title);
    cardImageDiv.appendChild(price);
    cardImageDiv.appendChild(addButton);
    cardImageDiv.appendChild(detailsLink);

    // Ajoute la card à l'élément conteneur
    cardDiv.appendChild(cardImageDiv);
    container.appendChild(cardDiv);
  });
}
