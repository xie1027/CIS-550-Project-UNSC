import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import RecommendationsRow1 from './RecommendationsRow1';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			movieName: "",
			recSpeaker: [],
			recMovies: []
		}

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitMovie = this.submitMovie.bind(this);
	}

	handleMovieNameChange(e) {
		this.setState({
			movieName: e.target.value
		});
	}

	// componentDidMount() {
	//     // Send an HTTP request to the server.
	//     fetch("http://localhost:8081/genres",
	//     {
	//       method: 'GET' // The type of HTTP request.
	//     }).then(res => {
	//       // Convert the response data to a JSON.
	//       return res.json();
	//     }, err => {
	//       // Print the error if there is one.
	//       console.log(err);
	//     }).then(genreList => {
	//       if (!genreList) return;
	//       // Map each genreObj in genreList to an HTML element:
	//       // A button which triggers the showMovies function for each genre.

	//       let genreDivs = genreList.map((genreObj, i) =>
	//       <GenreButton id={"button-" + genreObj.topic_keyword} onClick={() => this.showMovies(genreObj.topic_keyword)} genre={genreObj.topic_keyword} />
	//       );

	//       //let genreDivs = genreList.map((genreObj, i) =>
	//       //<GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} />
	//       //);

	      

	//       // Set the state of the genres list to the value returned by the HTTP response from the server.
	//       this.setState({
	//         genres: genreDivs
	//       });
	//     }, err => {
	//       // Print the error if there is one.
	//       console.log(err);
	//     });
 //  	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitMovie() {
		// Send an HTTP request to the server.
	    fetch(`http://localhost:8081/recommendations/${this.state.movieName}`,
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
	       //<RecommendationsRow title = {movieObj.title} id = {movieObj.id} rating = {movieObj.rating} vote_count = {movieObj.vote_count}/>);

		   let speakerDivs = movieList.map((movieObj, i) =>
	       <RecommendationsRow1 name = {movieObj.name} country = {movieObj.country} gender = {movieObj.gender} fem_perct = {movieObj.fem_perct}/>);

		   let movieDivs = movieList.map((movieObj, i) =>
	       <RecommendationsRow country = {movieObj.country} meeting_id = {movieObj.meeting_id} meeting_date = {movieObj.meeting_date} topic_keyword = {movieObj.topic_keyword}/>);


	      // set the state of the movie to the value returned by the server
	      this.setState({
	      	recSpeaker: speakerDivs,
	        recMovies: movieDivs
	        
	      });
	      }, err => {
	        // Print the error if there is one.
	        console.log(err);
	      });
		
	}

	
	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="speakers" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h3">Speakers</div>
			    		
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter Speaker Name" value={this.state.movieName} onChange={this.handleMovieNameChange} id="movieName" className="movie-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitMovie}>Tell me about him/her</button>
			    		</div>
			    		<div className="header-container">
			    			<br></br>
			    			<div className="h6">You would like to know ...</div>
			    			<br></br>
			    			<div className="h5">The Speaker Information:</div>
				    			<div className="headers">
				    				<div className="header"><strong>Name</strong></div>
				    				<div className="header"><strong>Country</strong></div>
						            <div className="header"><strong>Gender</strong></div>
						            <div className="header"><strong>Female (%)</strong></div>
				    			</div>
			    			<div className="results-container" id="results">
			    				{this.state.recSpeaker}
			    		    </div>
			    		</div>
			    	</div>	

			    	<br></br>
			    	<div className="jumbotron">
			    		<div className="header-container">	
			    			<div className="h5">The Meetings This Speaker Participated:</div>
				    			<div className="headers">
				    				<div className="header"><strong>Country</strong></div>
				    				<div className="header"><strong>Meeting ID</strong></div>
						            <div className="header"><strong>Meeting Date</strong></div>
						            <div className="header"><strong>Topic</strong></div>
				    			</div>
			    			<div className="results-container" id="results">
			    				{this.state.recMovies}
			    			</div>
			    		</div>	
			    	</div>
			    </div>
		   	</div>
		);
	}
}