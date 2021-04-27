import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class DisastersRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return ( 
			<div className="movieResults">
				<div className="title">{this.props.year}</div>
				<div className="id">{this.props.top_topic}</div>
				<div className="rating">{this.props.num_disasters}</div>
				<div className="votes">{this.props.num_conflicts}</div>
			</div>

		);
	}
}
