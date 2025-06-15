import React from 'react'
import Footer from './../MyPages/Footer';
import Header from './../MyComponents/Header';
import Contact from './../MyComponents/Contact';
import Infor from './../MyPages/Infor';
import Courseslider from './../MyComponents/Courseslider';
import { Carousel } from 'react-bootstrap';
import img1 from './../images/cimg1.png';
import img2 from './../images/cimg2.png';
import img3 from './../images/cimg3.png';
import vid1 from './../images/shikshaIntro.gif';

const Hero = () => {  
  return (
    <>
    
    <Header/>
    <div>
     <Carousel slide={false}>
     {/* <Carousel.Item>
      <video
              controls
              loop
              autoplay
              controlsList="nodownload"
              src={vid1}
              style={{
                width: '100%',
              }}
            ></video>
      </Carousel.Item> */}
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={vid1}
          alt="Intro slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img2}
          alt="Second slide"
        />

      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={img3}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
   
    </div>
    <Infor/>
    <Courseslider/>
    <Contact/>
    <Footer/>
    </>
   
  )
  }
export default Hero