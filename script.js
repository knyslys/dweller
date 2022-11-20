//navigation
const navigationList = document.querySelectorAll(".navigation__list__item");
const slideNav = (nav) => {
  navigationList.forEach((e) => {
    e.classList.remove("navigation__list__item--selected");
  });
  nav.currentTarget.classList.add("navigation__list__item--selected");
  setStore(nav.currentTarget.querySelector(".nav-link"));
};
navigationList.forEach((nav) => {
  nav.addEventListener("click", slideNav);
});

const sortByPrice = document.querySelector("#price");
const sortByRating = document.querySelector("#rating");
const gameGallery = document.querySelector(".games");
const loadingHTML = `<img src="images/spin.gif" alt="loading" class="loading-gif" >`;

//setinam default parametrus
let storeId = 1;
let sortBy = "metacritic";

sortByPrice.addEventListener("input", (e) => {
  sortBy = "price";
  apiRequest(storeId);
});

sortByRating.addEventListener("input", (e) => {
  sortBy = "metacritic";
  apiRequest(storeId);
});

//gaunam cheapsharko linka i game
const getStoreLink = (game, storeID) => {
  let link = `https://www.cheapshark.com/redirect?dealID=${game}`;
  return link;
};
//gaunam metacritic rewiew linka
const getMetaLink = (game) => {
  return `https://www.metacritic.com${game}`;
};

//gaunam ivertinimo spalva
const ratingColor = (rating) => {
  switch (true) {
    case rating >= 75:
      return "green";
      break;
    case rating < 75 && rating >= 45:
      return "yellow";
      break;
    case rating < 45:
      return "red";
      break;
  }
};

//main funkcija uzkrauti zaidimus
async function loadGames(gameObj) {
  let html;
  let res;

  switch (sortBy) {
    case "metacritic":
      res = Array.from(gameObj).sort((e, a) => {
        return e.metacriticScore - a.metacriticScore;
      });
      break;
    case "price":
      res = Array.from(gameObj).sort((e, a) => {
        return a.salePrice - e.salePrice;
      });
      break;
  }

  gameGallery.innerHTML = "";
  //loopas listinti grajus
  for (a in res) {
    html = ` <div class="games__box">
    <div class="games__box__image-container">
      <img
        src="${res[a].thumb}"
        alt="test"
        class="img"
      />
    </div>

    <div class="games__box__info">
      <h2 class="game-name">${res[a].title}</h2>
      <div class="games__box__info__price">
        <i class="ph-coins icon"></i>
        <span class="game-price">Normal price: ${res[a].normalPrice} e</span>
      </div>
      <div class="games__box__info__price">
        <i class="ph-tag icon"></i>
        <span class="game-price game-price--curent"
          >Current price: ${res[a].salePrice} e</span
        >
      </div>
      <div class="games__box__info__price">
        <i class="ph-wallet icon"></i>
        <span class="game-price game-price--savings"
          >You save: ${(res[a].normalPrice - res[a].salePrice).toFixed(
            2
          )} e</span
        >
      </div>
      <div class="games__box__info__price">
        <i class="ph-star icon"></i>
        <a href="${getMetaLink(res[a].metacriticLink)}" class="game-price"
          >Metacritic rating:
          <span class="rating rating--${ratingColor(res[a].metacriticScore)}">${
      res[a].metacriticScore
    }</span></a
        >
      </div>
    </div>
    <a class="btn btn--buy" href="${getStoreLink(res[a].dealID)}">BUY</a>
  </div>`;

    gameGallery.insertAdjacentHTML("afterbegin", html);
  }
}

function setStore(nav) {
  if (nav.classList.contains("nav-link--steam")) {
    storeId = 1;
  } else if (nav.classList.contains("nav-link--gog")) {
    storeId = 7;
  } else if (nav.classList.contains("nav-link--humble")) {
    storeId = 11;
  }

  apiRequest(storeId);
}

//paduodam api requesta i cheapsharka
async function apiRequest(storeID) {
  //displayinam loading gifa
  gameGallery.innerHTML = loadingHTML;
  const request = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${storeID}&upperPrice=15`
  );
  const games = await request.json();
  await loadGames(games);
}

apiRequest(storeId);
loadGames(storeId);
