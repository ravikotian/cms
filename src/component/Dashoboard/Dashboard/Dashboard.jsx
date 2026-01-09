import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PopOver from '../../Shared/PopOver/PopOver';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import Sidebar from '../Sidebar/Sidebar';
import UserDashboard from '../UserDashboard/UserDashboard/UserDashboard';
import './Dashboard.css';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SET_ADMIN, useAppContext } from '../../../context';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase-config"; 

const Dashboard = () => {
    const { state: { user, admin, siteSettings }, dispatch } = useAppContext()
    const [sideToggle, setSideToggle] = useState(false)
    const [title, setTitle] = useState(siteSettings && siteSettings.siteName ? siteSettings.siteName : 'Easy Consulting')
    const [services, setServices] = useState([]);

   useEffect(() => {
        const getServices = async () => {
            const querySnapshot = await getDocs(collection(db, "services"));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(data);
        };
        getServices();
    }, []);

    useEffect(() => {
        // determine if current user is an admin by checking 'admins' collection
        const checkAdmin = async () => {
            try {
                if (!user || !user.email) return;
                const adminsSnap = await getDocs(collection(db, 'admins'));
                const admins = adminsSnap.docs.map(d => d.data().email);
                const isAdmin = admins.includes(user.email);
                if (isAdmin !== admin) {
                    dispatch({ type: SET_ADMIN, payload: isAdmin });
                }
            } catch (err) {
                console.error('Error checking admin status:', err);
            }
        };
        checkAdmin();
    }, [user, dispatch, admin]);

    useEffect(() => {
        if (siteSettings && siteSettings.siteName) setTitle(siteSettings.siteName);
    }, [siteSettings]);
    
    return (
        <div id="dashboard">
            <div id="sidebar" className={ sideToggle ? "active" : "" }>
                <div className="sidebarContent">
                    <Sidebar setTitle={setTitle}/>
                    <div className="backBtnBox">
                        <Link to="/">
                            <button className="backBtn"> 
                            <FontAwesomeIcon icon={faSignOutAlt}/>
                             back to home</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div id="pageContent">
                <div className="dashBoardHeader">
                    <div className="d-flex align-items-center">
                        <div id="nav-icon"
                        className={sideToggle ? "menu-btn" : "menu-btn open"}
                        onClick={() => setSideToggle(!sideToggle)}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <h3>{title}</h3>
                    </div>
                    <PopOver/> 
                </div>
                 {
                    admin ? <AdminDashboard/> : <UserDashboard/>
                } 
            </div>
        </div>
    )
}

export default Dashboard
