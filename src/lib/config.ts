// Configuration for the debit card system

export const CONFIG = {
  // Treasury wallet address where top-ups will be sent
  TREASURY_ADDRESS: '0x1234567890123456789012345678901234567890', // TODO: Replace with your actual treasury address
  
  // Telegram Bot Configuration
  TELEGRAM: {
    BOT_TOKEN: 'YOUR_TELEGRAM_BOT_TOKEN', // TODO: Replace with your bot token from @BotFather
    CHAT_ID: 'YOUR_TELEGRAM_CHAT_ID', // TODO: Replace with your chat/channel ID
  },
  
  // Top-up limits
  TOP_UP: {
    MIN_AMOUNT: 40000, // Minimum PEPU amount
    MAX_AMOUNT: 200000, // Maximum PEPU amount
  },
  
  // Conversion rate (adjust as needed)
  CONVERSION: {
    PEPU_TO_ETH_RATIO: 1000000, // 1 ETH = 1,000,000 PEPU (adjust as needed)
  },
};

// Helper function to get treasury address
export const getTreasuryAddress = () => {
  if (CONFIG.TREASURY_ADDRESS === '0x1234567890123456789012345678901234567890') {
    console.warn('⚠️  Treasury address not configured! Please update CONFIG.TREASURY_ADDRESS');
  }
  return CONFIG.TREASURY_ADDRESS;
};

// Helper function to check if Telegram is configured
export const isTelegramConfigured = () => {
  return CONFIG.TELEGRAM.BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN' && 
         CONFIG.TELEGRAM.CHAT_ID !== 'YOUR_TELEGRAM_CHAT_ID';
};
