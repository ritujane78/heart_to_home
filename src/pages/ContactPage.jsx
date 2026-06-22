import { Mail, Phone, UserRound } from 'lucide-react';

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

export default ContactPage;
