import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenreRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="genre">{this.props.country}</div>
				<div className="rating">{this.props.num_part}</div>
				<div className="conflict_speech">{this.props.conflict_speech}</div>
				<div className="ratio">{this.props.ratio}</div>
			</div>
		);
	}
}
