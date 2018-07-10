var movies = [{ 
   title:"Star Wars", 
   director:"George Lucas",
   price: 20
 }, { 
   title:"Citizen Kane", 
   director:"Orson Welles",
   price: 19
 },{ 
   title:"The Dark Knight", 
   director:"Christopher Nolan",
   price: 18
 }];

exports.getAll = () => {
    return movies;
};

exports.get = (title) => {
    return movies.find((item) => {
        return item.title === title;
    });
};

exports.delete = (title) => {
    const oldLength = movies.length;
    movies = movies.filter((item) => {
        return item.title !== title;
    });
    return {deleted: oldLength !== movies.length, total: movies.length };
};

exports.add = (newMovie) => {
    const oldLength = movies.length;
    let found = this.get(newMovie.title);
    if (!found) {
       movies.push(newMovie);
    }
    return {added: oldLength !== movies.length, total: movies.length };
};

console.log(this.getAll())

