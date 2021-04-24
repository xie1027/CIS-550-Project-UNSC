import React from 'react';
import '../style/About.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';


export default class About extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {    
    return (
      <div className="About">

        <PageNavbar active="About" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div class="about-section">
              <h1>About</h1>
              <p>This website sync speeches given at the United Nations Security Council debates from 1995 – 2017 – which includes 77,815 speeches from 5,507 meeting protocols of the UNSC – and tying the topics (such as Women, Peace, Security, and Climate Change) to various disasters information, including conflicts, and natural disaster weather data. It provides an overview of the historical context that undergird each of these issues as well as an emerging trend of the key issues in the open UNSC debates.</p>
              <p>Authors: Alen Amini, Wei Chen, Vijay Kumar, Iqbal Sherif</p>
            </div>
          </div>

        </div>
      </div>
    );
  }
}