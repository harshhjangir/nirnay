import { ConnectedCampaign, SuspectIdentifier } from '../types';

export const KNOWN_CAMPAIGNS_DATABASE: ConnectedCampaign[] = [
  {
    id: 'camp-discom-001',
    title: 'State Electricity DISCOM Impersonation Campaign',
    totalReportsCount: 17,
    totalLossEstimate: 482000,
    commonIndicators: [
      '+91 70192 84920',
      'discom.billupdate.982@okaxis',
      '15-minute power cutoff threat message',
      '₹15 verification credit trick'
    ],
    status: 'potentially_connected_reports',
    confidenceNotice: 'Probabilistic match based on matching beneficiary UPI handle, caller phone prefix, and utility disconnection script.',
    matchingIdentifiers: [
      '+91 70192 84920',
      'discom.billupdate.982@okaxis',
      'bescom-bill-update.xyz'
    ]
  },
  {
    id: 'camp-airhelp-002',
    title: 'Google SEO Spoofing Airline Refund Scam',
    totalReportsCount: 8,
    totalLossEstimate: 145000,
    commonIndicators: [
      '+91 91203 94812',
      'airhelp.refunds.912@ybl',
      'Poisoned search result for baggage customer care',
      'UPI collect request labeled REFUND_CREDIT'
    ],
    status: 'potentially_connected_reports',
    confidenceNotice: 'Pattern identified across search engine customer care refund complaints.',
    matchingIdentifiers: [
      '+91 91203 94812',
      'airhelp.refunds.912@ybl'
    ]
  },
  {
    id: 'camp-task-003',
    title: 'Telegram YouTube Rating & VIP Trading Task Scam',
    totalReportsCount: 29,
    totalLossEstimate: 1280000,
    commonIndicators: [
      'Telegram channel @VIP_Rating_Hub',
      'Rotating ICICI / Kotak current accounts',
      'Initial ₹150 trial payouts to establish trust'
    ],
    status: 'potentially_connected_reports',
    confidenceNotice: 'Matches known multi-tier task-based fraud scheme reported across 4 metro regions.',
    matchingIdentifiers: [
      'vip.merchant.rating@icici',
      'telegram.task.trade@kotak'
    ]
  }
];

export function findMatchingCampaign(suspects: SuspectIdentifier[]): ConnectedCampaign | undefined {
  if (!suspects || suspects.length === 0) return undefined;

  for (const susp of suspects) {
    const cleanVal = susp.value.toLowerCase().replace(/[\s\+\-]/g, '');

    for (const campaign of KNOWN_CAMPAIGNS_DATABASE) {
      const match = (campaign.matchingIdentifiers || []).some((id: string) => {
        const cleanId = id.toLowerCase().replace(/[\s\+\-]/g, '');
        return cleanVal.includes(cleanId) || cleanId.includes(cleanVal);
      });

      if (match) {
        return campaign;
      }
    }
  }

  return undefined;
}
