import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return ( 
			<div className="movieResults">
				<div className="title">{this.props.country}</div>
				<div className="id">{this.props.meeting_id}</div>
				<div className="rating">{this.props.meeting_date}</div>
				<div className="votes">{this.props.topic_keyword}</div>
			</div>

		);
	}
}
