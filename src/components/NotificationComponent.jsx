import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function NotificationToggle() {
    const [notifOn, setNotifOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [notifications, setNotifications] = useState([]);
    
    return (
        <span className="fixed bottom-0 right-0 z-50">
            <div className="h-full px-3 py-4">
                <button className="flex items-center mb-5 bg-gray-200 p-3 rounded-full hover:bg-gray-300 group">
                    <FontAwesomeIcon icon={faBell} />
                </button>
            </div>
        </span>
    )
}

export { NotificationToggle };
