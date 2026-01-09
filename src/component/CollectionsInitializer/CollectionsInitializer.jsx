import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useInitializeCollections } from '../../hooks/useInitializeCollections';

/**
 * Component to initialize Firebase collections on app startup
 * Automatically runs when app loads and shows notifications
 */
const CollectionsInitializer = ({ onInitializationComplete }) => {
  const { isLoading, error, initializeAll } = useInitializeCollections();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    const initializeCollections = async () => {
      // Skip if already initialized in this session
      if (hasAttempted) return;

      setHasAttempted(true);
      const loadingToast = toast.loading('Initializing database collections...');

      try {
        const result = await initializeAll();

        toast.dismiss(loadingToast);

        if (result.success) {
          setIsInitialized(true);
          
          // Show notification with details
          const message = result.details
            ? `Collections ready! Services: ${result.details.services.status}, Orders: ${result.details.orders.status}`
            : result.message;
          
          toast.success(message, {
            duration: 3000,
            icon: '✅'
          });

          if (onInitializationComplete) {
            onInitializationComplete(result);
          }
        } else {
          toast.error(`Failed to initialize: ${result.message}`, {
            duration: 4000
          });
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(`Error initializing collections: ${err.message}`);
      }
    };

    // Only run once on component mount
    initializeCollections();
  }, []); // Empty dependency array - run only once

  // This component doesn't render anything
  return null;
};

export default CollectionsInitializer;
