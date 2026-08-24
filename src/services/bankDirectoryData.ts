import { BankEmergencyContact } from '../types';

export const BANK_DIRECTORY: BankEmergencyContact[] = [
  {
    bankName: 'State Bank of India (SBI)',
    category: 'Public Sector',
    fraudHelpline: '1800111109',
    tollFree: '18001234',
    smsBlockSyntax: 'BLOCK <Last 4 digits of Card>',
    smsBlockNumber: '567676',
    email: 'report.phishing@sbi.co.in',
    ussdCode: '*99*41#',
    portalUrl: 'https://bank.sbi'
  },
  {
    bankName: 'HDFC Bank',
    category: 'Private Sector',
    fraudHelpline: '18002586161',
    tollFree: '18002664332',
    smsBlockSyntax: 'BLOCK <Card/CustID>',
    smsBlockNumber: '5676712',
    email: 'report.phishing@hdfcbank.com',
    ussdCode: '*99*43#',
    portalUrl: 'https://www.hdfcbank.com'
  },
  {
    bankName: 'ICICI Bank',
    category: 'Private Sector',
    fraudHelpline: '18002662',
    tollFree: '18001080',
    smsBlockSyntax: 'BLOCK <Last 4 digits>',
    smsBlockNumber: '5676766',
    email: 'antiphishing@icicibank.com',
    ussdCode: '*99*44#',
    portalUrl: 'https://www.icicibank.com'
  },
  {
    bankName: 'Axis Bank',
    category: 'Private Sector',
    fraudHelpline: '18004190068',
    tollFree: '18604195555',
    smsBlockSyntax: 'BLOCK <Last 4 digits>',
    smsBlockNumber: '5676782',
    email: 'report.fraud@axisbank.com',
    ussdCode: '*99*45#',
    portalUrl: 'https://www.axisbank.com'
  },
  {
    bankName: 'Punjab National Bank (PNB)',
    category: 'Public Sector',
    fraudHelpline: '18001802222',
    tollFree: '18001032222',
    smsBlockSyntax: 'HOTLIST <Acc/Card>',
    smsBlockNumber: '5607040',
    email: 'care@pnb.co.in',
    portalUrl: 'https://www.pnbindia.in'
  },
  {
    bankName: 'Bank of Baroda (BoB)',
    category: 'Public Sector',
    fraudHelpline: '18002584455',
    tollFree: '18001024455',
    smsBlockSyntax: 'BLOCK <Last 4 digits>',
    smsBlockNumber: '8422009988',
    email: 'cbscare@bankofbaroda.com',
    portalUrl: 'https://www.bankofbaroda.in'
  },
  {
    bankName: 'Kotak Mahindra Bank',
    category: 'Private Sector',
    fraudHelpline: '18602662666',
    tollFree: '18002090000',
    smsBlockSyntax: 'FRAUD <Details>',
    smsBlockNumber: '9971056767',
    email: 'fraud.control@kotak.com',
    portalUrl: 'https://www.kotak.com'
  },
  {
    bankName: 'Canara Bank',
    category: 'Public Sector',
    fraudHelpline: '18004250018',
    tollFree: '18001030',
    smsBlockSyntax: 'CAN <Last 4 digits>',
    smsBlockNumber: '9266623333',
    email: 'digitalfraud@canarabank.com',
    portalUrl: 'https://canarabank.com'
  },
  {
    bankName: 'Paytm Payments Bank',
    category: 'Payments Bank',
    fraudHelpline: '01204456456',
    tollFree: '01203888388',
    smsBlockSyntax: 'BLOCK',
    smsBlockNumber: '01204456456',
    email: 'cyberfraud@paytmbank.com',
    portalUrl: 'https://www.paytmbank.com'
  },
  {
    bankName: 'Airtel Payments Bank',
    category: 'Payments Bank',
    fraudHelpline: '400',
    tollFree: '8800688006',
    smsBlockSyntax: 'BLOCK',
    smsBlockNumber: '8800688006',
    email: 'wecare@airtelbank.com',
    portalUrl: 'https://www.airtel.in/bank'
  },
  {
    bankName: 'IndusInd Bank',
    category: 'Private Sector',
    fraudHelpline: '18602677777',
    tollFree: '18002090061',
    smsBlockSyntax: 'BLOCK <Card/Acc>',
    smsBlockNumber: '9223173927',
    email: 'reachus@indusind.com',
    portalUrl: 'https://www.indusind.com'
  },
  {
    bankName: 'Union Bank of India',
    category: 'Public Sector',
    fraudHelpline: '1800222244',
    tollFree: '18002082244',
    smsBlockSyntax: 'UBIHOT <Card>',
    smsBlockNumber: '09223008486',
    email: 'customercare@unionbankofindia.com',
    portalUrl: 'https://www.unionbankofindia.co.in'
  }
];
