import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";

import AnnouncementBar from "./Components/AnnoucementBar";
import Navbar from "./Components/Navbar";
import Hero3D from "./Components/Hero3D";
import ShowcaseLayout from "./Components/ShowcaseLayout";
import PhilosophySection from "./Components/PhilosophySection";
import RoutineSection from "./Components/RoutineSection";
import BlogSection from "./Components/BlogSection";
import Newsletter from "./Components/NewsLetter";
import Footer from "./Components/Footer";

// Page Imports
import ProductPage from "./Components/product/ProductPage";
import AllProductsPage from "./Components/product/AllProductsPage";
import Contact from "./Components/contact/ContactPage";
import FAQSection from "./Components/faq/FAQ";
import SciencePage from "./Components/science/SciencePage";
import About from "./Components/about/About";
import ThePurnaRoutine from "./Components/ThePurnaRoutine";
import BlogPage from "./Components/blog/BlogPage";
import BlogDetailPage from "./Components/blog/BlogDetailPage";
import AccountPage from "./Components/account/AccountPage";

function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Hero3D />
      <PhilosophySection />
      <RoutineSection />
      <ShowcaseLayout />
      <BlogSection />
      <Newsletter />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
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
      </Routes>
    </Router>
  );
}

export default App;

