import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      movies: []
    }

    this.showMovies = this.showMovies.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/genres",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(genreList => {
      if (!genreList) return;
      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.

      let genreDivs = genreList.map((genreObj, i) =>
      <GenreButton id={"button-" + genreObj.topic_keyword} onClick={() => this.showMovies(genreObj.topic_keyword)} genre={genreObj.topic_keyword} />
      );

      //let genreDivs = genreList.map((genreObj, i) =>
      //<GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} />
      //);

      

      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        genres: genreDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }


  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  showMovies(genre) {
      console.log(genre);
    //this.setState( { movies: this.state.movies =  DashboardMovieRow. } );

    // Send an HTTP request to the server.
    fetch(`http://localhost:8081/genres/${genre}`,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      console.log(res)
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(movieList => {
      console.log(movieList)
      if (!movieList) return;
      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      
      //let movieDivs = movieList.map((movieObj, i) =>
      //<DashboardMovieRow title = {movieObj.title} rating = {movieObj.rating} vote_count = {movieObj.vote_count}/>);
      
      let movieDivs = movieList.map((movieObj, i) =>
       <DashboardMovieRow country = {movieObj.country} num_meetings = {movieObj.num_meetings} num_speeches = {movieObj.num_speeches}/>);

      // set the state of the movie to the value returned by the server
      this.setState({
        movies: movieDivs
      });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }

  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h3">Trendy Topics</div>
            <div className="genres-container">
              {this.state.genres}
            </div>
          </div>

          <br></br>
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header"><strong>Country</strong></div>
                <div className="header"><strong>Number of Meetings</strong></div>
                <div className="header"><strong>Number of Speeches</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.movies}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}