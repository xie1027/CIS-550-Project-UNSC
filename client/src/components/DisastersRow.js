import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class DisastersRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return ( 
			<div className="movieResults">
				<div className="title">{this.props.incident_type}</div>
				<div className="id">{this.props.num_disasters}</div>
				<div className="rating">{this.props.states}</div>
			</div>

		);
	}
}
