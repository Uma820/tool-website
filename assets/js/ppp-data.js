/**
 * Purchasing Power Parity (PPP) Country Dataset
 * 125+ countries with World Bank / OECD PPP conversion ratios, currency codes,
 * symbols, market FX rates per 1 USD, regional groupings, and SaaS tiers.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PPPData = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Region definitions
  // 'popular', 'asia', 'europe', 'latam', 'mea', 'americas', 'oceania'

  const COUNTRIES = [
    // North America & Developed SaaS Markets
    { code: 'US', name: 'United States', flag: '🇺🇸', region: 'americas', isPopular: true, pppRatio: 1.00, currencyCode: 'USD', currencySymbol: '$', fxRate: 1.00 },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'americas', isPopular: true, pppRatio: 0.86, currencyCode: 'CAD', currencySymbol: 'CA$', fxRate: 1.38 },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'europe', isPopular: true, pppRatio: 0.88, currencyCode: 'GBP', currencySymbol: '£', fxRate: 0.79 },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'europe', isPopular: true, pppRatio: 0.84, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'FR', name: 'France', flag: '🇫🇷', region: 'europe', isPopular: true, pppRatio: 0.83, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'europe', isPopular: true, pppRatio: 0.85, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'europe', isPopular: true, pppRatio: 1.18, currencyCode: 'CHF', currencySymbol: 'CHF', fxRate: 0.89 },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'oceania', isPopular: true, pppRatio: 0.87, currencyCode: 'AUD', currencySymbol: 'A$', fxRate: 1.54 },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'oceania', isPopular: false, pppRatio: 0.84, currencyCode: 'NZD', currencySymbol: 'NZ$', fxRate: 1.70 },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'asia', isPopular: true, pppRatio: 0.72, currencyCode: 'JPY', currencySymbol: '¥', fxRate: 152.0 },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'asia', isPopular: true, pppRatio: 0.75, currencyCode: 'KRW', currencySymbol: '₩', fxRate: 1390.0 },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'asia', isPopular: true, pppRatio: 0.85, currencyCode: 'SGD', currencySymbol: 'S$', fxRate: 1.34 },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'asia', isPopular: false, pppRatio: 0.82, currencyCode: 'HKD', currencySymbol: 'HK$', fxRate: 7.78 },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'europe', isPopular: true, pppRatio: 0.86, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'europe', isPopular: true, pppRatio: 0.86, currencyCode: 'SEK', currencySymbol: 'kr', fxRate: 10.6 },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'europe', isPopular: false, pppRatio: 1.08, currencyCode: 'NOK', currencySymbol: 'kr', fxRate: 10.9 },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'europe', isPopular: false, pppRatio: 0.95, currencyCode: 'DKK', currencySymbol: 'kr', fxRate: 6.88 },
    { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'europe', isPopular: false, pppRatio: 0.85, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'europe', isPopular: false, pppRatio: 0.84, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'europe', isPopular: false, pppRatio: 0.84, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'europe', isPopular: true, pppRatio: 0.78, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'europe', isPopular: true, pppRatio: 0.72, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'europe', isPopular: false, pppRatio: 0.65, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'mea', isPopular: true, pppRatio: 0.92, currencyCode: 'ILS', currencySymbol: '₪', fxRate: 3.70 },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'mea', isPopular: true, pppRatio: 0.82, currencyCode: 'AED', currencySymbol: 'AED', fxRate: 3.67 },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'mea', isPopular: false, pppRatio: 0.70, currencyCode: 'SAR', currencySymbol: 'SAR', fxRate: 3.75 },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'mea', isPopular: false, pppRatio: 0.78, currencyCode: 'QAR', currencySymbol: 'QAR', fxRate: 3.64 },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'mea', isPopular: false, pppRatio: 0.75, currencyCode: 'KWD', currencySymbol: 'KWD', fxRate: 0.31 },

    // High Growth Emerging SaaS Markets
    { code: 'IN', name: 'India', flag: '🇮🇳', region: 'asia', isPopular: true, pppRatio: 0.28, currencyCode: 'INR', currencySymbol: '₹', fxRate: 85.5 },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'latam', isPopular: true, pppRatio: 0.42, currencyCode: 'BRL', currencySymbol: 'R$', fxRate: 5.80 },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'europe', isPopular: true, pppRatio: 0.52, currencyCode: 'PLN', currencySymbol: 'zł', fxRate: 4.05 },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'latam', isPopular: true, pppRatio: 0.48, currencyCode: 'MXN', currencySymbol: 'Mex$', fxRate: 20.2 },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'asia', isPopular: true, pppRatio: 0.32, currencyCode: 'IDR', currencySymbol: 'Rp', fxRate: 15800.0 },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'europe', isPopular: true, pppRatio: 0.30, currencyCode: 'TRY', currencySymbol: '₺', fxRate: 35.2 },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'mea', isPopular: true, pppRatio: 0.24, currencyCode: 'NGN', currencySymbol: '₦', fxRate: 1550.0 },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'asia', isPopular: true, pppRatio: 0.34, currencyCode: 'PHP', currencySymbol: '₱', fxRate: 58.5 },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'asia', isPopular: true, pppRatio: 0.29, currencyCode: 'VND', currencySymbol: '₫', fxRate: 25400.0 },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'mea', isPopular: true, pppRatio: 0.44, currencyCode: 'ZAR', currencySymbol: 'R', fxRate: 18.2 },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'mea', isPopular: true, pppRatio: 0.22, currencyCode: 'EGP', currencySymbol: 'E£', fxRate: 49.5 },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'asia', isPopular: true, pppRatio: 0.22, currencyCode: 'PKR', currencySymbol: 'Rs', fxRate: 278.0 },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'asia', isPopular: true, pppRatio: 0.25, currencyCode: 'BDT', currencySymbol: '৳', fxRate: 120.0 },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'latam', isPopular: true, pppRatio: 0.35, currencyCode: 'ARS', currencySymbol: 'AR$', fxRate: 1020.0 },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'latam', isPopular: true, pppRatio: 0.38, currencyCode: 'COP', currencySymbol: 'Col$', fxRate: 4400.0 },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'latam', isPopular: false, pppRatio: 0.58, currencyCode: 'CLP', currencySymbol: 'CLP$', fxRate: 970.0 },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'latam', isPopular: false, pppRatio: 0.42, currencyCode: 'PEN', currencySymbol: 'S/', fxRate: 3.75 },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'asia', isPopular: true, pppRatio: 0.40, currencyCode: 'THB', currencySymbol: '฿', fxRate: 34.5 },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'asia', isPopular: true, pppRatio: 0.46, currencyCode: 'MYR', currencySymbol: 'RM', fxRate: 4.45 },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼', region: 'asia', isPopular: true, pppRatio: 0.62, currencyCode: 'TWD', currencySymbol: 'NT$', fxRate: 32.5 },

    // Rest of Europe
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'europe', isPopular: false, pppRatio: 0.58, currencyCode: 'CZK', currencySymbol: 'Kč', fxRate: 23.8 },
    { code: 'RO', name: 'Romania', flag: '🇷🇴', region: 'europe', isPopular: false, pppRatio: 0.48, currencyCode: 'RON', currencySymbol: 'lei', fxRate: 4.65 },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺', region: 'europe', isPopular: false, pppRatio: 0.50, currencyCode: 'HUF', currencySymbol: 'Ft', fxRate: 380.0 },
    { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'europe', isPopular: false, pppRatio: 0.62, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', region: 'europe', isPopular: false, pppRatio: 0.45, currencyCode: 'BGN', currencySymbol: 'лв', fxRate: 1.80 },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷', region: 'europe', isPopular: false, pppRatio: 0.58, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰', region: 'europe', isPopular: false, pppRatio: 0.56, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮', region: 'europe', isPopular: false, pppRatio: 0.65, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪', region: 'europe', isPopular: false, pppRatio: 0.68, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'LV', name: 'Latvia', flag: '🇱🇻', region: 'europe', isPopular: false, pppRatio: 0.60, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'LT', name: 'Lithuania', flag: '🇱🇹', region: 'europe', isPopular: false, pppRatio: 0.60, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾', region: 'europe', isPopular: false, pppRatio: 0.72, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'MT', name: 'Malta', flag: '🇲🇹', region: 'europe', isPopular: false, pppRatio: 0.74, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'IS', name: 'Iceland', flag: '🇮🇸', region: 'europe', isPopular: false, pppRatio: 1.15, currencyCode: 'ISK', currencySymbol: 'kr', fxRate: 138.0 },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'europe', isPopular: false, pppRatio: 1.05, currencyCode: 'EUR', currencySymbol: '€', fxRate: 0.92 },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸', region: 'europe', isPopular: false, pppRatio: 0.45, currencyCode: 'RSD', currencySymbol: 'дин.', fxRate: 108.0 },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'europe', isPopular: true, pppRatio: 0.28, currencyCode: 'UAH', currencySymbol: '₴', fxRate: 41.5 },
    { code: 'GE', name: 'Georgia', flag: '🇬🇪', region: 'europe', isPopular: false, pppRatio: 0.38, currencyCode: 'GEL', currencySymbol: '₾', fxRate: 2.75 },
    { code: 'AM', name: 'Armenia', flag: '🇦🇲', region: 'europe', isPopular: false, pppRatio: 0.36, currencyCode: 'AMD', currencySymbol: '֏', fxRate: 388.0 },
    { code: 'MD', name: 'Moldova', flag: '🇲🇩', region: 'europe', isPopular: false, pppRatio: 0.32, currencyCode: 'MDL', currencySymbol: 'L', fxRate: 18.1 },
    { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'europe', isPopular: false, pppRatio: 0.44, currencyCode: 'BAM', currencySymbol: 'KM', fxRate: 1.80 },
    { code: 'AL', name: 'Albania', flag: '🇦🇱', region: 'europe', isPopular: false, pppRatio: 0.42, currencyCode: 'ALL', currencySymbol: 'Lek', fxRate: 93.0 },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', region: 'europe', isPopular: false, pppRatio: 0.42, currencyCode: 'MKD', currencySymbol: 'ден', fxRate: 56.8 },

    // Rest of Asia
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'asia', isPopular: false, pppRatio: 0.26, currencyCode: 'LKR', currencySymbol: 'Rs', fxRate: 292.0 },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'asia', isPopular: false, pppRatio: 0.24, currencyCode: 'NPR', currencySymbol: 'Rs', fxRate: 135.0 },
    { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', region: 'asia', isPopular: false, pppRatio: 0.38, currencyCode: 'KZT', currencySymbol: '₸', fxRate: 495.0 },
    { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', region: 'asia', isPopular: false, pppRatio: 0.26, currencyCode: 'UZS', currencySymbol: 'soʻm', fxRate: 12800.0 },
    { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', region: 'asia', isPopular: false, pppRatio: 0.35, currencyCode: 'AZN', currencySymbol: '₼', fxRate: 1.70 },
    { code: 'KH', name: 'Cambodia', flag: '🇰🇭', region: 'asia', isPopular: false, pppRatio: 0.32, currencyCode: 'KHR', currencySymbol: '៛', fxRate: 4050.0 },
    { code: 'LA', name: 'Laos', flag: '🇱🇦', region: 'asia', isPopular: false, pppRatio: 0.25, currencyCode: 'LAK', currencySymbol: '₭', fxRate: 21800.0 },
    { code: 'MM', name: 'Myanmar', flag: '🇲🇲', region: 'asia', isPopular: false, pppRatio: 0.24, currencyCode: 'MMK', currencySymbol: 'K', fxRate: 2100.0 },
    { code: 'MN', name: 'Mongolia', flag: '🇲🇳', region: 'asia', isPopular: false, pppRatio: 0.36, currencyCode: 'MNT', currencySymbol: '₮', fxRate: 3410.0 },
    { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'asia', isPopular: false, pppRatio: 0.28, currencyCode: 'KGS', currencySymbol: 'с', fxRate: 86.5 },
    { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', region: 'asia', isPopular: false, pppRatio: 0.22, currencyCode: 'TJS', currencySymbol: 'смн', fxRate: 10.9 },

    // Rest of Latin America & Caribbean
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'latam', isPopular: false, pppRatio: 0.65, currencyCode: 'UYU', currencySymbol: '$U', fxRate: 42.5 },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'latam', isPopular: false, pppRatio: 0.58, currencyCode: 'CRC', currencySymbol: '₡', fxRate: 512.0 },
    { code: 'PA', name: 'Panama', flag: '🇵🇦', region: 'latam', isPopular: false, pppRatio: 0.55, currencyCode: 'PAB', currencySymbol: 'B/.', fxRate: 1.00 },
    { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', region: 'latam', isPopular: false, pppRatio: 0.44, currencyCode: 'DOP', currencySymbol: 'RD$', fxRate: 60.2 },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨', region: 'latam', isPopular: false, pppRatio: 0.45, currencyCode: 'USD', currencySymbol: '$', fxRate: 1.00 },
    { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'latam', isPopular: false, pppRatio: 0.42, currencyCode: 'GTQ', currencySymbol: 'Q', fxRate: 7.72 },
    { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'latam', isPopular: false, pppRatio: 0.36, currencyCode: 'BOB', currencySymbol: 'Bs', fxRate: 6.91 },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'latam', isPopular: false, pppRatio: 0.38, currencyCode: 'PYG', currencySymbol: '₲', fxRate: 7850.0 },
    { code: 'SV', name: 'El Salvador', flag: '🇸🇻', region: 'latam', isPopular: false, pppRatio: 0.42, currencyCode: 'USD', currencySymbol: '$', fxRate: 1.00 },
    { code: 'HN', name: 'Honduras', flag: '🇭🇳', region: 'latam', isPopular: false, pppRatio: 0.38, currencyCode: 'HNL', currencySymbol: 'L', fxRate: 25.1 },
    { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', region: 'latam', isPopular: false, pppRatio: 0.32, currencyCode: 'NIO', currencySymbol: 'C$', fxRate: 36.8 },
    { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'latam', isPopular: false, pppRatio: 0.52, currencyCode: 'JMD', currencySymbol: 'J$', fxRate: 157.0 },
    { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'latam', isPopular: false, pppRatio: 0.60, currencyCode: 'TTD', currencySymbol: 'TT$', fxRate: 6.78 },

    // Middle East & Africa (MEA)
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'mea', isPopular: true, pppRatio: 0.32, currencyCode: 'KES', currencySymbol: 'KSh', fxRate: 129.0 },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'mea', isPopular: true, pppRatio: 0.28, currencyCode: 'GHS', currencySymbol: 'GH₵', fxRate: 16.5 },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'mea', isPopular: true, pppRatio: 0.38, currencyCode: 'MAD', currencySymbol: 'MAD', fxRate: 10.0 },
    { code: 'DZ', name: 'Algeria', flag: '🇩🇿', region: 'mea', isPopular: false, pppRatio: 0.30, currencyCode: 'DZD', currencySymbol: 'DA', fxRate: 133.0 },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳', region: 'mea', isPopular: false, pppRatio: 0.32, currencyCode: 'TND', currencySymbol: 'DT', fxRate: 3.12 },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'mea', isPopular: false, pppRatio: 0.20, currencyCode: 'ETB', currencySymbol: 'Br', fxRate: 124.0 },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', region: 'mea', isPopular: false, pppRatio: 0.24, currencyCode: 'UGX', currencySymbol: 'USh', fxRate: 3680.0 },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'mea', isPopular: false, pppRatio: 0.26, currencyCode: 'TZS', currencySymbol: 'TSh', fxRate: 2600.0 },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼', region: 'mea', isPopular: false, pppRatio: 0.28, currencyCode: 'RWF', currencySymbol: 'RF', fxRate: 1370.0 },
    { code: 'SN', name: 'Senegal', flag: '🇸🇳', region: 'mea', isPopular: false, pppRatio: 0.30, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', region: 'mea', isPopular: false, pppRatio: 0.32, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'CM', name: 'Cameroon', flag: '🇨🇲', region: 'mea', isPopular: false, pppRatio: 0.28, currencyCode: 'XAF', currencySymbol: 'FCFA', fxRate: 615.0 },
    { code: 'ZM', name: 'Zambia', flag: '🇿🇲', region: 'mea', isPopular: false, pppRatio: 0.25, currencyCode: 'ZMW', currencySymbol: 'ZK', fxRate: 27.5 },
    { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', region: 'mea', isPopular: false, pppRatio: 0.22, currencyCode: 'USD', currencySymbol: '$', fxRate: 1.00 },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'mea', isPopular: false, pppRatio: 0.54, currencyCode: 'MUR', currencySymbol: '₨', fxRate: 46.5 },
    { code: 'JO', name: 'Jordan', flag: '🇯🇴', region: 'mea', isPopular: false, pppRatio: 0.50, currencyCode: 'JOD', currencySymbol: 'JD', fxRate: 0.71 },
    { code: 'LB', name: 'Lebanon', flag: '🇱🇧', region: 'mea', isPopular: false, pppRatio: 0.26, currencyCode: 'USD', currencySymbol: '$', fxRate: 1.00 },
    { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'mea', isPopular: false, pppRatio: 0.72, currencyCode: 'OMR', currencySymbol: 'OMR', fxRate: 0.38 },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'mea', isPopular: false, pppRatio: 0.74, currencyCode: 'BHD', currencySymbol: 'BD', fxRate: 0.38 },
    { code: 'IQ', name: 'Iraq', flag: '🇮🇶', region: 'mea', isPopular: false, pppRatio: 0.35, currencyCode: 'IQD', currencySymbol: 'ع.د', fxRate: 1310.0 },

    // Additional Global Software & Freelancer Markets
    { code: 'GE', name: 'Georgia', flag: '🇬🇪', region: 'europe', isPopular: false, pppRatio: 0.38, currencyCode: 'GEL', currencySymbol: '₾', fxRate: 2.75 },
    { code: 'BN', name: 'Brunei', flag: '🇧🇳', region: 'asia', isPopular: false, pppRatio: 0.68, currencyCode: 'BND', currencySymbol: 'B$', fxRate: 1.34 },
    { code: 'FJ', name: 'Fiji', flag: '🇫🇯', region: 'oceania', isPopular: false, pppRatio: 0.42, currencyCode: 'FJD', currencySymbol: 'FJ$', fxRate: 2.25 },
    { code: 'NA', name: 'Namibia', flag: '🇳🇦', region: 'mea', isPopular: false, pppRatio: 0.42, currencyCode: 'NAD', currencySymbol: 'N$', fxRate: 18.2 },
    { code: 'BW', name: 'Botswana', flag: '🇧🇼', region: 'mea', isPopular: false, pppRatio: 0.45, currencyCode: 'BWP', currencySymbol: 'P', fxRate: 13.5 },
    { code: 'AO', name: 'Angola', flag: '🇦🇴', region: 'mea', isPopular: false, pppRatio: 0.26, currencyCode: 'AOA', currencySymbol: 'Kz', fxRate: 915.0 },
    { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', region: 'mea', isPopular: false, pppRatio: 0.22, currencyCode: 'MZN', currencySymbol: 'MT', fxRate: 63.8 },
    { code: 'MG', name: 'Madagascar', flag: '🇲🇬', region: 'mea', isPopular: false, pppRatio: 0.20, currencyCode: 'MGA', currencySymbol: 'Ar', fxRate: 4650.0 },
    { code: 'MW', name: 'Malawi', flag: '🇲🇼', region: 'mea', isPopular: false, pppRatio: 0.18, currencyCode: 'MWK', currencySymbol: 'MK', fxRate: 1740.0 },
    { code: 'CD', name: 'DR Congo', flag: '🇨🇩', region: 'mea', isPopular: false, pppRatio: 0.20, currencyCode: 'CDF', currencySymbol: 'FC', fxRate: 2850.0 },
    { code: 'CG', name: 'Republic of the Congo', flag: '🇨🇬', region: 'mea', isPopular: false, pppRatio: 0.25, currencyCode: 'XAF', currencySymbol: 'FCFA', fxRate: 615.0 },
    { code: 'GA', name: 'Gabon', flag: '🇬🇦', region: 'mea', isPopular: false, pppRatio: 0.40, currencyCode: 'XAF', currencySymbol: 'FCFA', fxRate: 615.0 },
    { code: 'GN', name: 'Guinea', flag: '🇬🇳', region: 'mea', isPopular: false, pppRatio: 0.22, currencyCode: 'GNF', currencySymbol: 'FG', fxRate: 8650.0 },
    { code: 'ML', name: 'Mali', flag: '🇲🇱', region: 'mea', isPopular: false, pppRatio: 0.25, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', region: 'mea', isPopular: false, pppRatio: 0.24, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'NE', name: 'Niger', flag: '🇳🇪', region: 'mea', isPopular: false, pppRatio: 0.22, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'TD', name: 'Chad', flag: '🇹🇩', region: 'mea', isPopular: false, pppRatio: 0.22, currencyCode: 'XAF', currencySymbol: 'FCFA', fxRate: 615.0 },
    { code: 'SD', name: 'Sudan', flag: '🇸🇩', region: 'mea', isPopular: false, pppRatio: 0.18, currencyCode: 'SDG', currencySymbol: 'SDG', fxRate: 600.0 },
    { code: 'LY', name: 'Libya', flag: '🇱🇾', region: 'mea', isPopular: false, pppRatio: 0.35, currencyCode: 'LYD', currencySymbol: 'LD', fxRate: 4.88 },
    { code: 'MR', name: 'Mauritania', flag: '🇲🇷', region: 'mea', isPopular: false, pppRatio: 0.28, currencyCode: 'MRU', currencySymbol: 'UM', fxRate: 39.8 },
    { code: 'TG', name: 'Togo', flag: '🇹🇬', region: 'mea', isPopular: false, pppRatio: 0.25, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'BJ', name: 'Benin', flag: '🇧🇯', region: 'mea', isPopular: false, pppRatio: 0.25, currencyCode: 'XOF', currencySymbol: 'CFA', fxRate: 615.0 },
    { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', region: 'mea', isPopular: false, pppRatio: 0.20, currencyCode: 'SLE', currencySymbol: 'Le', fxRate: 22.8 },
    { code: 'LR', name: 'Liberia', flag: '🇱🇷', region: 'mea', isPopular: false, pppRatio: 0.22, currencyCode: 'LRD', currencySymbol: 'L$', fxRate: 198.0 },
    { code: 'GM', name: 'Gambia', flag: '🇬🇲', region: 'mea', isPopular: false, pppRatio: 0.24, currencyCode: 'GMD', currencySymbol: 'D', fxRate: 71.0 },
    { code: 'SO', name: 'Somalia', flag: '🇸🇴', region: 'mea', isPopular: false, pppRatio: 0.18, currencyCode: 'SOS', currencySymbol: 'Ssh', fxRate: 570.0 },
    { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', region: 'mea', isPopular: false, pppRatio: 0.38, currencyCode: 'DJF', currencySymbol: 'Fdj', fxRate: 178.0 },
    { code: 'BT', name: 'Bhutan', flag: '🇧🇹', region: 'asia', isPopular: false, pppRatio: 0.30, currencyCode: 'BTN', currencySymbol: 'Nu.', fxRate: 85.5 },
    { code: 'MV', name: 'Maldives', flag: '🇲🇻', region: 'asia', isPopular: false, pppRatio: 0.52, currencyCode: 'MVR', currencySymbol: 'Rf', fxRate: 15.4 },
    { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', region: 'oceania', isPopular: false, pppRatio: 0.38, currencyCode: 'PGK', currencySymbol: 'K', fxRate: 3.95 },
    { code: 'WS', name: 'Samoa', flag: '🇼🇸', region: 'oceania', isPopular: false, pppRatio: 0.45, currencyCode: 'WST', currencySymbol: 'WS$', fxRate: 2.78 },
    { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', region: 'oceania', isPopular: false, pppRatio: 0.48, currencyCode: 'VUV', currencySymbol: 'VT', fxRate: 120.0 },
    { code: 'TO', name: 'Tonga', flag: '🇹🇴', region: 'oceania', isPopular: false, pppRatio: 0.44, currencyCode: 'TOP', currencySymbol: 'T$', fxRate: 2.38 },
    { code: 'GY', name: 'Guyana', flag: '🇬🇾', region: 'latam', isPopular: false, pppRatio: 0.50, currencyCode: 'GYD', currencySymbol: 'G$', fxRate: 209.0 },
    { code: 'SR', name: 'Suriname', flag: '🇸🇷', region: 'latam', isPopular: false, pppRatio: 0.36, currencyCode: 'SRD', currencySymbol: 'Sr$', fxRate: 35.5 },
    { code: 'BZ', name: 'Belize', flag: '🇧🇿', region: 'latam', isPopular: false, pppRatio: 0.48, currencyCode: 'BZD', currencySymbol: 'BZ$', fxRate: 2.00 },
    { code: 'BS', name: 'Bahamas', flag: '🇧🇸', region: 'latam', isPopular: false, pppRatio: 0.90, currencyCode: 'BSD', currencySymbol: 'B$', fxRate: 1.00 },
    { code: 'BB', name: 'Barbados', flag: '🇧🇧', region: 'latam', isPopular: false, pppRatio: 0.75, currencyCode: 'BBD', currencySymbol: 'Bds$', fxRate: 2.00 }
  ];

  // Remove any duplicates by code
  const uniqueMap = new Map();
  COUNTRIES.forEach(c => {
    if (!uniqueMap.has(c.code)) {
      uniqueMap.set(c.code, c);
    }
  });
  const DEDUPED_COUNTRIES = Array.from(uniqueMap.values());

  /**
   * Determine Tier (1 to 4) based on raw discount
   * Tier 1: 0% off (High-income parity)
   * Tier 2: ~20-30% off (Upper middle)
   * Tier 3: ~40-50% off (Middle income)
   * Tier 4: ~55-75% off (Emerging markets)
   */
  function getTierFromDiscount(discountPct) {
    if (discountPct <= 10) return { tier: 1, label: 'Tier 1 (Full Price)', standardCoupon: 'NONE', standardDiscount: 0 };
    if (discountPct <= 35) return { tier: 2, label: 'Tier 2 (25% Off)', standardCoupon: 'PPP25', standardDiscount: 25 };
    if (discountPct <= 50) return { tier: 3, label: 'Tier 3 (45% Off)', standardCoupon: 'PPP45', standardDiscount: 45 };
    return { tier: 4, label: 'Tier 4 (60% Off)', standardCoupon: 'PPP60', standardDiscount: 60 };
  }

  /**
   * Calculate PPP Recommended Price for a Country
   * @param {Object} country Country object
   * @param {number} baseUsd Base US price in USD
   * @param {number} maxDiscountCap Maximum allowed discount percentage (e.g. 60)
   * @param {string} roundingStyle 'exact', 'whole', 'charm', 'local_charm'
   */
  function calculateCountryPricing(country, baseUsd, maxDiscountCap = 60, roundingStyle = 'charm') {
    if (isNaN(baseUsd) || baseUsd <= 0) {
      return {
        country,
        rawDiscountPct: 0,
        appliedDiscountPct: 0,
        priceUsd: 0,
        priceLocal: 0,
        formattedUsd: '$0.00',
        formattedLocal: `${country.currencySymbol}0`,
        tierInfo: getTierFromDiscount(0)
      };
    }

    // Raw discount derived from PPP index
    // If pppRatio >= 1.0 -> no discount (0%)
    // If pppRatio < 1.0 -> raw discount = (1 - pppRatio) * 100
    let rawDiscount = 0;
    if (country.pppRatio < 1.0) {
      rawDiscount = Math.round((1 - country.pppRatio) * 100);
    }

    // Cap with founder's maximum discount guardrail
    const appliedDiscount = Math.min(rawDiscount, Math.max(0, maxDiscountCap));

    // Raw USD price
    const rawPriceUsd = baseUsd * (1 - appliedDiscount / 100);

    // Apply rounding style to USD
    let priceUsd = rawPriceUsd;
    if (appliedDiscount === 0) {
      priceUsd = baseUsd;
    } else {
      if (roundingStyle === 'whole') {
        priceUsd = Math.max(1, Math.round(priceUsd));
      } else if (roundingStyle === 'charm') {
        if (priceUsd >= 2) {
          priceUsd = Math.floor(priceUsd) + 0.99;
          if (priceUsd > baseUsd) priceUsd = baseUsd;
        } else {
          priceUsd = Math.round(priceUsd * 100) / 100;
        }
      } else if (roundingStyle === 'exact') {
        priceUsd = Math.round(priceUsd * 100) / 100;
      }
    }

    // Convert to local currency using FX rate
    const rawLocal = priceUsd * country.fxRate;
    let priceLocal = rawLocal;

    if (country.currencyCode === 'USD') {
      priceLocal = priceUsd;
    } else if (roundingStyle === 'local_charm') {
      // Local charm pricing (e.g. 99, 499, 999 for high denomination currencies)
      if (country.fxRate > 500) {
        // IDR, VND, KRW, NGN, COP, etc.
        priceLocal = Math.round(rawLocal / 1000) * 1000;
        if (priceLocal >= 1000) priceLocal -= 100; // e.g. 19,900 or 9,900
      } else if (country.fxRate > 20) {
        // INR, THB, PHP, TRY, MXN, etc.
        priceLocal = Math.round(rawLocal / 10) * 10;
        if (priceLocal >= 10) priceLocal -= 1; // e.g. ₹999, ₹1,499
      } else if (country.fxRate > 3) {
        // BRL, PLN, MYR, etc.
        priceLocal = Math.floor(rawLocal) + 0.90;
      } else {
        // EUR, GBP, CAD, AUD
        priceLocal = Math.floor(rawLocal) + 0.99;
      }
    } else if (roundingStyle === 'whole') {
      priceLocal = Math.round(rawLocal);
    } else if (roundingStyle === 'charm') {
      if (country.currencyCode === 'USD') {
        priceLocal = priceUsd;
      } else if (country.fxRate >= 100) {
        priceLocal = Math.round(rawLocal);
      } else {
        priceLocal = Math.floor(rawLocal) + 0.99;
      }
    } else {
      priceLocal = Math.round(rawLocal * 100) / 100;
    }

    // Formatting
    const formattedUsd = `$${priceUsd.toFixed(roundingStyle === 'whole' ? 0 : 2)}`;
    let formattedLocal = '';

    if (country.currencyCode === 'USD') {
      formattedLocal = formattedUsd;
    } else if (country.fxRate >= 100) {
      formattedLocal = `${country.currencySymbol}${Math.round(priceLocal).toLocaleString()}`;
    } else {
      formattedLocal = `${country.currencySymbol}${priceLocal.toLocaleString(undefined, {
        minimumFractionDigits: roundingStyle === 'whole' ? 0 : 2,
        maximumFractionDigits: roundingStyle === 'whole' ? 0 : 2
      })}`;
    }

    const tierInfo = getTierFromDiscount(appliedDiscount);

    return {
      country,
      rawDiscountPct: rawDiscount,
      appliedDiscountPct: appliedDiscount,
      priceUsd: Math.round(priceUsd * 100) / 100,
      priceLocal,
      formattedUsd,
      formattedLocal,
      tierInfo
    };
  }

  return {
    COUNTRIES: DEDUPED_COUNTRIES,
    getTierFromDiscount,
    calculateCountryPricing
  };
}));
