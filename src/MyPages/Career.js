

import React from 'react'
import Footer from './../MyPages/Footer';
import Header from './../MyComponents/Header';
import career_main from './../images/career_main.png';
import pathway from './../images/pathway.png';
import abt_indus from './../images/abt_indus.png';
import inspiring from './../images/inspiring.png';
import pic_1 from './../images/pic_1.png';
import pic_2 from './../images/pic_2.png';
import pic_3 from './../images/pic_3.png';
import check_box from './../images/check_box.png';






{/* <img src="./public/images/career_main.png" alt="FCC Logo" /> */}

function Career() {
  return (
    <div>
        <Header/>
      <img src={career_main} alt="FCC Logo" width={"100%"} height="550" class="acc1" ></img>

      
     {/* about the industry */}

{/* <div class="row gx-5 text-center">
        
        <div class="col-sm-6 col-md-8 text-center "> 
        <img src="/images/career_main.png" alt="FCC Logo"  class="acc1" ></img>
        </div>
            <div class="col-6 col-md-4 text-black">hiiiiii</div>
     </div> */}


<div class="container px-1 text-center">
  <div class="row gx-4 ">

    <div class="col">
     <div class="p-5">
     <img src={abt_indus} align="left" alt="FCC Logo" width={"105%"} height="400" class="acc1" ></img>
     </div>
    </div>

    {/* <div align="center" >
<button type="button" class="btn bg-secondary mt-5">
  <h1>Skilling Roadmap </h1>
</button>
</div> */}

    <div class="col p-5" align="center" >
    <button type="button" class="btn bg-secondary ">
      <h1>About the Industry</h1>
      </button>

    <div class="row  " align="left">
      <div class="p-4">
      <h6 class="display-6" >Creating future-ready talent for the BPM industry</h6>
      </div>
    </div>

    
    <div class="row  " align="left">
      <div class="p-4">
      The Business Process Management industry in India has grown multi-fold with a vibrant ecosystem.
      </div>
    </div>


    <div class="row  " align="left">
      <div class="p-4">
      According to a NASSCOM-McKinsey Report, there is a $220 billion opportunity in the BPM sector, giving headway for jobs and growth.
      </div>
    </div>



    </div>
  </div>
</div>

{/* grey container */}
<div style={{backgroundColor: "lightgrey"}}>

{/* skilling roadmap */}

<div align="center" >
<button type="button" class="btn bg-secondary mt-5">
  <h1>Skilling Roadmap </h1>
</button>
</div>

<div class="row  " >
<div class="p-5" align="center">
The BPM sector is ripe for automation, which makes knowledge of digital skills an advantage. With this background, the BPM Skilling Initiative is designed to build industry-ready talent. FutureSkills Prime is collaborating with global BPM companies and 40+ affiliated subject-matter experts to bring high-quality relevant content to learners. The subjects will include e-commerce, retail, banking, insurance, healthcare and others to help bridge the demand-supply knowledge gap in the industry.
</div>
</div>

<div class="row  " >
<div  class="mx-6"align="center">
  <h4>
Gain a competitive edge. Participate in Placement Drives undertaken by the BPM Council. Get preference in the NASSCOM Prime Career Fair.
</h4>
</div>
</div>


{/* three cards */}
<div class="gap-3">

<div class="card-group p-5 ">
  <div class="card p-5 ">
    <img src={pic_1} class="card-img-top" alt="..."/>
    <div class="card-body" align="center">
      <h5 class="card-title">BPM Associate Banking</h5>
    </div>
  </div>

  <div class="card p-5">
    <img src={pic_2} class="card-img-top" alt="..."/>
    <div class="card-body" align="center">
      <h5 class="card-title">BPM Associate Insurance</h5>
    </div>
  </div>

  <div class="card p-5">
    <img src={pic_3} class="card-img-top" alt="..."/>
    <div class="card-body" align="center">
      <h5 class="card-title">BPM Associate Financial Services</h5>
    </div>
  </div>
</div>


</div>
</div>

{/* learning pathway */}

<div >

{/* skilling roadmap */}

<div align="center" >
<button type="button" class="btn bg-secondary mt-5 ">
  <h1>Your learning pathway for navigating careers in the  Industry </h1>
</button>
</div>

<div class="row  " >
<div class="p-5" align="center">
<img src={pathway} width={"70%"} height="300" alt="..."/>
</div>
</div>


</div>


{/* yellow & black 3 containers */}

{/* grey container */}
<div style={{backgroundColor: "lightgrey"}} class=''>


<div class="hstack justify-content-between  p-5" >
 {/* black */}
  <div class="bg-body-tertiary border mt-5 mb-5">
  <div class="card text-bg-dark  " >
  <div class="card-header">
    <div><h3>Who</h3></div>
    <div><h1>Should Apply?</h1></div>
  </div>
  <div class="card-body">
    <div class="row">
      <div class="col-3" align="left">
      <img src={check_box} width={"80%"} height="30" alt="..."/>
      </div>
      <div class="col" align="left">
        Students
      </div>
    </div>

    <div class="row mt-3" >
      <div class="col-3" align="left">
      <img src={check_box} width={"80%"} height="30" alt="..."/>
      </div>
      <div class="col" align="left">
        Candidates in early-stage career
      </div>
    </div>

  </div>
</div>
    </div>
    
   {/* yellow */}
   <div class="bg-body-tertiary border mt-5 mb-5">
  <div class="card text-bg-warning " >
  <div class="card-header">
    <div><h3>What</h3></div>
    <div><h1>Will You Learn?</h1></div>
  </div>
  <div class="card-body">
    <div class="row">
      <div class="col-3" align="left">
      <img src={check_box} width={"80%"} height="30" alt="..."/>
      </div>
      <div class="col" align="left">
        Domain Insights
      </div>
    </div>

    <div class="row mt-3" >
      <div class="col-3" align="left">
      <img src={check_box} width={"80%"} height="30" alt="..."/>
      </div>
      <div class="col" align="left">
        Professional skills
      </div>
    </div>

  </div>
</div>
    </div>

  {/* black */}
  <div class="bg-body-tertiary border mt-5 mb-5">
  <div class="card text-bg-dark " >
  <div class="card-header">
    <div><h3>What</h3></div>
    <div><h1>Is The Demand?</h1></div>
  </div>
  <div class="card-body">
    <div class="row">
      <div class="col-3" align="left">
      <img src={check_box} width={"80%"} height="30" alt="..."/>
      </div>
      <div class="col" align="left">
        Employbility
      </div>
    </div>

    <div class="row mt-3" >
      <div class="col-3" align="left">
      <img src={check_box} width={"80%"} height="30" alt="..."/>
      </div>
      <div class="col" align="left">
        Greater career trajectory
      </div>
    </div>

  </div>
</div>
    </div>

</div>

</div>

{/* inspiring journey */}

<div >

{/* skilling roadmap */}

<div align="center" >
<button type="button" class="btn bg-secondary mt-5 ">
  <h1>Get started on your Skilling Journey </h1>
</button>
</div>

<div class="row  " >
<div class="p-5" align="center">
<img src={inspiring} width={"70%"} height="400" alt="..."/>
</div>
</div>


</div>
<Footer/>
    
    </div>
  )
}

export default Career