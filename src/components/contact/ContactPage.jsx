import AnnoucementBar from "../AnnoucementBar";
import Navbar from "../Navbar";
import VideoSection from "./VideoSection";
import FormSection from "./FormSection";
import Footer from "../Footer";
import SEO from "../SEO";
import usePageMeta from "../../hooks/usePageMeta";

export default function ContactPage() {
  const { data: pageMeta } = usePageMeta('contact');

  return (
    <>
      <SEO
        title={pageMeta?.metaTitle || "Contact Us | PurnaRoutine"}
        description={pageMeta?.metaDescription || "Get in touch with PurnaRoutine. We'd love to hear from you."}
        seo={pageMeta}
        url="/contact"
      />
      <AnnoucementBar />
      <Navbar />
      {/* <VideoSection /> */}
      <FormSection />
      <Footer />
    </>
  );
}
