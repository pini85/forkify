export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {
      id,
      title,
      author,
      img
    }
    this.likes.push(like);

    //Persist to local storage
    this.persistData();

    return like;
  }

    deleteLike(id) {
      const index = this.likes.findIndex(el => el.id === id);
      this.likes.splice(index, 1);

      //Persist to local storage
       this.persistData();

    }

    isLiked(id) {
      //this method will test if we have a like in our this.like array, Because they they do we need to put a different like picture
      //on the recipe UI so we know this is liked.
      //When we load a reicpe we need to know if it is a liked recipe or not a liked recipe
      return this.likes.findIndex(el => el.id === id) !== -1;
      // we want to return true if it is not -1 so then indeed there is a index.
      //This will return true or false
    }

    getNumLikes() {
      return this.likes.length;
    }

    persistData() {
      localStorage.setItem('likes', JSON.stringify(this.likes));
      // you can only save strings in the local storage. So we are converting all our likes array into a string.
      //And when we want to retreive it again we will deconvert it from a string.
      // //THe best way would be everytime you add an object to the likes array or delete it. whenever you change the array. We
      //should also persist it.
    }
    readStorage() {
      const storage = JSON.parse(localStorage.getItem('likes'));

      if(storage) this.likes = storage;
      //We are restoring our likes from the local storage and adding it to our like array. Because when we reload the page it is empty
      //So local storage will give us again our likes back again.
    }
  }

