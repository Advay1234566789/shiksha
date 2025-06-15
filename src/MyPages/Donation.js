import React from "react";
import Footer from './../MyPages/Footer';
import Header from './../MyComponents/Header';

function Donation() {
  return (
    <div>
      <Header/>
      <h3 class="text-black d-flex justify-content-center pt-5">
        A Big Step to Open New Doors
      </h3>
      <h5 class="text-black d-flex justify-content-center ">
        your each Rupee Counts{" "}
      </h5>
      <div class="p-5">
        <div class="card mx-auto" style={{ width: "25rem" }}>
          <div class="card-body">
            <h5 class="card-title">Donation Details</h5>
            <div className="container my-3">
              <div className="row my-5">
                <div className="col md-4 p-2">
                  <button type="button" class="btn btn-info">
                    Rs.1000
                  </button>
                </div>
                <div className="col md-4 p-2">
                  <button type="button" class="btn btn-info">
                    Rs.5000{" "}
                  </button>
                </div>
                <div className="col md-4 p-2">
                  <button type="button" class="btn btn-info">
                    Rs.10000
                  </button>
                </div>
                <div className="col md-4 p-2">
                  <button type="button" class="btn btn-info">
                    Rs.25000
                  </button>
                </div>
                <div className="col md-4 p-2">
                  <button type="button" class="btn btn-info">
                    Rs.50000
                  </button>
                </div>
                <div className="col md-4 p-2">
                  <button type="button" class="btn btn-info">
                    Rs.75000
                  </button>
                </div>
              </div>
            </div>
            <p class="card-text">Other Amount</p>
            <form>
              <input type="text"></input>
            </form>
            <div class="p-5">
              <button type="button" class="btn btn-dark">
                Donate
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Donation;
