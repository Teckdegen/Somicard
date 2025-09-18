// Configuration for the debit card system

export const CONFIG = {
  // Treasury wallet address where top-ups will be sent
  TREASURY_ADDRESS: '0x582ca7856CEbAbC9eE62E24a7b8D1Bb2fF9814aa', // TODO: Replace with your actual treasury address
  
  // Telegram Bot Configuration
  TELEGRAM: {
    BOT_TOKEN: '8161849561:AAFK3oBgNqDKpWhO-InLUQrVfjJyKrOTANc',
    CHAT_ID: '7087159119',
  },
  
  // Top-up limits
  TOP_UP: {
    MIN_AMOUNT: 200, // Minimum Somi amount
    MAX_AMOUNT: 5000, // Maximum Somi amount
  },
};

// Helper function to get treasury address
export const getTreasuryAddress = () => {
  if (CONFIG.TREASURY_ADDRESS === '0x582ca7856CEbAbC9eE62E24a7b8D1Bb2fF9814aa') {
    console.warn('⚠️  Treasury address not configured! Please update CONFIG.TREASURY_ADDRESS');
  }
  return CONFIG.TREASURY_ADDRESS;
};

// Helper function to check if Telegram is configured
export const isTelegramConfigured = () => {
  return CONFIG.TELEGRAM.BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN' && 
         CONFIG.TELEGRAM.CHAT_ID !== 'YOUR_TELEGRAM_CHAT_ID';
};
