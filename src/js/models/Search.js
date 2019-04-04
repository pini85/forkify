import axios from 'axios';// When importing a 3rd party from example npm you only need to require the name and our IDE will find it.
import {proxy, key, key2, key3, key4, key5} from '../config';
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
  /*This is a prototype method of the class Search. Therefore we do not need function and also we do not need the query parameter
  because it will be included when you make a search instance with this.query below. But this is an async so we need to specify that
  it is indeed that.*/
    try {
      const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key5}&q=${this.query}`);
      //Instead of returning the result right away we simply store it in this.result so all the data about the search are
      //incapsulated inside the object.
      this.result = await result.data.recipes;
      // console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}










// async function getResults(query) {
//   const proxy = 'https://cors-anywhere.herokuapp.com/';
//   const key = '83973eec45593e277f715c4f82b4d745';

//   try {
//   const result = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
//   const recipes = await result.data;
//   console.log(recipes);
//   } catch (error) {
//     alert(error);
//   }
// }
// getResults('pizza');



