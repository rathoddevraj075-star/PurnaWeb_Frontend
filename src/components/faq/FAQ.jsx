import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import VideoSection from "./VideoSection";
import FAQSection from "../product/FAQSection";
import Footer from "../Footer";
import React from 'react'
import SEO from "../SEO";
import usePageMeta from "../../hooks/usePageMeta";

const FAQ = () => {
  const { data: pageMeta } = usePageMeta('faq');

  return (
    <>
      <SEO
        title={pageMeta?.metaTitle || "FAQ | PurnaRoutine"}
        description={pageMeta?.metaDescription || "Frequently asked questions about PurnaRoutine products and wellness routines."}
        seo={pageMeta}
        url="/faq"
      />
      <AnnoucementBar />
      <Navbar />
      {/* <VideoSection /> */}
      <FAQSection />
      <Footer />
    </>
  )
}

export default FAQ
