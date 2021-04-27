import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import BestGenres from './BestGenres';
import About from './About';
import Disasters from './Disasters';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							path="/speakers"
							render={() => (
								<Recommendations />
							)}
						/>
						<Route
							path="/conflicts"
							render={() => (
								<BestGenres />
							)}
						/>
						<Route
							path="/about"
							render={() => (
								<About />
							)}
						/>
						<Route
							path="/disasters"
							render={() => (
								<Disasters />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}