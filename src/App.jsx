import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { Home, Mail, Stethoscope } from "lucide-react";

import logo from "./assets/images/logo.png";

import HomeDashboard from "./pages/HomeDashboard.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

import DevelopmentBanner from "./components/DevelopmentBanner.jsx";
import TabButton from "./components/TabButton.jsx";

import ScrollToTop from "./components/ScrollToTop";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import { useMyContext } from "./store/ContextApi";
import api from "./services/api";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./components/Auth/AccessDenied";

import AddAService from "./pages/admin/AddAService.jsx";
import AllUsers from "./pages/admin/AllUsers.jsx";
import UpdateOrderStatus from "./pages/admin/UpdateOrderStatus.jsx";

import GiftForm from "./pages/GiftForm";
import PaymentPage from "./pages/PaymentPage";

import toast from "react-hot-toast";


import { Toaster } from "react-hot-toast";
import {
  PlusCircle,
  Pencil,
  Users,
  ClipboardList,
  LogOut
} from "lucide-react";

import {
  DEFAULT_CURRENCY,
  fallbackExchangeRates,
  formatConvertedAmount,
  supportedCurrencies,
} from "./data/currencies.js";

import {
  initialGift,
} from "./data/services.js";

import { useEffect, useMemo, useRef, useState } from "react";
import Order from "./pages/Order.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import UserDetails from "./pages/admin/UserDetails.jsx";

