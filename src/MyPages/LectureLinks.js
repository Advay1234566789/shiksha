import React from 'react'
import { Link } from 'react-router-dom';
import Idash1 from "../MyComponents/Idash1";
import Idash2 from "../MyComponents/Idash2";
import Inotifs from "../MyComponents/Inotifs";
import Learnerlist from '../MyComponents/Learnerlist';
import Links from '../MyComponents/Links';
import Sidebar from '../MyComponents/Sidebar';
import LearnerDashboard from "./LearnerDashboard";

export default function LectureLinks() {
  return (
    <div className="bg-gray-200 grid grid-cols-5 h-screen">
    {/* <LearnerDashboard /> */}
    <Sidebar/>
    <div className="col-span-4 mr-5">
      <div className="bg-white p-2 m-2 rounded-xl drop-shadow-xl font-semibold">
        Lecture Links
      </div>

      <div className="grid grid-cols-3">
        <div className=" col-span-2">
    <Links/>

        </div>
     
          </div>

      </div>

    </div>

  )
}
