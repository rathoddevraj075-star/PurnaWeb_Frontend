import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./Components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import MaintenanceWrapper from "./context/MaintenanceWrapper";

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
import AllProductsPage from "./Components/product/AllProductsPage";
import VariantDetailScroller from "./Components/product/VariantDetailScroller";
import ProductDeepDive from "./Components/product/ProductDeepDive";
import Contact from "./Components/contact/ContactPage";
import FAQSection from "./Components/faq/FAQ";
import SciencePage from "./Components/science/SciencePage";
import About from "./Components/about/About";
import ThePurnaRoutine from "./Components/ThePurnaRoutine";
import BlogPage from "./Components/blog/BlogPage";
import BlogDetailPage from "./Components/blog/BlogDetailPage";
import AccountPage from "./Components/account/AccountPage";

// Admin Panel Imports
import AdminLayout from "./admin/components/layout/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import ProductList from "./admin/pages/products/ProductList";
import ProductEdit from "./admin/pages/products/ProductEdit";
import CategoryList from "./admin/pages/categories/CategoryList";
import CategoryEdit from "./admin/pages/categories/CategoryEdit";
import GlobalSeoSettings from "./admin/pages/seo/GlobalSeoSettings";
import SeoHealth from "./admin/pages/seo/SeoHealth";
import RedirectsPage from "./admin/pages/seo/RedirectsPage";
import ActivityLogs from "./admin/pages/ActivityLogs";
import NotificationsPage from "./admin/pages/NotificationsPage";
import BlogList from "./admin/pages/blogs/BlogList";
import BlogEdit from "./admin/pages/blogs/BlogEdit";
import UserList from "./admin/pages/users/UserList";
import UserEdit from "./admin/pages/users/UserEdit";
import ContactList from "./admin/pages/contacts/ContactList";
import AdminProfile from "./admin/pages/settings/AdminProfile";
import SystemSettings from "./admin/pages/settings/SystemSettings";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <MaintenanceWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Product & Category Routes */}
              <Route path="/products" element={<AllProductsPage />} />
              <Route path="/products/:id" element={<ProductDeepDive />} />

              {/* Direct Link to Immersive from Category Selection */}
              <Route path="/collections/:category/immersive" element={<VariantDetailScroller />} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQSection />} />
              <Route path="/science" element={<SciencePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/routine" element={<ThePurnaRoutine />} />
              <Route path="/journal" element={<BlogPage />} />
              <Route path="/journal/:slug" element={<BlogDetailPage />} />
              <Route path="/account" element={<AccountPage />} />

              {/* Admin Panel Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductEdit />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="categories/:id" element={<CategoryEdit />} />
                <Route path="blogs" element={<BlogList />} />
                <Route path="blogs/:id" element={<BlogEdit />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/:id" element={<UserEdit />} />
                <Route path="contacts" element={<ContactList />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="seo/global" element={<GlobalSeoSettings />} />
                <Route path="seo/health" element={<SeoHealth />} />
                <Route path="seo/redirects" element={<RedirectsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="logs" element={<ActivityLogs />} />
              </Route>
            </Routes>
          </MaintenanceWrapper>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;


