import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkUserAccess = async () => {
      if (!isConnected || !address) {
        setIsCheckingAccess(false);
        return;
      }

      try {
        // Check if user exists in database
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', address)
          .maybeSingle();

        if (error) {
          console.error('Error checking user access:', error);
          setHasAccess(false);
          setIsCheckingAccess(false);
          return;
        }

        if (!userData) {
          // User not found - redirect to onboarding
          console.log('User not found, redirecting to onboarding');
          navigate('/onboarding');
          return;
        }

        // User has access
        setHasAccess(true);
        setIsCheckingAccess(false);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
        setIsCheckingAccess(false);
      }
    };

    checkUserAccess();
  }, [isConnected, address, navigate]);

  // Show loading while checking access
  if (isConnected && isCheckingAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if connected and has access
  if (isConnected && hasAccess) {
    return <Dashboard />;
  }

  // Show landing page if not connected
  return <LandingPage />;
};

export default Index;
