import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase-config';

/**
 * Sample data for initial setup
 */
const INITIAL_SERVICES = [
  {
    name: 'Web Design',
    price: 500,
    description: 'Professional web design services to create stunning websites',
    img: 'https://via.placeholder.com/300x200?text=Web+Design'
  },
  {
    name: 'Web Development',
    price: 800,
    description: 'Full-stack web development with modern technologies',
    img: 'https://via.placeholder.com/300x200?text=Web+Development'
  },
  {
    name: 'Digital Marketing',
    price: 400,
    description: 'Comprehensive digital marketing strategies and execution',
    img: 'https://via.placeholder.com/300x200?text=Digital+Marketing'
  },
  {
    name: 'Graphic Design',
    price: 300,
    description: 'Creative graphic design for brands and marketing materials',
    img: 'https://via.placeholder.com/300x200?text=Graphic+Design'
  },
  {
    name: 'Strategy & Research',
    price: 600,
    description: 'In-depth business strategy and market research',
    img: 'https://via.placeholder.com/300x200?text=Strategy+Research'
  }
];

/**
 * Default admin emails for initial setup
 */
const INITIAL_ADMINS = [
  {
    email: 'kotian.ravi@gmail.com'
  }
];

/**
 * Check if a collection exists (has at least one document)
 * @param {string} collectionName - Name of the collection to check
 * @returns {Promise<boolean>} - True if collection has documents
 */
export const collectionExists = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef);
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error(`Error checking collection ${collectionName}:`, error);
    return false;
  }
};

/**
 * Initialize services collection with sample data
 * @returns {Promise<Object>} - Result object with status and details
 */
export const initializeServices = async () => {
  try {
    const exists = await collectionExists('services');
    
    if (exists) {
      return {
        success: true,
        message: 'Services collection already exists',
        status: 'exists',
        count: 0
      };
    }

    let addedCount = 0;
    for (const service of INITIAL_SERVICES) {
      await addDoc(collection(db, 'services'), {
        ...service,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      addedCount++;
    }

    return {
      success: true,
      message: `Services collection initialized with ${addedCount} services`,
      status: 'created',
      count: addedCount
    };
  } catch (error) {
    console.error('Error initializing services:', error);
    return {
      success: false,
      message: error.message,
      status: 'error'
    };
  }
};

/**
 * Initialize orders collection (empty, just create structure)
 * @returns {Promise<Object>} - Result object with status and details
 */
export const initializeOrders = async () => {
  try {
    const exists = await collectionExists('orders');
    
    if (exists) {
      return {
        success: true,
        message: 'Orders collection already exists',
        status: 'exists'
      };
    }

    // Create a placeholder document to ensure collection exists
    await setDoc(doc(collection(db, 'orders'), '__placeholder__'), {
      placeholder: true,
      createdAt: new Date()
    });

    // Delete the placeholder
    await deleteDoc(doc(db, 'orders', '__placeholder__'));

    return {
      success: true,
      message: 'Orders collection initialized',
      status: 'created'
    };
  } catch (error) {
    console.error('Error initializing orders:', error);
    return {
      success: false,
      message: error.message,
      status: 'error'
    };
  }
};

/**
 * Initialize reviews collection (empty)
 * @returns {Promise<Object>} - Result object with status and details
 */
export const initializeReviews = async () => {
  try {
    const exists = await collectionExists('reviews');
    
    if (exists) {
      return {
        success: true,
        message: 'Reviews collection already exists',
        status: 'exists'
      };
    }

    // Create a placeholder document to ensure collection exists
    await setDoc(doc(collection(db, 'reviews'), '__placeholder__'), {
      placeholder: true,
      createdAt: new Date()
    });

    // Delete the placeholder
    await deleteDoc(doc(db, 'reviews', '__placeholder__'));

    return {
      success: true,
      message: 'Reviews collection initialized',
      status: 'created'
    };
  } catch (error) {
    console.error('Error initializing reviews:', error);
    return {
      success: false,
      message: error.message,
      status: 'error'
    };
  }
};

/**
 * Initialize admins collection with default admin
 * @returns {Promise<Object>} - Result object with status and details
 */
export const initializeAdmins = async () => {
  try {
    const exists = await collectionExists('admins');
    
    if (exists) {
      return {
        success: true,
        message: 'Admins collection already exists',
        status: 'exists'
      };
    }

    let addedCount = 0;
    for (const admin of INITIAL_ADMINS) {
      await addDoc(collection(db, 'admins'), {
        ...admin,
        createdAt: new Date()
      });
      addedCount++;
    }

    return {
      success: true,
      message: `Admins collection initialized with ${addedCount} admin${addedCount > 1 ? 's' : ''}`,
      status: 'created',
      count: addedCount
    };
  } catch (error) {
    console.error('Error initializing admins:', error);
    return {
      success: false,
      message: error.message,
      status: 'error'
    };
  }
};

/**
 * Initialize all collections at once
 * @returns {Promise<Object>} - Aggregated result for all collections
 */
export const initializeAllCollections = async () => {
  try {
    const results = {
      services: await initializeServices(),
      orders: await initializeOrders(),
      reviews: await initializeReviews(),
      admins: await initializeAdmins()
    };

    const allSuccess = Object.values(results).every(r => r.success);
    const newCollections = Object.values(results).filter(r => r.status === 'created').length;
    const existingCollections = Object.values(results).filter(r => r.status === 'exists').length;

    return {
      success: allSuccess,
      message: `Collections initialization complete. Created: ${newCollections}, Already existed: ${existingCollections}`,
      details: results,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error initializing all collections:', error);
    return {
      success: false,
      message: error.message,
      details: null,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get statistics about collections
 * @returns {Promise<Object>} - Statistics for each collection
 */
export const getCollectionStats = async () => {
  try {
    const stats = {};

    for (const collectionName of ['services', 'orders', 'reviews', 'admins']) {
      const snapshot = await getDocs(collection(db, collectionName));
      stats[collectionName] = {
        exists: !snapshot.empty,
        documentCount: snapshot.size,
        documents: snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      };
    }

    return {
      success: true,
      stats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting collection stats:', error);
    return {
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  initializeAllCollections,
  initializeServices,
  initializeOrders,
  initializeReviews,
  initializeAdmins,
  collectionExists,
  getCollectionStats
};
