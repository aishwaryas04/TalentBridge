
import React, { useEffect, useState } from 'react'
import './RecruiterNotifications.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle, Trash2, ArrowLeft } from 'lucide-react'

const RecruiterNotifications = () => {
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('token')

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

    const markAsRead = async (id) => {
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

            fetchNotifications()
        } catch (error) {
            console.log('Error marking notification as read:', error)
        }
    }

    const deleteNotification = async (id) => {
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

    return (
        <div className="recruiter-notifications">

            <div className="notifications-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with your latest job applications.</p>
                </div>

                <button onClick={() => navigate('/recruiter/dashboard')}>
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
            </div>

            <div className="notifications-container">

                {loading ? (
                    <p className="notification-message">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <div className="empty-notifications">
                        <Bell size={45} />
                        <h2>No Notifications Yet</h2>
                        <p>New job application updates will appear here.</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                            key={notification._id}
                        >
                            <div className="notification-icon">
                                <Bell size={22} />
                            </div>

                            <div className="notification-details">
                                <p>{notification.message}</p>

                                <span>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <div className="notification-actions">
                                {!notification.isRead && (
                                    <button
                                        className="read-button"
                                        onClick={() => markAsRead(notification._id)}
                                        title="Mark as read"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}

                                <button
                                    className="delete-button"
                                    onClick={() => deleteNotification(notification._id)}
                                    title="Delete notification"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    )
}

export default RecruiterNotifications
