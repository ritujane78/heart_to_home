export const serviceProviders = [
  {
    id: 'kathmandu-care',
    name: 'Kathmandu Care Clinic'
  },
  {
    id: 'clinic-center-a',
    name: 'Clinic Center A'
  },
  {
    id: 'clinic-center-b',
    name: 'Clinic Center B'
  },
  {
    id: 'clinic-center-c',
    name: 'Clinic Center C'
  }
];

export const services = [
  {
    id: 'hs1',
    code: 'HS1',
    providerId: 'kathmandu-care',
    title: 'General Health Checkup',
    description: 'Vitals, physician consultation, basic blood profile, and a written health summary.',
    price: 8500
  },
  {
    id: 'hs2',
    code: 'HS2',
    providerId: 'clinic-center-a',
    title: 'Diabetes Monitoring Package',
    description: 'Fasting sugar, HbA1c, diet guidance, and follow-up coordination for elderly parents.',
    price: 6200
  },
  {
    id: 'hs3',
    code: 'HS3',
    providerId: 'clinic-center-b',
    title: 'Cardiac Screening',
    description: 'ECG, lipid profile, blood pressure review, and cardiology recommendation notes.',
    price: 12800
  },
  {
    id: 'hs4',
    code: 'HS4',
    providerId: 'clinic-center-a',
    title: 'Home Nurse Visit',
    description: 'A trained nurse visits the recipient at home for a check-in and medication review.',
    price: 4800
  },
  {
    id: 'hs5',
    code: 'HS5',
    providerId: 'clinic-center-c',
    title: 'Elder Care Wellness Call',
    description: 'Care coordination call, appointment reminder, and wellbeing report for the sender.',
    price: 3600
  }
];

export const relationships = ['Daughter', 'Son', 'Mom', 'Dad', 'Cousin', 'Friend', 'Uncle', 'Aunt', 'Grandpa', 'Grandma'];

export const initialGift = {
  recipientName: '',
  recipientContact: '',
  relationship: 'Daughter',
  message: '',
  senderName: '',
  senderContact: ''
};
