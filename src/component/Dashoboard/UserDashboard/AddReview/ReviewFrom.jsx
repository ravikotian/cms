import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams,useNavigate  } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Col, Form, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { useAppContext } from '../../../../context';

const ReviewForm = ({setIsUpdated}) => {
    const {state:{user: {email, img}}} = useAppContext()
    const {id} = useParams();
    const { register, handleSubmit, reset } = useForm();
    const [review, setReview] = useState({});
    const {name, address, description} = review;
    useEffect(() => {
        axios(`https://immense-river-40491.herokuapp.com/userReview/${id}`)
        .then(res => {
            setReview(res.data[0]);
        })
    }, [id])
    
    const history = useNavigate ();
    const onSubmit = async (data) => {
    const loading = toast.loading('Uploading... Please wait!');
    const reviewData = { ...data };
    
    // Attaching user info if not already in data
    reviewData.email = review.email || email;
    reviewData.img = review.img || img;

    try {
        if (id) {
            // 1. UPDATE EXISTING REVIEW
            const reviewRef = doc(db, "reviews", id);
            await updateDoc(reviewRef, reviewData);
            
            toast.dismiss(loading);
            // Comparison logic to see if fields actually changed
            if (data.name === name && data.address === address && data.description === description) {
                toast.error("You haven't changed anything");
            } else {
                toast.success('Your review was successfully updated!');
            }
            history('/dashboard/review');
            
        } else {
            // 2. ADD NEW REVIEW
            setIsUpdated(false);
            const docRef = await addDoc(collection(db, "reviews"), reviewData);
            
            if (docRef.id) {
                setIsUpdated(true);
                toast.dismiss(loading);
                swal("Success!", "Your review has been submitted successfully.", "success");
            }
        }
        reset();
    } catch (error) {
        toast.dismiss(loading);
        toast.error("Error: " + error.message);
    }
};
    return (
        <section className='px-3'>
            <div className="mx-auto reviewForm">
                <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
                        <Row className="justify-content-center px-4">
                            <Form.Group as={Col} md={12}>
                                <Form.Label style={{ fontWeight: "bold" }}>Your Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={name || ""}
                                    {...register("name", { required: true })}
                                    placeholder="Your Name" />
                            </Form.Group>
                            <Form.Group as={Col} md={12}>
                                <Form.Label style={{ fontWeight: "bold" }}>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={address || ""}
                                    {...register("address", { required: true })}
                                    placeholder="Address" />
                            </Form.Group>
                            <Form.Group as={Col} md={12}>
                                <Form.Label style={{ fontWeight: "bold" }}>Description</Form.Label>
                                <Form.Control
                                    style={{ height: "10rem" }}
                                    type="text"
                                    defaultValue={description || ""}
                                    as="textarea"
                                    {...register("description", { required: true })}
                                    placeholder="Description" />
                            </Form.Group>
                        </Row>
                        <div className="text-center mt-1">
                            <Button type="submit" className="mainBtn">
                                {id ? 'update': 'submit'}
                            </Button>
                        </div>
                </Form>
            </div>
        </section>
    );
};

export default ReviewForm;