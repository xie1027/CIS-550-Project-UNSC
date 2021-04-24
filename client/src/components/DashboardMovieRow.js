import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class DashboardMovieRow extends React.Component {
	constructor(props) {
		super(props);
	}

	/* ---- Q1b (Dashboard) ---- */
	/* Change the contents (NOT THE STRUCTURE) of the HTML elements to show a movie row. */
	render() {
		return (
			<div className="movie">
				<div className="title">{this.props.country}</div>
				<div className="rating">{this.props.num_meetings}</div>
				<div className="votes">{this.props.num_speeches}</div>
			</div>
		);
	}
}
