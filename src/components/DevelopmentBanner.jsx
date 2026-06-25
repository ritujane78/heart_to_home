import React from 'react'
import { Gift, MessageCircle, ShieldCheck, Stethoscope, MapPin } from 'lucide-react';

const DevelopmentBanner = () => {
const whatsappLink = 'https://wa.me/9779800000000';
  return (
    <div className="development-banner">
        <MessageCircle aria-hidden="true" />
        <div>
        <strong>Heart to Home is currently in development and testing.</strong>
        <p >
            Some buttons or parts of the website may not be fully functional yet. Everything promised
            here will be fulfilled soon. For now, select the services you like and talk to us more on{' '}
            <a href={whatsappLink} target="_blank" rel="noreferrer">
            WhatsApp
            </a>
            .
        </p>
        <p className="service-location">
            <MapPin size={16} />
            Currently available only in <strong>Kathmandu</strong>.
        </p>
        </div>
    </div>
  )
}

export default DevelopmentBanner
