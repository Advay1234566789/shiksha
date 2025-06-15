import React from "react";
import Footer from './../MyPages/Footer';
import Header from './../MyComponents/Header';
import About1 from './../MyComponents/About1';


function Aboutus() {
  return (
    <div>
      <Header/>
      <div>
       {/* \\\ <img src={} width={"100%"} height="600" class="acc1" alt="bg"></img> */}
        <div class="position-relative"></div>
        <div class="position-absolute top-50 start-50 translate-middle">
        {/* <p class="text-blue-700 display-6 fw-semibold my-1">For One and All</p> */}
        </div>
        <About1/>
      </div>
      
      <Footer/>
    </div>
  );
}

export default Aboutus;
