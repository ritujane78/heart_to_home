import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Gift,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound
} from 'lucide-react';

const services = [
  {
    id: 'hs1',
    code: 'HS1',
    clinic: 'Kathmandu Care Clinic',
    title: 'General Health Checkup',
    description: 'Vitals, physician consultation, basic blood profile, and a written health summary.',
    price: 8500
  },
  {
    id: 'hs2',
    code: 'HS2',
    clinic: 'Himal Wellness Center',
    title: 'Diabetes Monitoring Package',
    description: 'Fasting sugar, HbA1c, diet guidance, and follow-up coordination for elderly parents.',
    price: 6200
  },
  {
    id: 'hs3',
    code: 'HS3',
    clinic: 'Valley Heart & Diagnostics',
    title: 'Cardiac Screening',
    description: 'ECG, lipid profile, blood pressure review, and cardiology recommendation notes.',
    price: 12800
  },
  {
    id: 'hs4',
    code: 'HS4',
    clinic: 'Swastha Home Visit',
    title: 'Home Nurse Visit',
    description: 'A trained nurse visits the recipient at home for a check-in and medication review.',
    price: 4800
  },
  {
    id: 'hs5',
    code: 'HS5',
    clinic: 'Kathmandu Senior Support',
    title: 'Elder Care Wellness Call',
    description: 'Care coordination call, appointment reminder, and wellbeing report for the sender.',
    price: 3600
  }
];

const relationships = ['Daughter', 'Son', 'Mom', 'Dad', 'Cousin', 'Friend', 'Uncle', 'Aunt', 'Grandpa', 'Grandma'];

