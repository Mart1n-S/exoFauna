const card = document.getElementById("app");

const jsonFile = "./assets/js/bdd.json";

fetch(jsonFile)
	.then((respone) => {
		return respone.json();
	})
	.then((data) => {
		data.articles.map((product) => {
            const { id, title, description, price, discount } = product;
            card.innerHTML += `
                <div data-product="${id}">
                    <a href="##">
                        <p class="titre-articles">${title}</p>
                    </a>
                    <p class="description-articles">${description}</p>
                    <p class="description-articles">${price}</p>
                    <p class="description-articles">${discount}</p>
                </div>
            `;
        });
    });