import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Contact.css';
import contactImg from '../../../Assets/contact.svg';
import toast from 'react-hot-toast';
import Fade from 'react-reveal/Fade';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const loadingToast = toast.loading('Sending message...');
        
        // Get form data
        const formData = new FormData(event.target);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            submittedAt: new Date().toLocaleString(),
            timestamp: new Date()
        };
        
        try {
            // Save to Firestore
            const docRef = await addDoc(collection(db, 'contacts'), contactData);
            
            toast.dismiss(loadingToast);
            toast.success('Thank you! We will get back to you soon.');
            
            // Reset form
            event.target.reset();
            setIsSubmitting(false);
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Failed to send message. Please try again.');
            console.error('Error saving contact:', error);
            setIsSubmitting(false);
        }
    }
    
    return (
        <section id="contact">
            <Col md={11} className="mx-auto">
                <Row>
                    <Col md={6}>
                        <Fade duration={2000} left>
                            <form onSubmit={handleSubmit} className="contactForm">
                                <h4 className="miniTitle">CONTACT US</h4>
                                <h5 className="sectionTitle">GET IN TOUCH</h5>
                                <Row>
                                    <Col md={12} lg={6}>
                                        <input placeholder="Your Name" type="text" name="name" required/>
                                    </Col>
                                    <Col md={12} lg={6}>
                                        <input placeholder="Your Email" type="email" name="email" required/>
                                    </Col>
                                    <Col md={12}>
                                        <input placeholder="Subject" type="text" name="subject" required/>
                                    </Col>
                                    <Col md={12}>
                                        <textarea placeholder="Your Message..." name="message" required></textarea>
                                    </Col>
                                </Row>
                                <button className="branBtn" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Submit Now'}
                                </button>
                            </form>
                        </Fade>
                    </Col>
                    <Col md={6}>
                        <Fade duration={2000} right>
                            <img src={`${contactImg}`} alt="" className="img-fluid"/>
                        </Fade>
                    </Col>
                </Row>
            </Col>
        </section>
    );
};

export default Contact;