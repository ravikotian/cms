import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile/Profile';
import OrderList from '../OrderList/OrderList';
import MakeAdmin from '../MakeAdmin/MakeAdmin';
import SiteSettings from '../SiteSettings/SiteSettings';
import ManageServices from '../ManageServices/ManageServices';

const AdminDashboard = () => {
    return (
        <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="orderList" element={<OrderList />} />
            {/* AddService is managed inside ManageServices now */}
            <Route path="makeAdmin" element={<MakeAdmin />} />
            <Route path="siteSettings" element={<SiteSettings />} />
            <Route path="manageServices" element={<ManageServices />} />
        </Routes>
    );
};

export default AdminDashboard;