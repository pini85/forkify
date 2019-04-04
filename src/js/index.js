// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';


/*
Global state of our app:
State means what data will be displayed in any given moment when the app is running. This is a simple app. But for very complex apps
there are many libaries to help you with the state. For example Redux helps you with that.

* Search object - All the data about the search(Query and results).
* Current recipe object
* Shopping list object
* Like recipes
*/
const state = {}; // an object
// window.state = state;

/*
Explicitiy it looks like this:
const state = {
    search: {
        query: '',
        result: []
    },
    recipe: {
        id: -1,
        result: {},
        title: '',
        author: '',
        img: '',
        url: '',
        ingredients: {}
    }
};

just like our budget app:

var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

*/



//*SEARCH CONTROLLER*//
const controlSearch = async () => {

  //1) Get query from view
  const query = searchView.getInput();

  // //TEST
  // const query = 'pizza';

  // ///////

  if(query) {

    // 2) New search object and add to state
    state.search = new Search(query);




    // 3) Prepare UI for results
    searchView.clearField();
    searchView.clearResults();
    renderLoader(elements.searchResults);

    try {
    // 4) Search for recipes
    await state.search.getResults();// getResults returns a promise so we need to await until the promise is forfilled. Also we then need
    //need to async our controlSearch function so this function can be in the background too until this await is complete.
    // 5) Render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
    //Returns an array of 30 recipes. API.data.recipes

    } catch(error) {
      console.log(error);
      alert('Something went wrong with recipe search');
      clearLoader();
      // Even if there is an error we want the loader to go away.
    }
  }
}

//TESTING//
// window.addEventListener('load', controlSearch);
// ////////

elements.searchForm.addEventListener('submit', event => {

  event.preventDefault(); // We dont want the page to reload after you press the submit button which is the default behavior.
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  //Even if we click on the icon or the tet of the button we want to target the button itself. So closest solves that.
  // The reason why we want to target the button itself because it has the data attribute which we need for the following
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
     searchView.clearResults();
    //we save a variable with the dataset we defined inside the button the 10 means we are on base 10 which is 0-9.
    searchView.renderResults(state.search.result, goToPage);
    //the 2nd parameter is page in renderResults function.
  }
});

/*
We have a small problem for this event listener because where do we actually attach these event listeners to if the pagination
buttons are not yet there when the page is loaded? And so we have to use something called event delegation again. So we used that
before in the course. And so the concept is that we attach the event listener to an element that is already there, and then we try
to figure out where the click happened so that we can then take action based on that.
*/

/*

1) Click on the button
2) If the button exsists
3)Identify what dataset the button has and store it in a variable.
4)Clear previous search results
5)Call the renderResults function with the recipes and page number
6)RenderResults has 3 parameters: recipes, page, recipePerPage which is set to 10
7)Take the recipe array and slice it to 10 recipes per page.
8)Depending on page we get either 10 first or 10 middle or 10 last.
9) With the 10 recipes we iterate over them and  call the renderRecipe function that will display them in the dom
10) We also handle a functon to only display 17 characters of the recipe title with limitRecipeTitle function.
11) We also render the buttons from the renderResults function
*/

//*RECIPE CONTROLLER*//

const controlRecipe = async ()  => {
  const id = window.location.hash.replace('#', '');
  // window = browser. location = the url. hash = for the # sympol. replace = string method.
  if(id) {
    // We only want this to fire when the url has a # symbol.

    // Prepare UI for changes

      recipeView.clearRecipe();
      renderLoader(elements.recipe);

      //Highlighted selected search item

      if (state.search) {
        searchView.highlightedSelected(id);
      }



    // Create new Recipe object
    state.recipe = new Recipe(id);



    // //TESTING
    // window.r = state.recipe;
    // //We are exposing our state.recipe to the global object so the console has access to it.

    //////
    try {
    // Get Recipe data
     await state.recipe.getRecipe();

     state.recipe.parseIngredients();

    // // Calculate servings and time
    state.recipe.calcTime();
    state.recipe.calcServings();



    // // Render recipe
    clearLoader();
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

    } catch(error) {
      alert('Error processing recipe');
      console.log(error);
      //You should implement add some methods for the user interface for better error handeling.
    }

  }
}

// const recipe = new Recipe(46956);
// const result = recipe.getRecipe();
// console.log(result);

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//hashchange: It will trigger this eventListener when the hash changes in the url.
//load: Imagine if a user saves this as a bookmark and when he comes back nothing happens beause the hash url hasn't changed.
//So we need a eventlistener to the load event. So it will fire everytime the webpage loads. So then the hash can be displayed
//even though it hasn't changed.

//LIST CONTROLLER///

const controlList = () => {
  //Create new list IF there is no list because if we have a list we want to update it not create a whole new one
  if(!state.list) state.list = new List();

  //Add each ingredeint to the list and UI
  state.recipe.ingredients.forEach( el => {
    const item = state.list.addList(el.count, el.unit, el.ingredient); // we can save this item to a variable because in our
    //in our addList method we return the list.
    listView.renderItem(item);
  });
}

//Handle delete and update list item events

elements.shopping.addEventListener('click', e => {
  //We need to get the id to delete the item
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //we choose closest so where ever we click on the shopping list it will choose the target closest to the shopping__item to
  //retreive the id
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {

    //Delete from state
    state.list.deleteList(id);

    //Delete from UI
    listView.deleteItem(id);

    //handle the count update
  } else if(e.target.matches('.shopping__count-value')) {
    const value = parseFloat(e.target.value, 10); // .value will contain the vlaue that is inside the input.
    state.list.updateCount(id, value);
  }
});


//TESTING
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());

//LIKE CONTROLLER///

const controlLike = () => {

  if(!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;


  //User has NOT yet liked current recipe
  if(!state.likes.isLiked(currentID)){
    // Add like to the state

    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

    // Toggle like button
    likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);

  } else {

    //Remove like from State
    //If the like exsist we can delete it
    state.likes.deleteLike(currentID);

    // Toggle like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
     likesView.deleteLike(currentID);

  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes when page loads

window.addEventListener('load', () => {
  state.likes = new Likes();
  // when the page loads we dont have anymore a like instance. so we create when when the page loads.

  // Restore likes
  state.likes.readStorage();
  //Now our like object contains all the likes what we stored in the local storage. And is alreadsy parsed to an object.

  //Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  //We also want to display in the UI the likes heart if we do have likes from the local stroage which is now in the like array.

  // Render the exsisting likes in our like ul.
  state.likes.likes.forEach(like => likesView.renderLike(like));
  //we take our likes array and iterate over it and render it to the view

})





//Handeling the recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //we again use event delegation because they dont exsist once we load the page. So we use target.
    //But now we use .matches because we want 2 elements to do the same event click. .btn-decrease * means all the child elements
    //of .btn-decease

    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      //preventing negative servings
      recipeView.updateServingsIngredients(state.recipe);
    }



  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});

