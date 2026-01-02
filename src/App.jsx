import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import MaintenanceWrapper from "./context/MaintenanceWrapper";

import AnnouncementBar from "./components/AnnoucementBar";
import Navbar from "./components/Navbar";
import Hero3D from "./components/Hero3D";
import ShowcaseLayout from "./components/ShowcaseLayout";
import PhilosophySection from "./components/PhilosophySection";
import RoutineSection from "./components/RoutineSection";
import BlogSection from "./components/BlogSection";
import Newsletter from "./components/NewsLetter";
import Footer from "./components/Footer";

// Page Imports
import AllProductsPage from "./components/product/AllProductsPage";
import VariantDetailScroller from "./components/product/VariantDetailScroller";
import ProductDeepDive from "./components/product/ProductDeepDive";
import Contact from "./components/contact/ContactPage";
import FAQSection from "./components/faq/FAQ";
import SciencePage from "./components/science/SciencePage";
import About from "./components/about/About";
import ThePurnaRoutine from "./components/ThePurnaRoutine";
import BlogPage from "./components/blog/BlogPage";
import BlogDetailPage from "./components/blog/BlogDetailPage";
import AccountPage from "./components/account/AccountPage";

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
import PageMetaList from "./admin/pages/seo/PageMetaList";
import PageMetaEdit from "./admin/pages/seo/PageMetaEdit";
import ActivityLogs from "./admin/pages/ActivityLogs";
import NotificationsPage from "./admin/pages/NotificationsPage";
import BlogList from "./admin/pages/blogs/BlogList";
import BlogEdit from "./admin/pages/blogs/BlogEdit";
import UserList from "./admin/pages/users/UserList";
import UserEdit from "./admin/pages/users/UserEdit";
import ContactList from "./admin/pages/contacts/ContactList";
import StoreList from "./admin/pages/stores/StoreList";
import StoreEdit from "./admin/pages/stores/StoreEdit";
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

import PageTransition from "./components/ui/PageTransition";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <PageTransition />
          <MaintenanceWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Category Routes */}
              <Route path="/categories" element={<AllProductsPage />} />
              <Route path="/products/:id" element={<ProductDeepDive />} />

              {/* Category Collection View */}
              <Route path="/categories/:category" element={<VariantDetailScroller />} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQSection />} />
              <Route path="/science" element={<SciencePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/routine" element={<ThePurnaRoutine />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
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
                <Route path="stores" element={<StoreList />} />
                <Route path="stores/:id" element={<StoreEdit />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="seo/global" element={<GlobalSeoSettings />} />
                <Route path="seo/health" element={<SeoHealth />} />
                <Route path="seo/redirects" element={<RedirectsPage />} />
                <Route path="seo/pages" element={<PageMetaList />} />
                <Route path="seo/pages/:slug" element={<PageMetaEdit />} />
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


