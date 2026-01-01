import React from 'react'
import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import VideoSection from "./VideoSection";
import FeaturesSection from "./FeaturesSection";
import MissionHero from "../MissionHero";
import ScienceImageWithText from "./ScienceImageWithText";
import OurTeam from './OutTeam';
import JoinNow from "./JoinNow";
import Footer from "../Footer";

const SciencePage = () => {
  return (
   <>
    <AnnoucementBar />
    <Navbar />
    <VideoSection />
    <FeaturesSection />
    <ScienceImageWithText />
    <MissionHero />
    <OurTeam />
    <JoinNow />
    <Footer />
   </>
  )
}

export default SciencePage
