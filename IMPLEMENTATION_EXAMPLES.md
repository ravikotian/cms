/**
 * Example implementation of Collections Initialization
 * This shows how to integrate the initialization utility into your existing app
 */

// ============================================
// Example 1: Simple Implementation (Recommended)
// ============================================

// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CollectionsInitializer from './component/CollectionsInitializer/CollectionsInitializer';
import { AppProvider } from './context';

// Import your pages
import Home from './component/Home/Home/Home';
import Dashboard from './component/Dashoboard/Dashboard/Dashboard';
import Login from './component/Login/LoginModal';

function App() {
  const handleInitComplete = (result) => {
    console.log('✅ Collections initialized:', result);
  };

  return (
    <AppProvider>
      {/* Initialize collections on app start */}
      <CollectionsInitializer onInitializationComplete={handleInitComplete} />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

// ============================================
// Example 2: Add Admin Tool to Dashboard
// ============================================

// File: src/component/Dashoboard/AdminDashboard/AdminDashboard.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InitializationTool from '../../InitializationTool/InitializationTool';
import Sidebar from '../Sidebar/Sidebar';

const AdminDashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Routes>
        <Route path="/initialize" element={<InitializationTool />} />
        {/* Other admin routes */}
      </Routes>
    </div>
  );
};

export default AdminDashboard;

// ============================================
// Example 3: Manual Initialization Button
// ============================================

// File: src/component/Admin/InitButton.jsx
import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useInitializeCollections } from '../../hooks/useInitializeCollections';

const InitButton = () => {
  const { isLoading, error, initializeAll } = useInitializeCollections();

  const handleClick = async () => {
    const loadingToast = toast.loading('Initializing collections...');
    
    try {
      const result = await initializeAll();
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('✅ Collections initialized successfully!');
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Error during initialization');
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={error ? 'danger' : 'success'}
      size="lg"
    >
      {isLoading ? (
        <>
          <Spinner animation="border" size="sm" className="me-2" />
          Initializing...
        </>
      ) : (
        '🚀 Initialize Collections'
      )}
    </Button>
  );
};

export default InitButton;

// ============================================
// Example 4: Check Collections Status
// ============================================

// File: src/component/Admin/CollectionStatus.jsx
import React, { useEffect, useState } from 'react';
import { useInitializeCollections } from '../../hooks/useInitializeCollections';
import { Alert, Badge } from 'react-bootstrap';

const CollectionStatus = () => {
  const { stats, fetchStats } = useInitializeCollections();

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats || !stats.stats) {
    return <Alert variant="info">Loading collection status...</Alert>;
  }

  return (
    <div>
      <h5>Collection Status</h5>
      {Object.entries(stats.stats).map(([name, data]) => (
        <div key={name} className="mb-2">
          <span className="me-2">{name}:</span>
          <Badge bg={data.exists ? 'success' : 'warning'}>
            {data.exists ? 'Exists' : 'Missing'} ({data.documentCount} docs)
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default CollectionStatus;

// ============================================
// Example 5: Verify Collections Before Using App
// ============================================

// File: src/App.js (Alternative approach)
import React, { useEffect, useState } from 'react';
import { getCollectionStats } from './utils/initializeCollections';
import Loading from './component/Shared/Spinner/Spinner';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkCollections = async () => {
      try {
        const stats = await getCollectionStats();
        console.log('Collection status:', stats);
        setReady(true);
      } catch (err) {
        console.error('Failed to verify collections:', err);
        setReady(true); // Still allow app to load
      }
    };

    checkCollections();
  }, []);

  if (!ready) {
    return <Loading />;
  }

  return (
    // Your app component
    <AppContent />
  );
}

export default App;

// ============================================
// Example 6: Conditional Initialization
// ============================================

// File: src/hooks/useConditionalInit.js
import { useEffect, useState } from 'react';
import { useInitializeCollections } from './useInitializeCollections';
import { collectionExists } from '../utils/initializeCollections';

/**
 * Hook that only initializes collections if they don't exist
 */
export const useConditionalInit = () => {
  const [needsInit, setNeedsInit] = useState(true);
  const { initializeAll, fetchStats } = useInitializeCollections();

  useEffect(() => {
    const checkAndInit = async () => {
      try {
        const servicesExist = await collectionExists('services');
        
        if (!servicesExist) {
          // Initialize only if services don't exist
          await initializeAll();
          await fetchStats();
        }
        
        setNeedsInit(false);
      } catch (err) {
        console.error('Error checking collections:', err);
        setNeedsInit(false);
      }
    };

    checkAndInit();
  }, []);

  return { needsInit };
};

// Usage in App.js:
function App() {
  const { needsInit } = useConditionalInit();
  
  if (needsInit) {
    return <div>Setting up database...</div>;
  }

  return <YourAppContent />;
}

// ============================================
// Example 7: Environment-Specific Setup
// ============================================

// File: src/App.js
function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitComplete = (result) => {
    // In production, you might want different behavior
    if (process.env.NODE_ENV === 'development') {
      console.log('Development: Collections initialized', result);
    }
    setIsInitialized(true);
  };

  return (
    <AppProvider>
      <CollectionsInitializer onInitializationComplete={handleInitComplete} />
      
      {isInitialized ? (
        <MainApp />
      ) : (
        <div className="loading-screen">
          <h2>Initializing application...</h2>
        </div>
      )}
    </AppProvider>
  );
}

// ============================================
// Example 8: Error Handling with Retry
// ============================================

// File: src/hooks/useInitWithRetry.js
import { useState } from 'react';
import { useInitializeCollections } from './useInitializeCollections';

export const useInitWithRetry = (maxRetries = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  const { isLoading, error, initializeAll } = useInitializeCollections();

  const initializeWithRetry = async () => {
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await initializeAll();
        if (result.success) {
          setRetryCount(0);
          return result;
        }
        lastError = result.message;
      } catch (err) {
        lastError = err.message;
        console.warn(`Initialization attempt ${i + 1} failed: ${lastError}`);
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setRetryCount(maxRetries);
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError}`);
  };

  return {
    isLoading,
    error,
    retryCount,
    initializeWithRetry
  };
};

// ============================================
// Choose the approach that works best for you!
// Start with Example 1 for simplicity.
// ============================================