const initialGift = {
  recipientName: '',
  recipientContact: '',
  relationship: 'Daughter',
  message: '',
  senderName: '',
  senderContact: ''
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedIds, setSelectedIds] = useState([]);
  const [giftDetails, setGiftDetails] = useState(initialGift);
  const [giftStarted, setGiftStarted] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const giftFormRef = useRef(null);

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.includes(service.id)),
    [selectedIds]
  );
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const serviceProviderNames = services.map((service) => service.clinic).join(' • ');

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
          <HeartPulse aria-hidden="true" />
          <span>Heart to Home</span>
        </button>
        <nav className="tabs" aria-label="Main navigation">
          <TabButton icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <TabButton icon={<Stethoscope />} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <TabButton icon={<Mail />} label="Contact Us" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
        </nav>
      </header>

      <main>
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
            giftDetails={giftDetails}
            giftStarted={giftStarted}
            paymentReady={paymentReady}
            paymentMethod={paymentMethod}
            giftFormRef={giftFormRef}
            onToggle={toggleService}
            onGiftNow={startGiftFlow}
            onGiftDetailsChange={updateGiftDetails}
            onSubmitGift={submitGift}
            onPaymentMethodChange={setPaymentMethod}
            onReset={resetGift}
          />
        )}

        {activeTab === 'contact' && <ContactPage />}
      </main>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button className={`tab ${active ? 'active' : ''}`} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function HomeDashboard({ selectedCount, onBrowse, onGiftNow }) {
  const trustItems = [
    'Verified service providers',
    'Secure international payments',
    'Transparent pricing',
    'Service tracking',
    'Customer support',
    'Kathmandu coverage first'
  ];

  return (
    <section className="home-grid">
      <div className="hero">
        <p className="eyebrow">For Nepali diaspora families</p>
        <h1>Gift Essential Services to Your Loved Ones in Nepal</h1>
        <p>
          Connecting Nepali Families Through Healthcare. Book health services in Kathmandu for
          parents, grandparents, and relatives while living abroad.
        </p>
        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={onBrowse}>
            <Stethoscope aria-hidden="true" />
            Browse Services
          </button>
          <button className="secondary-action" type="button" onClick={onGiftNow} disabled={selectedCount === 0}>
            <Gift aria-hidden="true" />
            Gift Now
          </button>
        </div>
      </div>

      <div className="process-panel">
        <h2>How gifting works</h2>
        <div className="steps">
          <Step number="1" title="Choose care" text="Pick one or more health services from verified Kathmandu clinics." />
          <Step number="2" title="Add recipient" text="Tell us who the service is for and include a warm personal message." />
          <Step number="3" title="Pay securely" text="Review the total and use a dummy payment option for this prototype." />
          <Step number="4" title="Track service" text="Heart to Home shares updates after the appointment is scheduled." />
        </div>
      </div>

      <section className="trust-section">
        <div>
          <p className="eyebrow">Why trust this platform?</p>
          <h2>Care you can follow from abroad</h2>
        </div>
        <div className="trust-grid">
          {trustItems.map((item) => (
            <div className="trust-item" key={item}>
              <ShieldCheck aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Step({ number, title, text }) {
  return (
    <article className="step">
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function ServicesPage({
  selectedIds,
  selectedServices,
  serviceProviderNames,
  total,
  giftDetails,
  giftStarted,
  paymentReady,
  paymentMethod,
  giftFormRef,
  onToggle,
  onGiftNow,
  onGiftDetailsChange,
  onSubmitGift,
  onPaymentMethodChange,
  onReset
}) {
  return (
    <section className="services-layout">
      <div className="provider-banner">
        <MapPin aria-hidden="true" />
        <span>Kathmandu providers: {serviceProviderNames}</span>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Browse Services</p>
          <h1>Select health services to gift</h1>
        </div>
        <button className="primary-action compact" type="button" onClick={onGiftNow} disabled={selectedIds.length === 0}>
          <Gift aria-hidden="true" />
          Gift Now
        </button>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <label className={`service-card ${selectedIds.includes(service.id) ? 'selected' : ''}`} key={service.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(service.id)}
              onChange={() => onToggle(service.id)}
            />
            <div className="service-card-top">
              <span>{service.code}</span>
              <strong>NPR {service.price.toLocaleString()}</strong>
            </div>
            <h2>{service.title}</h2>
            <p className="clinic-name">{service.clinic}</p>
            <p>{service.description}</p>
          </label>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <aside className="selection-summary">
          <div>
            <strong>{selectedServices.length} selected</strong>
            <span>Total NPR {total.toLocaleString()}</span>
          </div>
          <p>{selectedServices.map((service) => service.code).join(', ')}</p>
        </aside>
      )}

      {giftStarted && selectedServices.length > 0 && (
        <GiftForm
          giftFormRef={giftFormRef}
          giftDetails={giftDetails}
          selectedServices={selectedServices}
          total={total}
          paymentReady={paymentReady}
          paymentMethod={paymentMethod}
          onChange={onGiftDetailsChange}
          onSubmit={onSubmitGift}
          onPaymentMethodChange={onPaymentMethodChange}
          onReset={onReset}
        />
      )}
    </section>
  );
}

function GiftForm({
  giftFormRef,
  giftDetails,
  selectedServices,
  total,
  paymentReady,
  paymentMethod,
  onChange,
  onSubmit,
  onPaymentMethodChange,
  onReset
}) {
  return (
    <section className="gift-flow" ref={giftFormRef}>
      <form className="gift-form" onSubmit={onSubmit}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Gift details</p>
            <h2>Who is receiving this care?</h2>
          </div>
        </div>

        <div className="form-grid">
          <label>
            To name
            <input name="recipientName" value={giftDetails.recipientName} onChange={onChange} required />
          </label>
          <label>
            To contact details
            <input name="recipientContact" value={giftDetails.recipientContact} onChange={onChange} required />
          </label>
          <label>
            Relationship
            <select name="relationship" value={giftDetails.relationship} onChange={onChange}>
              {relationships.map((relationship) => (
                <option key={relationship}>{relationship}</option>
              ))}
            </select>
          </label>
          <label>
            From name
            <input name="senderName" value={giftDetails.senderName} onChange={onChange} required />
          </label>
          <label>
            From contact details
            <input name="senderContact" value={giftDetails.senderContact} onChange={onChange} required />
          </label>
          <label className="wide">
            Message to recipient
            <textarea name="message" value={giftDetails.message} onChange={onChange} rows="4" />
          </label>
        </div>

        <button className="primary-action" type="submit">
          <CheckCircle2 aria-hidden="true" />
          Continue to Payment
        </button>
      </form>

      {paymentReady && (
        <section className="payment-panel">
          <p className="eyebrow">Dummy payment</p>
          <h2>Payment summary</h2>
          <div className="receipt">
            {selectedServices.map((service) => (
              <div key={service.id}>
                <span>{service.code} - {service.title}</span>
                <strong>NPR {service.price.toLocaleString()}</strong>
              </div>
            ))}
            <div className="receipt-total">
              <span>Total to pay</span>
              <strong>NPR {total.toLocaleString()}</strong>
            </div>
          </div>
          <div className="payment-options" role="radiogroup" aria-label="Payment options">
            {['card', 'paypal', 'bank'].map((method) => (
              <label className={paymentMethod === method ? 'active' : ''} key={method}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => onPaymentMethodChange(method)}
                />
                <CreditCard aria-hidden="true" />
                <span>{method === 'card' ? 'International Card' : method === 'paypal' ? 'PayPal' : 'Bank Transfer'}</span>
              </label>
            ))}
          </div>
          <button className="primary-action full" type="button" onClick={onReset}>
            Confirm Dummy Payment
          </button>
        </section>
      )}
    </section>
  );
}

function ContactPage() {
  return (
    <section className="contact-page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Contact Us</p>
          <h1>Heart to Home support</h1>
        </div>
      </div>
      <div className="contact-grid">
        <article>
          <Mail aria-hidden="true" />
          <span>Email</span>
          <strong>owner@hearttohome.com</strong>
        </article>
        <article>
          <Phone aria-hidden="true" />
          <span>Phone</span>
          <strong>+977-980-000-0000</strong>
        </article>
        <article>
          <UserRound aria-hidden="true" />
          <span>Owner</span>
          <strong>Heart to Home Team</strong>
        </article>
      </div>
    </section>
  );
}

export default App;
