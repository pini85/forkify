import {elements} from './base';

export const getInput = () => elements.searchInput.value;//we do not need to write return because no arguments with arrow function

export const clearField = () => {
  elements.searchInput.value = '';
};
//Wrap them in {} because we dont want to return anything here.

export const clearResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResultPages.innerHTML = '';
};

export const highlightedSelected = id => {
  const resultArray = Array.from(document.querySelectorAll('.results__link'));
  //selecting all the result__link nodes and putting them in an array
  resultArray.forEach(el => el.classList.remove('results__link--active'));
  //So we iterte over them and we remove the link active so it will reset when we choose one.
document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

/*
'Pasta with tomato sauce and spinach'
accumulator = 0 | accumulator + currentWord.length = 5 | newTitle = ['Pasta']
accumulator = 5 | accumulator + currentWord.length = 9 | newTitle = ['Pasta', 'with']
accumulator = 9 | accumulator + currentWord.length = 15 | newTitle = ['Pasta', 'with', 'tomato']
accumulator = 15 | accumulator + currentWord.length = 18 | newTitle = ['Pasta', 'with', 'tomato']
accumulator = 18 | accumulator + currentWord.length = 24 | newTitle = ['Pasta', 'with', 'tomato']
*/
export const limitRecipeTitle = (title, limit = 17) => {
  if(title.length > limit ) {
    const newTitle =[];
    //We have a callback function which is the first parameter in the reduce method.2nd parameter is the inital value of the accumala
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    title.split(' ').reduce((accumulator, currentWord) => {
      if(accumulator + currentWord.length <= limit) {
        newTitle.push(currentWord);
      }
      return accumulator + currentWord.length;//0 then 5 then 9 then 15 then 18 then 24

    },0)

    return `${newTitle.join(' ')} ...`;
    //Join is the opposite of split. Join simply joins the elements of the array with a space. So it will return back it to a sentence

  }
  return title

};
//Another way to do it.
// const limitRecipeTitle = (title, limit = 18) => {
//     if (title.length > limit) {
//         let newTitle = title.substring(0, limit);
//         newTitle = newTitle.substring(0, Math.min(newTitle.length, newTitle.lastIndexOf(' ')));
//         return `${newTitle} ...`;
//     };
//     return title;
// };


/*we use this function below just to get the template. and then we pass it to our render button function
type is either 'prev' or 'next' like in the css.
*/

//  <button class="btn-inline results__btn--prev">
//     <svg class="search__icon">
//         <use href="img/icons.svg#icon-triangle-left"></use>
//     </svg>
//     <span>Page 1</span>
// </button>
// <button class="btn-inline results__btn--next">
//       <span>Page 3</span>
//       <svg class="search__icon">
//           <use href="img/icons.svg#icon-triangle-right"></use>
//       </svg>
//   </button>

const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
  <span>Page ${type === 'prev' ? page - 1 : page + 1 }</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>

  </button>
`;
// <span>${type === 'prev' ? page - 1 : page + 1 }</span>
/*if type is prev. We are in either page 2 or 3 so then we want to display the button as page - 1 (page 2 - 1) = 1 or
(page 3 -1) = 2.
and if it isnt prev which it will be next then we want (page 1 + 1) = 2 pr (page 2 + 1) = 3.

 <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
 Same thing here. If the type is prev then we want the arrow icon to point to the left. If it is next then we want the arrow
 icon pointing to the right.

 <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
 We need to plug in the data into this button containing the number of the page where we want to move whenever we click this button.
 We need this for our event handeler.
*/


/*The goal of this function is to render the buttons according to the number of the page we are on.
  If you are on the first page It should only render next page
  If its on the  2nd page it should render 2 buttons previous page and next page
  If it is on the 3rd page it should render 1 button previous page.
  To implement this we need to know on which page we are and how many pages there are.
  */
 const renderButtons = (page, numResults, recipePerPage) => {
  //How many pages there are.
  //For reusability purposes if in case the API will show in the future more results than 30 we can still know how many pages there
 // will be. So we dont hard code 3 here.

  const pages = Math.ceil(numResults / recipePerPage); // 30 / 10 = 3. Ceil means if there was 31. Then 31 / 10 = not 3.1 but 4.
  let button;
  if(page === 1 && pages > 1) {// if there is only 1 page we dont want to display no buttons
    //Only button to go to next page
    button = createButton(page, 'next');

  } else if (page < pages) {
    //Both buttons
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;




  } else if (page === pages && pages > 1) { // if there is only 1 page we dont want to display no buttons
     //Only button to go to previous page
     button = createButton(page, 'prev');
  }

  elements.searchResultPages.insertAdjacentHTML('afterbegin', button);



 };

 const renderRecipe = recipe => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author ">${recipe.publisher}</p>
           </div>
        </a>
    </li>
  `;
  //We call the function limitRecipeTitle on the recipe.title to get max 17 charactors from it.
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
 };


 // console.log(state.search.result);//array of recipe
//This will loop over all the recipes and give one by one the recipe to the renderRecipe function above.
 export const renderResults = (recipes, page = 1, recipePerPage = 6 ) => {
  //Render result of current page

  //We want the first page to give recipes 0-9 from the array index. Then 2nd page 10-19. Then 3rd page 20-29.
  const start = (page - 1) * recipePerPage; // (1 - 1) * 10 = 0 | (2 - 1) * 10 = 10 | (3 - 1) * 10 = 20
  const end = page * recipePerPage; // 1 * 10 = 10 | 2 * 10 = 20 | 3 * 10 = 30

  recipes.slice(start, end).forEach(renderRecipe);
  //slice extracts up to but not including end. So if the end is 10 it will really only copy 9

  //render pagination buttons

  renderButtons(page, recipes.length, recipePerPage);
  //We get the page value from the dataset which we saved in the index.js eventhandeler. We need the recipe.length and
  //recipePerPage to determin what page we are in for the renderButtons function.
 }

/*
renderButtons:
1)We call the renderButton function with the page parameter which we get from the data set,recipes.length which is 30,
RecipePerPage which is set to 10.
2)

*/
