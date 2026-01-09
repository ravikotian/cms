import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config'; // Adjust the number of ../ to reach src

const Services = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "services"));
                const data = querySnapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                setServices(data);
            } catch (error) {
                console.error("Firebase fetch error:", error);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="services-container">
            {services.length === 0 ? (
                <p>No services found. Add some in FireCMS!</p>
            ) : (
                services.map(service => (
                    <div key={service.id}>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Services;