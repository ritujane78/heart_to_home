import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
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
import AllUsers from "./pages/admin/AllUsers.jsx";
import AllOrders from "./pages/admin/AllOrders.jsx";
import OrderDetails from "./pages/admin/OrderDetails.jsx";

import GiftForm from "./pages/GiftForm";
import PaymentPage from "./pages/PaymentPage";

import toast from "react-hot-toast";

import { Toaster } from "react-hot-toast";
import { PlusCircle, Pencil, Users, ClipboardList, LogOut } from "lucide-react";

import {
  DEFAULT_CURRENCY,
  fallbackExchangeRates,
  formatConvertedAmount,
  supportedCurrencies,
} from "./data/defaultValues.js";

import { useEffect, useMemo, useRef, useState } from "react";
import Order from "./pages/Order.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import UserDetails from "./pages/admin/UserDetails.jsx";
import {
  currencySymbols,
  zeroDecimalCurrencies,
} from "./data/defaultValues.js";
import { handleApiError } from "./utils/errorHandler";
const EXCHANGE_RATE_URL =
  "https://api.frankfurter.dev/v2/rates?base=NPR&quotes=USD,GBP,EUR,AUD,CAD,JPY";

function App() {
  const initialGift = {
    recipientName: "",
    recipientPhone: "",
    relationship: "Daughter",
    message: "",
    senderName: "",
    senderEmail: "",
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [giftDetails, setGiftDetails] = useState(initialGift);
  const [giftStarted, setGiftStarted] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [providerNames, setProviderNames] = useState([]);
  const [disabledServices, setDisabledServices] = useState([]);

  const fetchServices = async (pageNumber = 1, keyword = "") => {
    try {
      const response = await api.get("/services", {
        params: {
          page: pageNumber - 1,
          size: 6,
          keyword,
        },
      });

      setServices(response.data.services.content);
      setTotalPages(response.data.services.totalPages);
      setTotalServices(response.data.services.totalElements);

      if (keyword === "") {
        setProviderNames(response.data.providerNames);
      }
      
      return response.data.services;
    } catch (error) {
      handleApiError(error, "Unable to load healthcare services.");

      return null;
    }
  };
  const fetchProviders = async () => {
    try {
      const response = await api.get("/providers");
      setServiceProviders(response.data);
    } catch (error) {
      handleApiError(error, "Unable to load providers.");
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);

  const [exchangeRates, setExchangeRates] = useState(fallbackExchangeRates);

  const [exchangeRateStatus, setExchangeRateStatus] = useState("loading");
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

  const total = useMemo(() => {
    const rate =
      exchangeRates[selectedCurrency] ??
      fallbackExchangeRates[selectedCurrency] ??
      1;

    const convertedTotal = zeroDecimalCurrencies.has(selectedCurrency)
      ? selectedServices.reduce(
          (sum, service) => sum + Math.round(service.price * rate),
          0,
        )
      : selectedServices.reduce((sum, service) => {
          const rounded = Math.round(service.price * rate * 100) / 100;
          return sum + rounded;
        }, 0);

    const fractionDigits = zeroDecimalCurrencies.has(selectedCurrency) ? 0 : 2;

    return `${currencySymbols[selectedCurrency] ?? `${selectedCurrency} `}${convertedTotal.toLocaleString(
      undefined,
      {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      },
    )}`;
  }, [selectedServices, selectedCurrency, exchangeRates]);

  const totalNpr = useMemo(
    () => selectedServices.reduce((sum, service) => sum + service.price, 0),
    [selectedServices],
  );
  const formatMoney = useMemo(
    () => (amount) =>
      formatConvertedAmount(amount, selectedCurrency, exchangeRates),
    [selectedCurrency, exchangeRates],
  );

  const serviceProviderNames = useMemo(() => {
    return providerNames.join(" | ");
  }, [providerNames]);

  const providerMap = useMemo(
    () =>
      new Map(serviceProviders.map((provider) => [provider.id, provider.name])),
    [],
  );

  useEffect(() => {
    let isActive = true;

    async function loadRates() {
      try {
        const response = await fetch(EXCHANGE_RATE_URL);

        if (!response.ok) throw new Error();

        const data = await response.json();

        console.log("Exchange rate data:", data);

        const ratesMap = data.reduce((acc, item) => {
          acc[item.quote] = item.rate;
          return acc;
        }, {});

        const nextRates = supportedCurrencies.reduce((rates, currency) => {
          rates[currency.code] =
            ratesMap[currency.code] ?? fallbackExchangeRates[currency.code];

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
  const saveOrder = async () => {
    if (isSaving) return;

    setIsSaving(true);
    const exchangeRate = exchangeRates[selectedCurrency];

    try {
      const giftOrderRequest = {
        recipientName: giftDetails.recipientName,
        recipientPhone: giftDetails.recipientPhone,

        relationship: giftDetails.relationship,

        senderName: giftDetails.senderName,
        senderEmail: giftDetails.senderEmail,

        message: giftDetails.message,

        serviceIds: selectedServices.map((service) => service.id),

        totalPrice: total,

        currency: selectedCurrency,

        exchangeRate: exchangeRate,
      };

      return await api.post("/orders", giftOrderRequest);
    } catch (error) {
      handleApiError(error, "Unable to place your order. Please try again.");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  function toggleService(service) {
    if (selectedIds.includes(service.id)) {
      setSelectedIds((prev) => prev.filter((id) => id !== service.id));

      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedIds((prev) => [...prev, service.id]);

      setSelectedServices((prev) => [...prev, service]);
    }

    setPaymentReady(false);
  }
  const fetchDisabledServices = async () => {
    try {
      const response = await api.get("/admin/disabled-services");
      setDisabledServices(response.data);
    } catch (error) {
      handleApiError(error, "Unable to load disabled services.");
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchDisabledServices();
    }
  }, [token, isAdmin]);

  function removeDeletedService(id) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));

    setSelectedServices((prev) => prev.filter((service) => service.id !== id));
    setSelectedIds((current) => {
      const next = current.filter((serviceId) => serviceId !== id);

      if (next.length === 0) {
        setGiftStarted(false);
      }
      fetchDisabledServices();

      return next;
    });

    setPaymentReady(false);
  }

  function startGiftFlow() {
    if (selectedIds.length === 0) return;

    navigate("/gift");

    setPaymentReady(false);
  }

  function updateGiftDetails(e) {
    const { name, value } = e.target;

    const nextValue =
      name === "recipientPhone" ? value.replace(/\D/g, "") : value;

    setGiftDetails((current) => ({
      ...current,
      [name]: nextValue,
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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      handleApiError(error, "Logout failed.");
    } finally {
      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("REFRESH_TOKEN");
      localStorage.removeItem("USER");
      localStorage.removeItem("IS_ADMIN");

      setToken(null);
      setCurrentUser(null);
      setIsAdmin(false);
      toast.success("Logout Successful");
      navigate("/login", { replace: true });
    }
  };
  const adminItems = [
    {
      title: "All Users",
      icon: <Users className="w-6 h-6" />,
      path: "/admin/all-users",
    },
    {
      title: "All Orders",
      icon: <ClipboardList className="w-6 h-6" />,
      path: "/admin/all-orders",
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

            {token && (
              <div
                className="user-menu transition active:scale-[0.95]"
                ref={menuRef}
              >
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
            )}
          </div>
          {!token && (
            <div className="auth-buttons">
              <NavLink to="/login" className="login-tab">
                Log In
              </NavLink>

              <NavLink to="/signup" className="signup-tab">
                Sign Up
              </NavLink>
            </div>
          )}
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
                  onBrowse={() => navigate("/services")}
                  onGiftNow={startGiftFlow}
                />
              }
            />

            <Route
              path="/services"
              element={
                <ServicesPage
                  selectedIds={selectedIds}
                  selectedServices={selectedServices}
                  serviceProviderNames={serviceProviderNames}
                  disabledServices={disabledServices}
                  fetchDisabledServices={fetchDisabledServices}
                  services={services}
                  totalPages={totalPages}
                  totalServices={totalServices}
                  fetchServices={fetchServices}
                  onServiceDeleted={removeDeletedService}
                  total={total}
                  selectedCurrency={selectedCurrency}
                  currencies={supportedCurrencies}
                  formatMoney={formatMoney}
                  onToggle={toggleService}
                  onCurrencyChange={setSelectedCurrency}
                  onGiftNow={startGiftFlow}
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
                    giftDetails={giftDetails}
                    total={total}
                    formatMoney={formatMoney}
                    selectedCurrency={selectedCurrency}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    onSaveOrder={saveOrder}
                    isSaving={isSaving}
                    setIsSaving={setIsSaving}
                    resetGift={resetGift}
                    onServicesUpdated={(services) => {
                      setSelectedServices(services);
                      setSelectedIds(services.map((service) => service.id));
                    }}
                    totalNpr={totalNpr}
                  />
                </ProtectedRoute>
              }
            />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            <Route
              path="/admin/all-orders"
              element={
                <ProtectedRoute adminPage={true}>
                  <AllOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute adminPage={true}>
                  <OrderDetails />
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
              element={
                <ProtectedRoute adminPage={true}>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
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
