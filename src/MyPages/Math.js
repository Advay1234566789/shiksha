import React from "react";
import MathCatalogue from "../MyComponents/MathCatalogue";
import SubjectCards from "../MyComponents/SubjectCards";
import Footer from './Footer';
import Header from '../MyComponents/Header';
import { NavLink } from 'react-router-dom';
import bg from './../images/mathimg.gif'
import Banner from '../MyComponents/banner';

function Math() {
  return (
    <div>
      <Header/>
      <div>
        <img src={bg} alt="bg" width={"100%"} height="400"></img>
        <div class="position-relative"></div>
        <div class="position-absolute top-50 start-50 translate-middle">
          <p class="text-warning display-3 fw-semibold">
          </p>
          <p class="text-white fs-3 fw-light my-1">
          </p>
          
        </div>
      </div>
      <MathCatalogue />
      <Footer/>
    </div>
  );
}

export default Math;
