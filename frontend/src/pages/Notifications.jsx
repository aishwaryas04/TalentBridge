
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Notifications.css'

const Notifications = () => {
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/notifications',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setNotifications(response.data.notifications)
        } catch (error) {
            console.log('Error fetching notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    // Mark notification as read
    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(
                `http://localhost:5000/api/notifications/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === id
                        ? { ...notification, isRead: true }
                        : notification
                )
            )
        } catch (error) {
            console.log('Error updating notification:', error)
        }
    }

    // Delete notification
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/notifications/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setNotifications(prev =>
                prev.filter(notification => notification._id !== id)
            )
        } catch (error) {
            console.log('Error deleting notification:', error)
        }
    }

    const unreadCount = notifications.filter(
        notification => !notification.isRead
    ).length

    return (
        <div className="notifications-page">

            {/* Header */}
            <div className="notifications-header">
    <div className="notifications-heading">
        <h1>Notifications</h1>
        <p>Stay updated on your job applications.</p>
    </div>

    <button
        className="back-dashboard-btn"
        onClick={() => navigate('/jobseeker/dashboard')}
    >
        Back to Dashboard
    </button>
</div>

            {/* Notification Content */}
            {loading ? (
                <div className="notification-message">
                    Loading notifications...
                </div>
            ) : notifications.length === 0 ? (
                <div className="notification-empty">
                    <div className="empty-icon">🔔</div>
                    <h3>No notifications yet</h3>
                    <p>
                        You'll receive updates here when your application
                        status changes.
                    </p>
                </div>
            ) : (
                <div className="notifications-list">

                    {notifications.map(notification => (
                        <div
                            className={`notification-card ${
                                notification.isRead ? 'read' : 'unread'
                            }`}
                            key={notification._id}
                        >

                            <div className="notification-content">

                                <div className="notification-icon">
                                    🔔
                                </div>

                                <div className="notification-details">

                                    <p>{notification.message}</p>

                                    <span className="notification-date">
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
                                    </span>

                                    {!notification.isRead && (
                                        <span className="unread-label">
                                            New
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="notification-actions">

                                {!notification.isRead && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() =>
                                            handleMarkAsRead(notification._id)
                                        }
                                    >
                                        Mark as read
                                    </button>
                                )}

                                <button
                                    className="delete-notification-btn"
                                    onClick={() =>
                                        handleDelete(notification._id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}

export default Notifications
