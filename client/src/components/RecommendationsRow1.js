import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow1 extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="title">{this.props.name}</div>
				<div className="id">{this.props.country}</div>
				<div className="rating">{this.props.gender}</div>
				<div className="votes">{this.props.fem_perct}</div>
			</div>
		);
	}
}
