import React, { useState } from 'react';
import { Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import './InitializationTool.css';
import { useInitializeCollections } from '../../hooks/useInitializeCollections';

/**
 * Admin tool component for manually initializing and managing Firebase collections
 * Provides detailed feedback on collection status
 */
const InitializationTool = () => {
  const { isLoading, error, result, stats, initializeAll, fetchStats, initializeCollection } = useInitializeCollections();
  const [expandedResults, setExpandedResults] = useState(false);

  const handleInitializeAll = async () => {
    const loadingToast = toast.loading('Initializing all collections...');
    try {
      const result = await initializeAll();
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success('Collections initialized successfully!');
        // Fetch stats after initialization
        await fetchStats();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Error during initialization');
    }
  };

  const handleInitializeCollection = async (collectionName) => {
    const loadingToast = toast.loading(`Initializing ${collectionName}...`);
    try {
      const result = await initializeCollection(collectionName);
      toast.dismiss(loadingToast);
      
      if (result.success) {
        toast.success(`${collectionName} collection initialized!`);
        await fetchStats();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(`Error initializing ${collectionName}`);
    }
  };

  const handleFetchStats = async () => {
    const loadingToast = toast.loading('Fetching collection statistics...');
    try {
      await fetchStats();
      toast.dismiss(loadingToast);
      toast.success('Statistics updated!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Error fetching statistics');
    }
  };

  return (
    <Container className="initialization-tool py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <Card.Title className="mb-0">
                🔧 Database Collections Initializer
              </Card.Title>
            </Card.Header>

            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <strong>Error:</strong> {error}
                </Alert>
              )}

              <div className="mb-4">
                <h5 className="mb-3">Initialize All Collections</h5>
                <p className="text-muted">
                  This will create all necessary collections if they don't already exist.
                </p>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleInitializeAll}
                  disabled={isLoading}
                  className="w-100 mb-3"
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Initializing...
                    </>
                  ) : (
                    '✨ Initialize All Collections'
                  )}
                </Button>
              </div>

              <hr />

              <div className="mb-4">
                <h5 className="mb-3">Or Initialize Individual Collections</h5>
                <Row>
                  {['services', 'orders', 'reviews', 'admins'].map((collectionName) => (
                    <Col md={6} key={collectionName} className="mb-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleInitializeCollection(collectionName)}
                        disabled={isLoading}
                        className="w-100"
                      >
                        {isLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                          </>
                        ) : (
                          <>📦 {collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}</>
                        )}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>

              <hr />

              <div className="mb-4">
                <h5 className="mb-3">View Collection Statistics</h5>
                <Button
                  variant="info"
                  onClick={handleFetchStats}
                  disabled={isLoading}
                  className="w-100 mb-3"
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : (
                    '📊 Fetch Collection Stats'
                  )}
                </Button>
              </div>

              {/* Results Section */}
              {result && (
                <Card className="bg-light mt-4">
                  <Card.Header>
                    <Card.Title className="mb-0">
                      {result.success ? '✅ Initialization Result' : '❌ Initialization Failed'}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Message:</strong> {result.message}
                    </p>
                    {result.timestamp && (
                      <p className="text-muted small">
                        <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
                      </p>
                    )}

                    {result.details && (
                      <div className="mt-3">
                        <Button
                          variant="link"
                          onClick={() => setExpandedResults(!expandedResults)}
                          className="p-0 text-decoration-none"
                        >
                          {expandedResults ? '▼ Hide' : '▶ Show'} Detailed Results
                        </Button>

                        {expandedResults && (
                          <pre className="mt-3 p-3 bg-white rounded border">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}

              {/* Statistics Section */}
              {stats && stats.stats && (
                <Card className="bg-light mt-4">
                  <Card.Header>
                    <Card.Title className="mb-0">📈 Collection Statistics</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {Object.entries(stats.stats).map(([collectionName, data]) => (
                      <div key={collectionName} className="mb-3 p-3 bg-white rounded border">
                        <h6 className="mb-2">
                          {data.exists ? '✅' : '❌'} {collectionName.toUpperCase()}
                        </h6>
                        <p className="mb-1">
                          <strong>Status:</strong> {data.exists ? 'Exists' : 'Does not exist'}
                        </p>
                        <p className="mb-0">
                          <strong>Document Count:</strong> {data.documentCount}
                        </p>
                        {data.documentCount > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-muted small">
                              View Documents
                            </summary>
                            <pre className="mt-2 text-small" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {JSON.stringify(data.documents, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* Information Section */}
              <Card className="bg-light mt-4">
                <Card.Header>
                  <Card.Title className="mb-0">ℹ️ Information</Card.Title>
                </Card.Header>
                <Card.Body className="small">
                  <p>
                    This tool initializes the following Firestore collections:
                  </p>
                  <ul>
                    <li>
                      <strong>services:</strong> Stores service offerings with name, price, and description
                    </li>
                    <li>
                      <strong>orders:</strong> Stores customer orders and bookings
                    </li>
                    <li>
                      <strong>reviews:</strong> Stores customer reviews and testimonials
                    </li>
                    <li>
                      <strong>admins:</strong> Stores admin user emails
                    </li>
                  </ul>
                  <p className="mb-0">
                    Collections that already exist will not be modified. The tool safely handles
                    duplicate initialization requests.
                  </p>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InitializationTool;
