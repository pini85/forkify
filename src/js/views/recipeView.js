import { Fraction } from 'fractional';
import {elements} from './base';

const formatCount = count => {
  //count = 2.5 <--- 2 1/2
  //count = 0.5 <---- 1/2
  if(count) {
    const newCount = Math.round(count * 100) / 100;//math round doesnt give us a decimal. but count*100/100 will give us 2
    //decimal places. We want to do round becasue sometiems a weird bug comes that is eg 1.333333333333333
      const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
    // We deconstruct function() {}or 2 variables we need to convert it to a string so we can split it and then we return it as an array and
    //convert it back to a number.
    if(!dec) return newCount;
    // only a int 1,2,3 we return the count because we dont need to modify anything.
     if (int === 0){ // 0.5
    const fr = new Fraction(newCount);
    return `${fr.numerator}/${fr.denominator}`;// 0.5 --> 1/2
  } else {
    const fr = new Fraction(newCount - int);// we dont want to modify the int only the dec
    return `${int} ${fr.numerator}/${fr.denominator}`;
  }
  return '?'// there are some rare cases there is no count. So when there isnt return a ? . Better than undefined.
  }
}


const createIngredient = ingredient => `

                    <li class="recipe__item">
                        <svg class="recipe__icon">
                            <use href="img/icons.svg#icon-check"></use>
                        </svg>
                        <div class="recipe__count">${formatCount(ingredient.count)}</div>
                        <div class="recipe__ingredient">
                            <span class="recipe__unit">${ingredient.unit}</span>
                            ${ingredient.ingredient}
                        </div>
                    </li>

`;

export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
}

export const renderRecipe = (recipe, isLiked) => {
  const markup = `

            <figure class="recipe__fig">
                <img src="${recipe.img}" alt="${recipe.title}" class="img">
                <h1 class="recipe__title">
                    <span>${recipe.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                    </svg>
                </button>
            </div>
            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
                </ul>

                <button class="btn-small recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>
          <div>

          <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
              This recipe was carefully designed and tested by
              <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
              <span>Directions</span>
              <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
              </svg>

            </a>
          </div>
  `;

  elements.recipe.insertAdjacentHTML('afterbegin', markup);

};

export const updateServingsIngredients = recipe => {
  //Update servings

  document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

  //Update ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
    //we need both the element and the index because essentially we are looping over 2 arrays at the same time.

  });

}
