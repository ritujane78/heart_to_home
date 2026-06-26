import { useEffect, useMemo, useRef, useState } from 'react';
import { Home, Mail, Stethoscope } from 'lucide-react';
import logo from './assets/images/logo.png';
import TabButton from './components/TabButton.jsx';
import {
  DEFAULT_CURRENCY,
  fallbackExchangeRates,
  formatConvertedAmount,
  supportedCurrencies
} from './data/currencies.js';
import { initialGift, serviceProviders, services } from './data/services.js';
import ContactPage from './pages/ContactPage.jsx';
import HomeDashboard from './pages/HomeDashboard.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import DevelopmentBanner from './components/DevelopmentBanner.jsx';

const EXCHANGE_RATE_URL = 'https://open.er-api.com/v6/latest/NPR';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedIds, setSelectedIds] = useState([]);
  const [giftDetails, setGiftDetails] = useState(initialGift);
  const [giftStarted, setGiftStarted] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState(fallbackExchangeRates);
  const [exchangeRateStatus, setExchangeRateStatus] = useState('loading');
  const giftFormRef = useRef(null);

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.includes(service.id)),
    [selectedIds]
  );
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const formatMoney = useMemo(
    () => (amountNpr) => formatConvertedAmount(amountNpr, selectedCurrency, exchangeRates),
    [exchangeRates, selectedCurrency]
  );
  const serviceProviderNames = useMemo(() => {
    const providerNamesById = new Map(
      serviceProviders.map((provider) => [provider.id, provider.name])
    );
    const uniqueProviderNames = new Set(
      services.map((service) => providerNamesById.get(service.providerId))
    );

    return [...uniqueProviderNames].filter(Boolean).join(' | ');
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadExchangeRates() {
      try {
        setExchangeRateStatus('loading');
        const response = await fetch(EXCHANGE_RATE_URL);

        if (!response.ok) {
          throw new Error('Exchange rate request failed');
        }

        const data = await response.json();

        if (!data.rates) {
          throw new Error('Exchange rate response was missing rates');
        }

        const nextRates = supportedCurrencies.reduce((rates, currency) => {
          rates[currency.code] = Number(data.rates[currency.code] ?? fallbackExchangeRates[currency.code]);
          return rates;
        }, {});

        if (isActive) {
          setExchangeRates({ ...fallbackExchangeRates, ...nextRates, NPR: 1 });
          setExchangeRateStatus('live');
        }
      } catch {
        if (isActive) {
          setExchangeRates(fallbackExchangeRates);
          setExchangeRateStatus('fallback');
        }
      }
    }

    loadExchangeRates();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (giftStarted && selectedServices.length > 0) {
      giftFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [giftStarted, selectedServices.length]);

  function toggleService(serviceId) {
    setSelectedIds((current) => {
      const nextSelectedIds = current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId];

      if (nextSelectedIds.length === 0) {
        setGiftStarted(false);
      }

      return nextSelectedIds;
    });
    setPaymentReady(false);
  }

  function startGiftFlow() {
    if (selectedIds.length === 0) return;
    setGiftStarted(true);
    setPaymentReady(false);
    setActiveTab('services');
  }

  function updateGiftDetails(event) {
    const { name, value } = event.target;
    setGiftDetails((current) => ({ ...current, [name]: value }));
  }

  function submitGift(event) {
    event.preventDefault();
    setPaymentReady(true);
  }

  function resetGift() {
    setSelectedIds([]);
    setGiftDetails(initialGift);
    setGiftStarted(false);
    setPaymentReady(false);
    setPaymentMethod('card');
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setActiveTab('home')}>
          <img src={logo} alt="Heart to Home" className="brand-logo" />
          <span>Heart to Home</span>
        </button>
        <nav className="tabs" aria-label="Main navigation">
          <TabButton icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <TabButton icon={<Stethoscope />} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <TabButton icon={<Mail />} label="Contact Us" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
        </nav>
      </header>

      <main>
        <DevelopmentBanner />
        {activeTab === 'home' && (
          <HomeDashboard
            selectedCount={selectedIds.length}
            onBrowse={() => setActiveTab('services')}
            onGiftNow={startGiftFlow}
          />
        )}

        {activeTab === 'services' && (
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
        )}

        {activeTab === 'contact' && <ContactPage />}
      </main>
        <footer>
          <p>&copy; All Rights Reserved by </p>
          <img src={logo} alt="Heart to Home" />
          <span>Heart To Home</span>
      </footer>
    </div>
  );
}

export default App;
