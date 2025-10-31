// Configuration for the debit card system

export const CONFIG = {
  // Treasury wallet address where top-ups will be sent
  TREASURY_ADDRESS: import.meta.env.VITE_TREASURY_ADDRESS || '0x582ca7856CEbAbC9eE62E24a7b8D1Bb2fF9814aa',
  
  // Telegram Bot Configuration
  TELEGRAM: {
    BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
    CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
  },
  
  // Top-up limits (in USD)
  TOP_UP: {
    MIN_AMOUNT: 10, // Minimum $10 USD
    MAX_AMOUNT: 5000, // Maximum $5000 USD
  },

  // Card registration fee (in USD)
  CARD_REGISTRATION_FEE: 30, // $30 USD

  // CoinGecko API Configuration
  COINGECKO: {
    API_URL: 'https://api.coingecko.com/api/v3',
    // PEPU token ID on CoinGecko
    PEPU_TOKEN_ID: import.meta.env.VITE_PEPU_TOKEN_ID || 'pepe-unchained',
  },
};

// Helper function to get treasury address
export const getTreasuryAddress = () => {
  if (!CONFIG.TREASURY_ADDRESS || CONFIG.TREASURY_ADDRESS === '0x582ca7856CEbAbC9eE62E24a7b8D1Bb2fF9814aa') {
    console.warn('⚠️  Treasury address not configured! Please set VITE_TREASURY_ADDRESS in your .env file');
  }
  return CONFIG.TREASURY_ADDRESS;
};

// Helper function to check if Telegram is configured
export const isTelegramConfigured = () => {
  return !!CONFIG.TELEGRAM.BOT_TOKEN && !!CONFIG.TELEGRAM.CHAT_ID;
};

// Fetch PEPU price from CoinGecko
export const getPepuPrice = async (): Promise<number> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=pepe-unchained&vs_currencies=usd'
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch PEPU price');
    }
    
    const data = await response.json();
    const price = data['pepe-unchained']?.usd;
    
    if (!price) {
      throw new Error('PEPU price not found in response');
    }
    
    console.log(`💰 Current PEPU price: $${price} USD`);
    return price;
  } catch (error) {
    console.error('❌ Error fetching PEPU price:', error);
    // Fallback price if API fails (adjust as needed)
    const fallbackPrice = 0.00046435; // Fallback PEPU price
    console.warn(`⚠️  Using fallback PEPU price: $${fallbackPrice} USD`);
    return fallbackPrice;
  }
};

// Calculate PEPU amount for USD value
export const calculatePepuAmount = async (usdAmount: number): Promise<number> => {
  const pepuPrice = await getPepuPrice();
  const pepuAmount = usdAmount / pepuPrice;
  console.log(`💵 $${usdAmount} USD = ${pepuAmount.toLocaleString()} PEPU`);
  return pepuAmount;
};