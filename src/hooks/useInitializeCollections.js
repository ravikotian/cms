import { useEffect, useState } from 'react';
import {
  initializeAllCollections,
  initializeServices,
  initializeOrders,
  initializeReviews,
  initializeAdmins,
  collectionExists,
  getCollectionStats
} from '../utils/initializeCollections';

/**
 * Custom hook to initialize Firebase collections
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoInitialize - Automatically initialize on mount (default: false)
 * @param {boolean} options.getStats - Fetch collection statistics (default: false)
 * @returns {Object} - State and functions for collection initialization
 */
export const useInitializeCollections = (options = {}) => {
  const { autoInitialize = false, getStats = false } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);

  /**
   * Initialize all collections
   */
  const initializeAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const initResult = await initializeAllCollections();
      setResult(initResult);
      
      if (getStats && initResult.success) {
        const statsResult = await getCollectionStats();
        setStats(statsResult);
      }
      
      return initResult;
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize a specific collection
   */
  const initializeCollection = async (collectionName) => {
    setIsLoading(true);
    setError(null);
    try {
      let initResult;
      switch (collectionName) {
        case 'services':
          initResult = await initializeServices();
          break;
        case 'orders':
          initResult = await initializeOrders();
          break;
        case 'reviews':
          initResult = await initializeReviews();
          break;
        case 'admins':
          initResult = await initializeAdmins();
          break;
        default:
          throw new Error(`Unknown collection: ${collectionName}`);
      }
      
      setResult(initResult);
      return initResult;
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if a collection exists
   */
  const checkCollection = async (collectionName) => {
    try {
      return await collectionExists(collectionName);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  /**
   * Fetch collection statistics
   */
  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const statsResult = await getCollectionStats();
      setStats(statsResult);
      return statsResult;
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-initialize on mount if enabled
   */
  useEffect(() => {
    if (autoInitialize) {
      initializeAll();
    }
  }, [autoInitialize]);

  return {
    isLoading,
    error,
    result,
    stats,
    initializeAll,
    initializeCollection,
    checkCollection,
    fetchStats
  };
};

export default useInitializeCollections;
