import React from 'react';
import Layout from '../../Layout.jsx';
import './LandingPage.css';
import mainImage from '../../assets/bg.png';

function LandingPage() {
  return (
    <Layout>
     
      <div className="content-texts">
        <h1 className="head">OncoCare</h1>
        <p><i>Welcome to OncoCare, your trusted partner in cancer care.</i></p>
      </div>
      <div className="content-image">
        <img src={mainImage} alt="OncoCare" />
      </div>
     
    </Layout>
  );
}

export default LandingPage;