const EXCHANGE_RATE_URL = "https://open.er-api.com/v6/latest/NPR";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [giftDetails, setGiftDetails] = useState(initialGift);
  const [giftStarted, setGiftStarted] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);

  const fetchServices = async (pageNumber = 1, keyword = "") => {
    const response = await api.get("/services", {
      params: {
        page: pageNumber - 1,
        size: 6,
        keyword,
      },
    });

    setServices(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchServices();
  }, []);
  const fetchProviders = async () => {
      const response = await api.get("/providers");
      console.log("response = "+ JSON.stringify(response));
      setServiceProviders(response.data);
  };

  useEffect(() => {
      fetchProviders();
  }, []);

  const [selectedCurrency, setSelectedCurrency] =
    useState(DEFAULT_CURRENCY);

  const [exchangeRates, setExchangeRates] =
    useState(fallbackExchangeRates);

  const [exchangeRateStatus, setExchangeRateStatus] =
    useState("loading");
    const navigate = useNavigate();

  // Access the states by using the useMyContext hook from the ContextProvider
  const { token, setToken, currentUser, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

  const giftFormRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedServices, setSelectedServices] = useState([]);

  const total = useMemo(
    () =>
      selectedServices.reduce(
        (sum, service) => sum + service.price,
        0
      ),
    [selectedServices]
  );

  const formatMoney = useMemo(
    () => (amount) =>
      formatConvertedAmount(amount, selectedCurrency, exchangeRates),
    [selectedCurrency, exchangeRates]
  );
  const activeProviders = useMemo(() => {
  return serviceProviders.filter((provider) =>
    services.some((service) => service.provider?.id === provider.id)
  );
}, [services, serviceProviders]);
console.log(activeProviders);

  const providerMap = useMemo(
  () =>
    new Map(
      serviceProviders.map((provider) => [provider.id, provider.name])
    ),
  []
);

  const serviceProviderNames = useMemo(() => {
  return activeProviders.map((provider) => provider.name).join(" | ");
}, [activeProviders]);

  useEffect(() => {
    let isActive = true;

    async function loadRates() {
      try {
        const response = await fetch(EXCHANGE_RATE_URL);

        if (!response.ok) throw new Error();

        const data = await response.json();

        const nextRates = supportedCurrencies.reduce((rates, currency) => {
          rates[currency.code] = Number(
            data.rates[currency.code] ??
              fallbackExchangeRates[currency.code]
          );
          return rates;
        }, {});

        if (isActive) {
          setExchangeRates({
            ...fallbackExchangeRates,
            ...nextRates,
            NPR: 1,
          });

          setExchangeRateStatus("live");
        }
      } catch {
        if (isActive) {
          setExchangeRates(fallbackExchangeRates);
          setExchangeRateStatus("fallback");
        }
      }
    }

    loadRates();

    return () => {
      // setIsActive(false);
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (giftStarted && selectedServices.length > 0) {
      giftFormRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [giftStarted, selectedServices.length]);
  const saveOrder = async () => {
    if (isSaving) return;

    setIsSaving(true);
    const exchangeRate = exchangeRates[selectedCurrency];
    const convertedTotal =
      total * exchangeRate;

    try {
      const giftOrderRequest = {
        recipientName: giftDetails.recipientName,
        recipientPhone: giftDetails.recipientPhone,
        recipientEmail: giftDetails.recipientEmail,

        relationship: giftDetails.relationship,

        senderName: giftDetails.senderName,
        senderEmail: giftDetails.senderEmail,

        message: giftDetails.message,

        serviceIds: selectedServices.map(service => service.id),

        totalPrice: convertedTotal,

        currency: selectedCurrency,
        
        exchangeRate: exchangeRate

      };

      await api.post(
        "/orders",
        giftOrderRequest,
      );

      toast.success("Order placed successfully!");
      navigate("/my-orders");
      resetGift();

    } catch (error) {
      console.log(error.response?.status);
      console.log(error.response?.data);
      console.log(error.response?.headers);
      console.error(error);
      toast.error("Unable to place order.");
    } finally {
          setIsSaving(false);
    }
  };

  function toggleService(service) {
    if (selectedIds.includes(service.id)) {
      setSelectedIds(prev => prev.filter(id => id !== service.id));

      setSelectedServices(prev =>
        prev.filter(s => s.id !== service.id)
      );
    } else {
      setSelectedIds(prev => [...prev, service.id]);

      setSelectedServices(prev => [...prev, service]);
    }

    setPaymentReady(false);
  }
  function removeDeletedService(id) {
    setSelectedIds(prev => prev.filter(x => x !== id));

    setSelectedServices(prev =>
      prev.filter(service => service.id !== id)
    );
    setSelectedIds((current) => {
      const next = current.filter((serviceId) => serviceId !== id);

      if (next.length === 0) {
        setGiftStarted(false);
      }

      return next;
    });

    setPaymentReady(false);
  }

  function startGiftFlow() {
    if (selectedIds.length === 0) return;

    navigate("/gift");

    // setGiftStarted(true);
    setPaymentReady(false);
  }

  function updateGiftDetails(e) {
    const { name, value } = e.target;

    setGiftDetails((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function submitGift(e) {
    e.preventDefault();
    // setPaymentReady(true);
    navigate("/payment", {
      state: { fromOrder: true },
    });
  }

  function resetGift() {
    setSelectedIds([]);
    setSelectedServices([]);

    setGiftDetails(initialGift);
    setGiftStarted(false);
    setPaymentReady(false);
    setPaymentMethod("card");
}

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN"); // Updated to remove token from localStorage
    localStorage.removeItem("USER"); // Remove user details as well
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };
  const adminItems = [
  {
    title: "Add Service",
    icon: <PlusCircle className="w-6 h-6" />,
    path: "/admin/add-service",
  },
  {
    title: "Update Order",
    icon: <Pencil className="w-6 h-6" />,
    path: "/admin/update-order-status",
  },
  {
    title: "All Users",
    icon: <Users className="w-6 h-6" />,
    path: "/admin/all-users",
  },
];

  return (
    <>
      <ScrollToTop />
      <div className="app">
        <header className="topbar">
          <NavLink to="/" className="brand">
            <img src={logo} alt="Heart to Home" className="brand-logo" />
            <span>Heart to Home</span>
          </NavLink>

          <div className="nav-section">
            <nav className="tabs">
              <NavLink to="/" end className="tab">
                <TabButton icon={<Home />} label="Home" />
              </NavLink>

              <NavLink to="/services" className="tab">
                <TabButton icon={<Stethoscope />} label="Services" />
              </NavLink>

              <NavLink to="/contact" className="tab">
                <TabButton icon={<Mail />} label="Contact Us" />
              </NavLink>
            </nav>
            {token ? (
              <div className="user-menu" ref={menuRef}>
                <button
                  className="menu-btn"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  ☰
                </button>

                {menuOpen && (
                  <div className="dropdown-menu">
                    {isAdmin &&
                      adminItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className="dropdown-item"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="dropdown-icon">{item.icon}</span>
                          <span>{item.title}</span>
                        </NavLink>
                      ))}
                      <NavLink
                        to="/my-orders"
                        className="dropdown-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ClipboardList className="dropdown-icon" />
                        My Orders
                      </NavLink>

                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    > 
                      <LogOut size={18} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="auth-buttons">
                  <NavLink to="/login" className="login-tab">
                    Log In
                  </NavLink>

                  <NavLink to="/signup" className="signup-tab">
                    Sign Up
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </header>

        <DevelopmentBanner />

        <main>
          <Toaster position="bottom-center" reverseOrder={false} />
          <Routes>
            <Route
              path="/"
              element={
                <HomeDashboard
                  selectedCount={selectedIds.length}
                  onBrowse={() => {}}
                  onGiftNow={startGiftFlow}
                />
              }
            />

            <Route
              path="/services"
              element={
                <ServicesPage
                  onSaveOrder={saveOrder}
                  selectedIds={selectedIds}
                  selectedServices={selectedServices}
                  serviceProviders={activeProviders}
                  providerMap={providerMap}
                  serviceProviderNames={serviceProviderNames}
                  services={services}
                  totalPages={totalPages}
                  fetchServices={fetchServices}
                  onServiceDeleted={removeDeletedService}
                  total={total}
                  selectedCurrency={selectedCurrency}
                  currencies={supportedCurrencies}
                  exchangeRateStatus={exchangeRateStatus}
                  formatMoney={formatMoney}
                  giftDetails={giftDetails}
                  giftStarted={giftStarted}
                  paymentReady={paymentReady}
                  paymentMethod={paymentMethod}
                  giftFormRef={giftFormRef}
                  onToggle={toggleService}
                  onCurrencyChange={setSelectedCurrency}
                  onGiftNow={startGiftFlow}
                  onGiftDetailsChange={updateGiftDetails}
                  onSubmitGift={submitGift}
                  onPaymentMethodChange={setPaymentMethod}
                  onReset={resetGift}

                />
              }
            />
            <Route
              path="/gift"
              element={
                  <ProtectedRoute>
                      <GiftForm
                          giftFormRef={giftFormRef}
                          giftDetails={giftDetails}
                          selectedServices={selectedServices}
                          total={total}
                          formatMoney={formatMoney}
                          paymentMethod={paymentMethod}
                          onChange={updateGiftDetails}
                          onSubmit={submitGift}
                          onPaymentMethodChange={setPaymentMethod}
                          onReset={resetGift}
                          onSaveOrder={saveOrder}
                      />
                  </ProtectedRoute>
              }
          />

          <Route
              path="/payment"
              element={
                  <ProtectedRoute>
                      <PaymentPage
                          selectedServices={selectedServices}
                          total={total}
                          formatMoney={formatMoney}
                          paymentMethod={paymentMethod}
                          onPaymentMethodChange={setPaymentMethod}
                          onSaveOrder={saveOrder}
                          isSaving={isSaving}

                      />
                  </ProtectedRoute>
              }
          />

            <Route
              path="/contact"
              element={<ContactPage />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/access-denied" element={<AccessDenied />} />
              <Route
                path="/admin/add-service"
                element={
                  <ProtectedRoute adminPage={true}>
                    <AddAService 
                      providers={serviceProviders}
                      fetchProviders={fetchProviders}
                      fetchServices={fetchServices} 
                      services={services}

                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/all-users"
                element={
                  <ProtectedRoute adminPage={true}>
                    <AllUsers />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/users/:userId" 
                element = {
                  <ProtectedRoute adminPage={true}>
                    <UserDetails />
                  </ProtectedRoute>
                  }
                />
              <Route
                path="/admin/update-order-status"
                element={
                  <ProtectedRoute adminPage={true}>
                    <UpdateOrderStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute >
                    <Order 
                      selectedCurrency={selectedCurrency}
                      exchangeRates={exchangeRates}
                    />
                  </ProtectedRoute>
                }
              />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; All Rights Reserved by</p>
          <img src={logo} alt="Heart to Home" />
          <span>Heart To Home</span>
        </footer>
      </div>
    </>
  );
}

export default App;