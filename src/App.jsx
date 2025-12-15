import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import SetPassword from './pages/SetPassword';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import ListItem from './pages/ListItem';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Refunds from './pages/Refunds';
import Cart from './pages/Cart';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import VendorRegistration from './pages/VendorRegistration';
import Lookbook from './pages/Lookbook';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/rent-collection" element={<Browse />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/list-item" element={<ListItem />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/how-it-works" element={<Home />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/cart" element={<Cart />} />
              {/* New Pages */}
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/sell-with-us" element={<VendorRegistration />} />
              <Route path="/vendor-registration" element={<VendorRegistration />} />
              <Route path="/lookbook" element={<Lookbook />} />
              {/* User Account routes */}
              <Route path="/saved" element={<Dashboard />} />
              <Route path="/wishlist" element={<Dashboard />} />
              <Route path="/profile" element={<Dashboard />} />
              <Route path="/profile/:id" element={<Dashboard />} />
              <Route path="/my-account" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

