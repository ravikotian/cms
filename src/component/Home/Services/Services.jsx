import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config'; // Adjust the number of ../ to reach src
import { useAppContext } from '../../../context';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import './Service.css';

const Services = () => {
    const [services, setServices] = useState([]);
    const { state: { admin }, dispatch } = useAppContext();

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

    const handleSelectedService = (service) => {
        dispatch({type: 'SELECTED_SERVICE', payload: service})
    }

    return (
        <section id="services" className="services overflow-hidden py-5">
            <div className="row w-100">
                <div className="row col-md-11 mx-auto">
                    <div className="col-md-12 mb-4">
                        <h1 className="serviceTitle">OUR SERVICES</h1>
                        <p className="serviceSubtitle">We provide best services for your business</p>
                    </div>
                    <div className="row w-100">
                        {services.length === 0 ? (
                            <div className="col-12 text-center">
                                <p>Loading services...</p>
                            </div>
                        ) : (
                            services.map(service => (
                                <div key={service.id} className="col-md-6 col-lg-4 service">
                                    <Fade bottom duration={2700} distance='70px'>
                                        <div className="service-card">
                                            <div className="text-center">
                                                <img src={`${service.img}`} alt={service.name} className="serviceImg"/>
                                            </div>
                                            <h4 className="serviceName">{service.name}</h4>
                                            <p className="serviceDes">{service.description}</p>
                                            <div className="bookingBox">
                                                <p className="servicePrice">${service.price}</p>
                                                <Link to="/dashboard/book" onClick={() => handleSelectedService(service)}>
                                                    <button className="bookBtn">Book Now</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Fade>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;