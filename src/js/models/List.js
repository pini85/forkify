import uniqid from 'uniqid';


export default class List {
  constructor() {
    this.items = [];
  }
  addList(count,unit,ingredient) {
    const item = {
      id: uniqid(),
      //thanks to the npm package we will automatically get a unique id for every List instance.
      count,
      unit,
      ingredient
    }

    this.items.push(item);
    return item;
  }
  deleteList(id) {
    const index = this.items.findIndex(el => el.id === id);
    //we search for the index number of our id and save it to the index variable
    //[2,8,4] splice(1, 2) -> returns [4,8], original array is [2] Start from element index 1 and take 2 elements
    //[2,8,4] slice(1, 2) -> returns 4. Orginal array is the same [2,8,4] starts from the index 1 and ends at index 2.
    this.items.splice(index , 1);
  }

  updateCount(id, newCount) {
    //where do we get the new count from the user interface?
    //basically we catch the value from the addEventListener when they increase or decrease the valjue from the input field.
    this.items.find(el => el.id === id).count = newCount;
    //items.count = newCount.

  }
}
