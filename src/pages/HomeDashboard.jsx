import { Gift, ShieldCheck, Stethoscope } from 'lucide-react';
import Step from '../components/Step.jsx';

const trustItems = [
  'Verified service providers',
  'Secure international payments',
  'Transparent pricing',
  'Service tracking',
  'Customer support',
  'Kathmandu coverage first'
];

function HomeDashboard({ selectedCount, onBrowse, onGiftNow }) {
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
          <Step number="4" title="Track service?" text="Heart to Home shares updates after the appointment is scheduled." />
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

export default HomeDashboard;
