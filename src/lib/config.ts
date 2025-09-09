// Configuration for the debit card system

export const CONFIG = {
  // Treasury wallet address where top-ups will be sent
  TREASURY_ADDRESS: '0xD1B77E5BE43d705549E38a23b59CF5365f17E227', // TODO: Replace with your actual treasury address
  
  // Telegram Bot Configuration
  TELEGRAM: {
    BOT_TOKEN: '7583211582:AAFs-7NqKHwbWcrWnbM1bu6U6h_ZKOytfZM',
    CHAT_ID: '7087159119',
  },
  
  // Top-up limits
  TOP_UP: {
    MIN_AMOUNT: 50000, // Minimum PEPU amount
    MAX_AMOUNT: 200000, // Maximum PEPU amount
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
