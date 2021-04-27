import React from 'react';
import PageNavbar from './PageNavbar';
import DisastersRow from './DisastersRow';
import DisastersRow1 from './DisastersRow1';
import '../style/Disasters.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Disasters extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			year_num: "",
			recDisaster: [],
			recYear: [],
			disasters: []
		}

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitYear = this.submitYear.bind(this);
	}

	handleMovieNameChange(e) {
		this.setState({
			year_num: e.target.value
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


 componentDidMount() {
 // Send an HTTP request to the server.
			 fetch("http://localhost:8081/disasters",
			 {
				 method: 'GET' // The type of HTTP request.
			 }).then(res => {
				 // Convert the response data to a JSON.
				 return res.json();
			 }, err => {
				 // Print the error if there is one.
				 console.log(err);
			 }).then(disastersList => {
				 if (!disastersList) return;
				 // Map each genreObj in genreList to an HTML element:
				 // A button which triggers the showMovies function for each genre.
				 let disastersDivs = disastersList.map((disastersObj, i) =>
				 <option value={disastersObj.year}>{disastersObj.year}</option>
				 );

				 /// Set the state of the genres list to the value returned by the HTTP response from the server.
				 this.setState({
					 disasters: disastersDivs
				 });
			 }, err => {
				 // Print the error if there is one.
				 console.log(err);
			 });
 }

 handleChange(e) {
	 this.setState({
		 selectedDecade: e.target.value
	 });
 }


	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitYear() {
		// Send an HTTP request to the server.
	    fetch(`http://localhost:8081/disasters/${this.state.year_num}`,
	    {
	      method: 'GET' // The type of HTTP request.
	    }).then(res => {
	      // Convert the response data to a JSON.
	      console.log(res)
	      return res.json();
	    }, err => {
	      // Print the error if there is one.
	      console.log(err);
	    }).then(yearList => {
	      console.log(yearList)
	      if (!yearList) return;
	      // Map each genreObj in genreList to an HTML element:
	      // A button which triggers the showMovies function for each genre.

	      //let movieDivs = movieList.map((movieObj, i) =>
	       //<RecommendationsRow title = {movieObj.title} id = {movieObj.id} rating = {movieObj.rating} vote_count = {movieObj.vote_count}/>);

		   let disastersDivs = yearList.map((yearObj, i) =>
	       <DisastersRow incident_type = {yearObj.incident_type} num_disasters = {yearObj.num_disasters}  states= {yearObj.states} />);

	      // set the state of the movie to the value returned by the server
	      this.setState({
	      	recDisaster: disastersDivs,
	      });
	      }, err => {
	        // Print the error if there is one.
	        console.log(err);
	      });

				fetch(`http://localhost:8081/years/${this.state.year_num}`,
				{
					method: 'GET' // The type of HTTP request.
				}).then(res => {
					// Convert the response data to a JSON.
					console.log(res)
					return res.json();
				}, err => {
					// Print the error if there is one.
					console.log(err);
				}).then(yearList => {
					console.log(yearList)
					if (!yearList) return;
					// Map each genreObj in genreList to an HTML element:
					// A button which triggers the showMovies function for each genre.

					//let movieDivs = movieList.map((movieObj, i) =>
					 //<RecommendationsRow title = {movieObj.title} id = {movieObj.id} rating = {movieObj.rating} vote_count = {movieObj.vote_count}/>);

				 let yearDivs = yearList.map((yearObj, i) =>
					 <DisastersRow1 year = {yearObj.year} top_topic = {yearObj.top_topic} num_disasters = {yearObj.num_disasters} num_conflicts = {yearObj.num_conflicts}/>);


					// set the state of the movie to the value returned by the server
					this.setState({
						recYear: yearDivs
					});
					}, err => {
						// Print the error if there is one.
						console.log(err);
					});
	}


	render() {

		return (
			<div className="Recommendations">
				<PageNavbar active="disasters" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h3">Natural Disasters</div>

			    		<br></br>
							<div className="dropdown-container">
								<select value={this.state.year_num} onChange={this.handleMovieNameChange} className="movie-input" id="year_num">
									<option select value>-- select an option --</option>
									{this.state.disasters}
								</select>
								<button className="submit-btn" id="submitMovieBtn" onClick={this.submitYear}>Tell me more :)</button>
							</div>

			    		<div className="header-container">
			    			<br></br>
			    			<div className="h6">You would like to know ...</div>
			    			<br></br>
			    			<div className="h5">This Year ...</div>
				    			<div className="headers">
				    				<div className="header"><strong>Disasters</strong></div>
				    				<div className="header"><strong>(#) Disasters</strong></div>
						            <div className="header"><strong>States</strong></div>
				    			</div>
			    			<div className="results-container" id="results">
			    				{this.state.recDisaster}
			    		    </div>
			    		</div>
			    	</div>

			    	<br></br>
			    	<div className="jumbotron">
			    		<div className="header-container">
			    			<div className="h5">What happened Each Year ...</div>
				    			<div className="headers">
				    				<div className="header"><strong>Year</strong></div>
				    				<div className="header"><strong>Hot Topic</strong></div>
						            <div className="header"><strong>(#) Disasters</strong></div>
						            <div className="header"><strong>(#) Conflicts</strong></div>
				    			</div>
			    			<div className="results-container" id="results">
			    				{this.state.recYear}
			    			</div>
			    		</div>
			    	</div>
			    </div>
		   	</div>
		);
	}
}
