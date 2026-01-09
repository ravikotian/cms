import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import TableLoader from '../../Shared/TableOrder/TableOrder';
import Order from './Order';
import './OrderList.css'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config"; // ensure path is correct
import { apiPatch } from '../../../utils/apiClient';
const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);
const [services, setServices] = useState([]);
    useEffect(() => {
    const getServices = async () => {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setServices(data);
    };
    getServices();
}, []);

    const handleAction = (id, status) => {
        setIsUpdated(true)
        apiPatch(`/statusUpdate/${id}`, {status: status }).then(res => {
            if (res) setIsUpdated(false);
        })
    }
    
    return (
        <div className="px-2">
            {
                orders.length === 0 ? 
                <TableLoader/> 
                : 
                <div className="orderList">
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email ID</th>
                                <th>Service</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map(order => <Order key={order._id} order={order} handleAction={handleAction}/>)
                            }
                        </tbody>
                    </Table>
                </div>
            }
            
        </div>
    );
};

export default OrderList;