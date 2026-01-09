import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faCommentAlt, faUserPlus, faCog, faFileMedical, faList, faUserCircle, faImage } from '@fortawesome/free-solid-svg-icons'
import { faBuffer } from '@fortawesome/free-brands-svg-icons';
import { useAppContext } from '../../../context';

const Sidebar = ({setTitle}) => {
    const { state: { admin, siteSettings = {} } } = useAppContext()

    return (
        <div>
            <div className="sideBrand">
                <div className="sideBrnIcon">
                    {siteSettings.siteLogo ? (
                        <img src={siteSettings.siteLogo} alt={siteSettings.siteName || 'Brand'} style={{height:36}} />
                    ) : (
                        <FontAwesomeIcon icon={faBuffer}/>
                    )}
                </div>
                <h2>{siteSettings.siteName ? (<>{siteSettings.siteName}</>) : <>Easy <span className="navHighlight">Consulting</span></>}</h2>
            </div>
            <nav id="sideNavbar">
                <ul>    
                        <li>
                            <NavLink onClick={() => setTitle('Profile')} className={({isActive}) => isActive ? 'activePage' : ''} to="/dashboard/profile">
                                <FontAwesomeIcon icon={faUserCircle} className="iconC"/> 
                                Profile
                            </NavLink>
                        </li>
                    {admin ? 
                        <>
                            <li>
                                <NavLink onClick={() => setTitle('Order List')} activeclassname="activePage" to="/dashboard/orderList">
                                    <FontAwesomeIcon icon={faList} className="iconC"/> 
                                    Order list
                                </NavLink>
                            </li>
                            {/* Add Service moved into Manage Services for unified admin flow */}
                            <li>
                                <NavLink onClick={() => setTitle('Make Admin')} activeclassname="activePage" to="/dashboard/makeAdmin">
                                    <FontAwesomeIcon icon={faUserPlus} className="iconC"/> 
                                    Make Admin
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Site Settings')} activeclassname="activePage" to="/dashboard/siteSettings">
                                    <FontAwesomeIcon icon={faImage} className="iconC"/> 
                                    Site Settings
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Manage Services')} activeclassname="activePage" to="/dashboard/manageServices">
                                    <FontAwesomeIcon icon={faCog} className="iconC"/>
                                     Manage Services
                                </NavLink>
                            </li>
                        </>
                        :
                        <>
                            <li>
                                <NavLink onClick={() => setTitle('Book')} activeclassname="activePage" exact to="/dashboard/book">
                                    <FontAwesomeIcon icon={faShoppingCart} className="iconC"/> 
                                    Book
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Booking List')} activeclassname="activePage" to="/dashboard/booking">
                                    <FontAwesomeIcon icon={faList} className="iconC"/> 
                                    Booking List
                                </NavLink>
                            </li>
                            <li>
                                <NavLink onClick={() => setTitle('Review')} activeclassname="activePage" to="/dashboard/review">
                                    <FontAwesomeIcon icon={faCommentAlt} className="iconC"/>
                                     Review
                                </NavLink>
                            </li>
                        </>
                     } 
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar
