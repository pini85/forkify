import axios from 'axios';
import {proxy, key, key2, key3, key4, key5} from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = result.data.recipe.title;
      this.author = result.data.recipe.publisher;
      this.img = result.data.recipe.image_url;
      this.url = result.data.recipe.source_url;
      this.ingredients = result.data.recipe.ingredients;
      //We predefined the this variable values.

    } catch(error) {
      console.log(error);
    }
  }

  calcTime() {
    //We will roughly estimate the time it takes to make this recipe. Every 3 ingredients takes 15 minutes.
    const numIng = this.ingredients.length; //20 in an array
    const periods = Math.ceil(numIng / 3); // 20/3 = 6.6 = 7
    this.time = periods * 15 // 7 * 15 = 105 minutes
  }

  calcServings() {
    this.servings = 4;
    //We could make a complex algorithim and determine how many servings are in one recipe but we will just say one recipe is 4
    //servings.
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    //Searched the array of the recipe ingredient for the ingredient names we want to change
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];
    //We also have kg and g but we do not need to modify them. But we need to include them so when we loop over the ingridents
    //to find the unit index they can find this too.

    const newIngredients = this.ingredients.map(el => {

      // 1) Uniform units
      let ingredient = el.toLowerCase();
      //All ingredients inside the the recipe are stored in the ingredient variable and it is lower cased.
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
        //unit = tablespoons index = 0. unitShort[0] = tbsp
     /*
     We loop over the unitsLong array and we say when we find unit(ingredient name) in the unitsLong array which is similiar to
    a name in the recipe ingredient array we will replace that ingredient with the unitShort ingredient name.
    will be replaced with the unit at the same position, but in this other array. This is why both arrays need the same index.
     */

      });

      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // this is a regualar expression and this means we take all the values that are inside a parenthesis.



      // 3) Parse ingredients into count, unit and ingredient

      /*
      We want to separate from the ingredients the number, unit and ingredient text
      Use cases:
      count, Unit, ingredient text (1, tsp, sugar)
      count, ingredient text (3 packages of tuna)
      Ingredient text (olive oil)

      */

      // Test if there is a unit in a string. And if so where it is located.
      const arrayIngredients = ingredient.split(' ');
      //Each word is its own element inside the array.
      const unitIndex = arrayIngredients.findIndex(el2 => units.includes(el2));
      //We are looping over the array and we are saying find me the index number of my looping array if the test i do which
       //is if the element of my looping array(el2) is included in the unitsShort array.
      //And so that's the only way to find the position of the element, when we don't really know, which  we are looking for.

      let objIngredient;
      //This is our final value. We need to declare the variable outside the if statement. Because let and const are blocked
      //scoped.
      if( unitIndex > -1) {
        //There is a unit. If the findIdex method doesnt find an Index it will show -1

        /*
        Ex. 4 1/2 cups arrayCount = 2
        Ex. 4 cups arrayCount = 1
        Ex 4-1/2 cups arrayCount = 1     4-1/2 is one element
        */
        const arrayCount = arrayIngredients.slice(0, unitIndex);
        // We get the value of how many index's is it from 0 until we get a unit,
        let count;
        if (arrayCount.length === 1) {// evaluating where is the count
          count = eval(arrayIngredients[0].replace('-', '+'));// in case of example 3 we wil replace the 4-1/2 to a 4+1/2 and also
          //evaluate this as a javascript code so it will be 4.5 as our count
        } else {
          count = eval(arrayIngredients.slice(0, unitIndex).join('+'));
          //If we have more than 2 elements before the unit which is 4 1/2 we take those 2 elements join together with a +
          //between themselves so it will be readl ike 4 + 1/2. Then we use the eval function which will add them together so
          //the count value will be 4.5.
          //Eval will take a string and evaluate it as a javascript code. So not "4 + 1/2" but 4 + 1/2
        }

        objIngredient = {
          count,
          unit: arrayIngredients[unitIndex],
          ingredient: arrayIngredients.slice(unitIndex + 1).join(' ')
          //the ingredients would after the unitIndex. So we say we take all the elements after the unitIndex and then join the
          //ingredients as a string.

        };

      } else if (parseInt(arrayIngredients[0], 10)) { //-1 but starting with an integer
        //There is no unit, but 1st element is a number like for example 1 tomato sauce. We are assuming it will be the first element
        //in the array. So if it is a number we can parse it to an integer. If it is a word it will return NAN and return false.
        objIngredient = {
          count: parseInt(arrayIngredients[0], 10),
          unit: '',
          ingredient: arrayIngredients.slice(1).join(' ')
          // make a copy of the array but start from index 1 because the first element[0] will be the count. And we dont specify
          //the 2nd argument so it will copy the rest of the array. Then we want to join them to create one sentence.
        }
      } else if ( unitIndex === -1) {// -1 and not starting with an integer.
        //There is no unit and no number in 1st position (olive oil)
        objIngredient = {
          count: 1, // in case we dont have a unit we will always return a 1.
          unit: '',
          ingredient
          //ingredient: ingredient  in es6 if you assign a value that is the same as the property you dont need to specify the value.
          //There is no unit or no number so the rest has to be the ingredient.
        }
      }


      return objIngredient;
      /*In map methods we need to return something. So in each iteration, we have to return something, which will then be saved
      into the current position, of the new array.
      */
    });

    this.ingredients = newIngredients;
    //so we say after we have maped our ingredients the returned value of the outcome will be saved to our this.ingredients.
  }
  updateServings(type) { // we need the parameter type because dpeneds if we increase or decrease the servings
    //servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    //this.servings is still not updated. It is only stored in this variable.

    //ingredients
    this.ingredients.forEach(ing => ing.count*= (newServings / this.servings));
    //ing.count = 2 newServings = 5 this.servings = 4    so 2 *(5/4) = 2.5
    this.servings = newServings;
    //then we finally update the this.servings

  }

}

