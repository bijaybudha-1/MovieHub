const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzM2Q1NTY0ODQyMWQyYTY5NDM1YmIxZGQxMTFiZGZlMiIsIm5iZiI6MTc2MjM5NTUxMC4zMDcwMDAyLCJzdWIiOiI2OTBjMDU3NmI5YzdlODM4MTU5MzRmZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.RixiipK_9oFs9wwUGOmiQFCEw2SiTTXu0qyiUOvArY0"
  }
};

const topRatedUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';


fetch(topRatedUrl, options)
.then(res => res.json())
.then(topRated => {
    console.log(topRated.results[0].poster_path);
    
})
.catch(err => {
    console.log("ERROR", err);
    
})