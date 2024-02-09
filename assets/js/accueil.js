
function updateSlickConfig() {
  // Récupérer tous les éléments avec un ID commençant par "card"
  const cardElements = document.querySelectorAll('[id^="card"]');

  cardElements.forEach(cardElement => {
    const screenWidth = screen.width;
    const slickConfig = screenWidth <= 430 ? { slidesToShow: 1, slidesToScroll: 1 } : { slidesToShow: 4, slidesToScroll: 1 };

    cardElement.setAttribute('data-slick', JSON.stringify(slickConfig));
  });
}
document.addEventListener("DOMContentLoaded", async function () {
  // On récupère les div qui vont contenir les cartes
  const containers = {
    amphibiens: document.getElementById("card"),
    serpents: document.getElementById("card2"),
    invertebres: document.getElementById("card3"),
    lezards: document.getElementById("card4"),
    alimentation: document.getElementById("card5"),
  };

  // On utilise fetch pour charger les données JSON depuis le fichier
  fetch("./assets/js/bdd.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // On récupère les articles depuis les données JSON
      const articles = jsonData.articles;

      // On parcourt les catégories et on crée les cartes
      Object.keys(articles).forEach((categorie) => {
        const container = containers[categorie];
        const categoryArticles = articles[categorie];
        // Utilisation de la fonction createCards de util.js
        categoryArticles.forEach((article) => {
          createCards(container, article);
        });
      });
      updateSlickConfig();
      // Initialisation du carrousel Slick pour chaque section
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
});

// // Écouter les changements de taille de l'écran et mettre à jour les attributs en conséquence
// screen.addEventListener('resize', function () {
//    console.log('ee')
//   updateSlickConfig();
 
// });
