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
import NotFound from "./components/NotFound";
import Admin from "./pages/admin/Admin.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from "./components/Auth/AccessDenied";

import {
  DEFAULT_CURRENCY,
  fallbackExchangeRates,
  formatConvertedAmount,
  supportedCurrencies,
} from "./data/currencies.js";

import {
  initialGift,
  serviceProviders,
  services,
} from "./data/services.js";

import { useEffect, useMemo, useRef, useState } from "react";
import Order from "./pages/Order.jsx";

const EXCHANGE_RATE_URL = "https://open.er-api.com/v6/latest/NPR";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [giftDetails, setGiftDetails] = useState(initialGift);
  const [giftStarted, setGiftStarted] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  // const [isActive, setIsActive] = useState(true)

  const [selectedCurrency, setSelectedCurrency] =
    useState(DEFAULT_CURRENCY);

  const [exchangeRates, setExchangeRates] =
    useState(fallbackExchangeRates);

  const [exchangeRateStatus, setExchangeRateStatus] =
    useState("loading");
    const navigate = useNavigate();

  // Access the states by using the useMyContext hook from the ContextProvider
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
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

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.includes(service.id)),
    [selectedIds]
  );

  const total = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const formatMoney = useMemo(
    () => (amount) =>
      formatConvertedAmount(amount, selectedCurrency, exchangeRates),
    [selectedCurrency, exchangeRates]
  );

  const serviceProviderNames = useMemo(() => {
    const providerNamesById = new Map(
      serviceProviders.map((provider) => [provider.id, provider.name])
    );

    return [
      ...new Set(
        services.map((service) =>
          providerNamesById.get(service.providerId)
        )
      ),
    ]
      .filter(Boolean)
      .join(" | ");
  }, []);

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

  function toggleService(id) {
    setSelectedIds((current) => {
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];

      if (next.length === 0) {
        setGiftStarted(false);
      }

      return next;
    });

    setPaymentReady(false);
  }

  function startGiftFlow() {
    if (selectedIds.length === 0) return;

    setGiftStarted(true);
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
    setPaymentReady(true);
  }

  function resetGift() {
    setSelectedIds([]);
    setGiftDetails(initialGift);
    setGiftStarted(false);
    setPaymentReady(false);
    setPaymentMethod("card");
  }

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN"); // Updated to remove token from localStorage
    localStorage.removeItem("USER"); // Remove user details as well
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

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
                    {isAdmin && (
                      <NavLink
                        to="/admin/users"
                        className="dropdown-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin
                      </NavLink>
                    )}
                    {isAdmin || (
                      <NavLink
                        to="/order/users"
                        className="dropdown-item"
                        onClick={() => setMenuOpen(false)}
                      >
                        Orders
                      </NavLink>
                    )}

                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/signup" className="signup-tab">
                Sign Up
              </NavLink>
            )}
          </div>
        </header>

        {/* <DevelopmentBanner /> */}

        <main>
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
                  selectedIds={selectedIds}
                  selectedServices={selectedServices}
                  serviceProviderNames={serviceProviderNames}
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
              path="/contact"
              element={<ContactPage />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/access-denied" element={<AccessDenied />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminPage={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/*"
                element={
                  <ProtectedRoute >
                    <Order />
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