import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AnnouncementBar from "./Components/AnnoucementBar";
import Navbar from "./Components/Navbar";
import Hero3D from "./Components/Hero3D";
import PhilosophySection from "./Components/PhilosophySection";
import RoutineSection from "./Components/RoutineSection";
import Products from "./Components/Products";
import ProductSlider from "./Components/ProductsSlider";
import ScrollingBanner from "./Components/ScrollingBanner";
import EnergySection from "./Components/EnergySection";
import BenefitsSection from "./Components/Benefits";
import BlogSection from "./Components/BlogSection";
// import MissionHero from "./Components/MissionHero";
import Testimonials from "./Components/Testimonials";
import ScrollingTextBanner from "./Components/MovingText";
import VideoReels from "./Components/VideoReels";
import AboutSection from "./Components/AboutSection";
import Newsletter from "./Components/NewsLetter";
import Footer from "./Components/Footer";

import ProductPage from "./Components/product/ProductPage"; // your product page
import AllProductsPage from "./Components/product/AllProductsPage"; // All Products listing page
import Contact from "./Components/contact/ContactPage"; // your contact page
import FAQ from "./Components/faq/FAQ";
import SciencePage from "./Components/science/SciencePage";
import About from "./Components/about/About";
import ThePurnaRoutine from "./Components/ThePurnaRoutine";
import BlogPage from "./Components/blog/BlogPage";
import BlogDetailPage from "./Components/blog/BlogDetailPage";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaQ } from "react-icons/fa6";
import FAQSection from "./Components/faq/FAQ";
import AccountPage from "./Components/account/AccountPage";


function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Hero3D />
      <PhilosophySection />
      <RoutineSection />
      <Products />
      {/* <BenefitsSection /> */}
      <ProductSlider />
      <BlogSection />
      <Newsletter />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* Product dynamic route */}
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/science" element={<SciencePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/routine" element={<ThePurnaRoutine />} />
        <Route path="/journal" element={<BlogPage />} />
        <Route path="/journal/:slug" element={<BlogDetailPage />} />
        <Route path="/account" element={<AccountPage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} /> 
        <Route path="/faq" element={<FAQ />} /> */}

      </Routes>
    </Router>
  );
}

export default App;


// import AnnouncementBar from "./Components/AnnoucementBar";
// import Navbar from "./Components/Navbar";
// import Hero from "./Components/Hero";
// import Products from "./Components/Products";
// import ProductSlider from "./Components/ProductsSlider";
// import ScrollingBanner from "./Components/ScrollingBanner";
// import EnergySection from "./Components/EnergySection"
// import BenefitsSection from "./Components/Benefits";
// import BlogSection from "./Components/BlogSection";
// import MissionHero from "./Components/MissionHero";
// import Testimonials from "./Components/Testimonials";
// import ScrollingTextBanner from "./Components/MovingText";
// import AboutSection from "./Components/AboutSection";
// import Newsletter from "./Components/NewsLetter";
// import Footer from "./Components/Footer";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";z

// function App() {
//   return (
//     <div id="root">
//       <AnnouncementBar />
//       <Navbar />
//       <Hero />
//       <Products />
//       <ProductSlider />
//       <ScrollingBanner />
//       <BenefitsSection />
//       <EnergySection />
//       <ScrollingTextBanner />
//       <AboutSection />
//       <BlogSection />
//       <MissionHero />
//       <Testimonials />
//       <Newsletter />
//       <Footer />
//     </div>
//   );
// }

// export default App;
