import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
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

const EXCHANGE_RATE_URL = "https://open.er-api.com/v6/latest/NPR";

function App() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [giftDetails, setGiftDetails] = useState(initialGift);
  const [giftStarted, setGiftStarted] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isActive, setIsActive] = useState(true)

  const [selectedCurrency, setSelectedCurrency] =
    useState(DEFAULT_CURRENCY);

  const [exchangeRates, setExchangeRates] =
    useState(fallbackExchangeRates);

  const [exchangeRateStatus, setExchangeRateStatus] =
    useState("loading");

  // Access the states by using the useMyContext hook from the ContextProvider
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

  const giftFormRef = useRef(null);

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
    // let isActive = true;

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
      setIsActive(false);
      // isActive = false;
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
    <Router>
      <ScrollToTop />
      <div className="app">
        <header className="topbar">
          <NavLink to="/" className="brand">
            <img src={logo} alt="Heart to Home" className="brand-logo" />
            <span>Heart to Home</span>
          </NavLink>
          

          <nav className="tabs">
            <NavLink to="/"  end className={`tab ${isActive ? "active" : ""}` }>
              <TabButton icon={<Home />} label="Home" />
            </NavLink>

            <NavLink to="/services" className={`tab ${isActive ? "active" : ""}`}>
              <TabButton icon={<Stethoscope />} label="Services" />
            </NavLink>

            <NavLink to="/contact" className={`tab ${isActive ? "active" : ""} `}>
              <TabButton icon={<Mail />} label="Contact Us" />
            </NavLink>
            {token ? (
              <button
                onClick={handleLogout}
                className="w-24 text-center bg-customRed font-semibold px-4 py-2 rounded-sm cursor-pointer hover:text-slate-300 logout-tab"
              >
                LogOut
              </button> 
              ) : (
            <NavLink to="/signup" className="tab signup-tab">
              Sign Up
            </NavLink>
            )}
          </nav>
        </header>

        {/* <DevelopmentBanner /> */}
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; All Rights Reserved by</p>
          <img src={logo} alt="Heart to Home" />
          <span>Heart To Home</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;