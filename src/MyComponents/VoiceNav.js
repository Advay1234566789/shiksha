import React, { useState, useRef } from 'react';
import vol from './../images/volume.png' 
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import "../mic.css"
import {FaInfoCircle, FaMicrophone} from "react-icons/fa";
import {GrTextAlignFull} from "react-icons/gr";

export default function VoiceNav() {
  const [showModal, setShowModal] = React.useState(false);
  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/" + website.split(" ").join(""));
      },
    },
    {
      command: "go to *",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/" + website.split(" ").join(""));
      },
    },
    {
      command: "open courses",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/coursecat");
      },
    },
    {
      command: "enroll for *",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/videos");
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    {
      command: "stop",
      callback: () => {
        stopHandle();
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };
  const { speak } = useSpeechSynthesis();
  const voiceNav = "Click to activate Voice Navigation.";
  const voiceNavProcess = "Welcome to voice navigation. Click on the microphone icon to start listening and Try saying: Open Courses or Enroll for Science";
  return (
    <>
    <div class="">
        <button
                class="fixed z-50 bottom-5 right-5 text-white px-4 w-auto h-10 bg-[#1F2937] rounded-full hover:bg-[#4A77B5] active:shadow-lg mouse shadow transition ease-in  focus:outline-none animate-bounce duration-500"type="button"
                onClick={() => setShowModal(true)}
                onMouseOver={() => speak({ text: voiceNav })}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
            <FaMicrophone className="w-6 h-6 sm:w-6 sm:h-6 " /> &nbsp;
            Voice Navigation
          </div>
        </button>
      </div>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none" >
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                <div className="flex items-center justify-center p-5 border-b border-gray-400 border-solid rounded-t lg:h-28">
                  <h3 className="flex items-center justify-center text-3xl font-bold" >
                    VOICE NAVIGATION &nbsp;
                    <FaInfoCircle className="w-4 h-4 md:w-5 md:h-5" onMouseOver={()=> speak({text: voiceNavProcess })} />
                  </h3>
                  <button
                    className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                  </button>
                </div>
                <div className="relative flex-auto p-6">
                <div className="microphone-wrapper">
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <img src={vol} className="microphone-icon" alt='mic' />
        </div>
        <div className="microphone-status">
          {isListening ? "Listening" : "Click to start Listening"}<br/>
          <span className="text-sm font-semibold text-gray-400">Try Saying: Open Courses / Enroll for Science</span>
        </div>
        
      </div>
      
      {transcript && (
        <div className="microphone-result-container">
          <div className="microphone-result-text mt-4 lg:w-[50%]"> <span className='font-bold text-gray-500'> <div style={{ display: "flex", justifyContent: "center" }}>
            <GrTextAlignFull className="w-6 h-6 mt-2 sm:w-6 sm:h-6" /> &nbsp;
            Transcript
          </div></span> <br/>{transcript}</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="px-3 py-2 mb-1 mr-1 text-sm font-semibold text-white uppercase transition-all ease-linear bg-gray-800 rounded shadow outline-none active:bg-gray-600 hover:shadow-lg focus:outline-none duration-15" onClick={handleReset}>
            Reset
          </button>
          {isListening && (
          <button className="bg-[#d83a3a] text-white active:bg-gray-600 font-semibold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-15" onClick={stopHandle}>
            Stop
          </button>
        )}
        </div>
        </div>
      )}
      
    </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-gray-400 border-solid rounded-b">
                  <button
                    className="px-3 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-gray-800 rounded shadow outline-none hover:bg-gray-600 hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
}
