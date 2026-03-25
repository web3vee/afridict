import React, { createContext, useContext, useState } from "react";

type Language = "en" | "fr" | "sw";

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    "nav.home": "Home",
    "nav.markets": "Markets",
    "nav.dashboard": "Dashboard",
    "nav.deposit": "Deposit",
    "nav.connect_wallet": "Connect Wallet",
    "nav.disconnect": "Disconnect",
    "market.yes": "YES",
    "market.no": "NO",
    "market.place_bet": "Place Bet",
    "market.odds": "Odds",
    "market.pool": "Pool",
    "market.ends": "Ends",
    "market.volume": "Volume",
    "market.participants": "Participants",
    "market.resolved": "Resolved",
    "market.open": "Open",
    "market.cancelled": "Cancelled",
    "market.disputed": "Disputed",
    "bet.amount": "Amount (USDT)",
    "bet.confirm": "Confirm Bet",
    "bet.approve_usdt": "Approve USDT",
    "bet.insufficient": "Insufficient balance",
    "dashboard.my_positions": "My Positions",
    "dashboard.portfolio": "Portfolio",
    "dashboard.winnings": "Total Winnings",
    "dashboard.bets": "Total Bets",
    "kyc.required": "KYC Required",
    "kyc.submit": "Submit KYC",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "payment.deposit": "Deposit Funds",
    "payment.flutterwave": "Pay with Flutterwave",
    "payment.paystack": "Pay with Paystack",
    "category.election": "Elections",
    "category.sports": "Sports",
    "category.commodity": "Commodities",
    "category.economy": "Economy",
    "category.weather": "Weather",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.markets": "Marchés",
    "nav.dashboard": "Tableau de bord",
    "nav.deposit": "Dépôt",
    "nav.connect_wallet": "Connecter le portefeuille",
    "nav.disconnect": "Déconnecter",
    "market.yes": "OUI",
    "market.no": "NON",
    "market.place_bet": "Parier",
    "market.odds": "Cotes",
    "market.pool": "Cagnotte",
    "market.ends": "Se termine",
    "market.volume": "Volume",
    "market.participants": "Participants",
    "market.resolved": "Résolu",
    "market.open": "Ouvert",
    "market.cancelled": "Annulé",
    "market.disputed": "En litige",
    "bet.amount": "Montant (USDT)",
    "bet.confirm": "Confirmer le pari",
    "bet.approve_usdt": "Approuver USDT",
    "bet.insufficient": "Solde insuffisant",
    "dashboard.my_positions": "Mes positions",
    "dashboard.portfolio": "Portefeuille",
    "dashboard.winnings": "Gains totaux",
    "dashboard.bets": "Paris totaux",
    "kyc.required": "KYC requis",
    "kyc.submit": "Soumettre KYC",
    "auth.login": "Connexion",
    "auth.register": "S'inscrire",
    "auth.logout": "Déconnexion",
    "payment.deposit": "Déposer des fonds",
    "payment.flutterwave": "Payer avec Flutterwave",
    "payment.paystack": "Payer avec Paystack",
    "category.election": "Élections",
    "category.sports": "Sports",
    "category.commodity": "Matières premières",
    "category.economy": "Économie",
    "category.weather": "Météo",
  },
  sw: {
    "nav.home": "Nyumbani",
    "nav.markets": "Masoko",
    "nav.dashboard": "Dashibodi",
    "nav.deposit": "Weka Pesa",
    "nav.connect_wallet": "Unganisha Mkoba",
    "nav.disconnect": "Tenganisha",
    "market.yes": "NDIO",
    "market.no": "HAPANA",
    "market.place_bet": "Weka Dau",
    "market.odds": "Uwezekano",
    "market.pool": "Dimbwi",
    "market.ends": "Inaisha",
    "market.volume": "Kiasi",
    "market.participants": "Washiriki",
    "market.resolved": "Imesuluhiwa",
    "market.open": "Wazi",
    "market.cancelled": "Imefutwa",
    "market.disputed": "Inapingwa",
    "bet.amount": "Kiasi (USDT)",
    "bet.confirm": "Thibitisha Dau",
    "bet.approve_usdt": "Idhinisha USDT",
    "bet.insufficient": "Salio haitoshi",
    "dashboard.my_positions": "Nafasi Zangu",
    "dashboard.portfolio": "Mkoba wa Uwekezaji",
    "dashboard.winnings": "Jumla ya Mshindi",
    "dashboard.bets": "Jumla ya Dau",
    "kyc.required": "KYC Inahitajika",
    "kyc.submit": "Wasilisha KYC",
    "auth.login": "Ingia",
    "auth.register": "Jisajili",
    "auth.logout": "Toka",
    "payment.deposit": "Weka Fedha",
    "payment.flutterwave": "Lipa na Flutterwave",
    "payment.paystack": "Lipa na Paystack",
    "category.election": "Uchaguzi",
    "category.sports": "Michezo",
    "category.commodity": "Bidhaa",
    "category.economy": "Uchumi",
    "category.weather": "Hali ya Hewa",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({} as I18nContextType);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("language") as Language) || "en"
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
