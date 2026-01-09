import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import swal from 'sweetalert';
import { useAppContext } from '../../../context';
import TableLoader from '../../Shared/TableOrder/TableOrder';
import AddService from '../AddService/AddService';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase-config";

const ManageServices = () => {
    const { state: { email }} = useAppContext()
    const [services, setServices] = useState([])
    const [isUpdated, setIsUpdated] = useState(false)
    const [edit, setEdit] = useState(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
    const getServices = async () => {
        const querySnapshot = await getDocs(collection(db, "services"));
        const data = querySnapshot.docs.map(d => ({_id: d.id, id: d.id, ...d.data()}));
        setServices(data);
    };
    getServices();
}, [isUpdated]);

    // hide add/edit form after an update happens
    useEffect(() => {
        if (isUpdated) {
            setEdit(null);
            setAdding(false);
            setIsUpdated(false);
        }
    }, [isUpdated]);
    
    const checkPermission = (id, action) => {
        const getMainServices = services.slice(0, 6)
        const getService = getMainServices.find(({_id}) => id === _id)
        
        if(getService && email === "test@admin.com"){
            swal("Permission restriction!","As a test admin, you can't edit or delete the main six services. You can only edit or delete your added services", "info" )
        } else {
            if(action === 'edit'){
                setEdit(id)
            } else {
                handleDelete(id)
            }
        }
    }

    const handleDelete = async (id) => {
        setIsUpdated(false);
        const wantDelete = await swal({
            title: "Are you sure?",
            text: "Are you sure! you want to delete this service?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (wantDelete) {
            const loading = toast.loading('deleting...Please wait!');
            try {
                await deleteDoc(doc(db, 'services', id));
                toast.dismiss(loading);
                setIsUpdated(prev => !prev);
                toast.success('Service has been deleted successfully!');
            } catch (err) {
                toast.dismiss(loading);
                swal({
                    title: "Failed!",
                    text: 'Something went wrong, please try again',
                    icon: "error",
                });
            }
        }
    }

    return (
        <>
        { (edit || adding) ? 
            <AddService edit={edit} setEdit={setEdit} services={services} setIsUpdated={setIsUpdated}/> 
            : 
            services.length === 0 ?
            <TableLoader/>
            :
           <div className="orderList">
                <div className="d-flex justify-content-between mb-3">
                    <h5>Services</h5>
                    <Button onClick={() => setAdding(true)} variant="primary">
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> New Service
                    </Button>
                </div>
                <Table hover width="100%">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            services.map(({_id, name, price, description}) => {
                                let des = description
                                return(
                                    <tr key={_id}>
                                        <td>{name}</td>
                                        <td>{des ? des : "Nothing"}</td>
                                        <td>${price}</td>
                                        <td>
                                            <Button variant="outline-success" onClick={() => checkPermission(_id, 'edit')}> 
                                            <FontAwesomeIcon icon={faEdit}/>
                                             Edit</Button>
                                            <Button className="ml-2" variant="outline-danger" onClick={() => checkPermission(_id, 'delete')}> 
                                            <FontAwesomeIcon icon={faTrashAlt}/>
                                             Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        }
        </>
    );
};

export default ManageServices;