import React from "react";
import Catalogue from "../MyComponents/Catalogue";
import SubjectCards from "../MyComponents/SubjectCards";
import Footer from './../MyPages/Footer';
import Header from './../MyComponents/Header';
import { NavLink } from 'react-router-dom';
import bg from './../images/coursecatbg.png'
import Banner from './../MyComponents/banner';


function Coursecat() {
  return (
    <div>
      <Header/>
      <div>
        <img src={bg} alt="bg" width={"100%"} height="400" class="acc1"></img>
        <div class="position-relative"></div>
        <div class="position-absolute top-50 start-50 translate-middle">
          <p class="text-warning display-3 fw-semibold">
          </p>
          <p class="text-white fs-3 fw-light my-1">
          </p>
          
        </div>
      </div>
      <SubjectCards/>
      {/* <Catalogue /> */}
      <Footer/>
    </div>
  );
}

export default Coursecat;
