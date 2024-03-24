import React, { useContext, useState } from "react";
import { AuthContex } from "../../context/AuthContex";
import { ChatContext } from "../../context/ChatContex";
import { unreadNoitification } from "../../utils/unreadNotification";
import moment from "moment";
const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContex);
  const { notifications, userChats, allUser ,markAllNotificationAsRead,markNotificationAsRead} = useContext(ChatContext);
  const unreadNotifications = unreadNoitification(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUser.find((u) => u._id === n.senderId);
    return {
      ...n,
      senderName: sender?.name,
    };
  });


  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          fill="currentColor"
          class="bi bi-chat-dots-fill"
          viewBox="0 0 16 16"
        >
          <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="46"
                height="26"
                fill="currentColor"
                class="bi bi-bell-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
              </svg>
            </span>
            <div className="mark-as-read" onClick={()=>markAllNotificationAsRead(notifications)}>Mark all as read</div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="notification">No notification yet...</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  key={index}
                  onClick={()=>{
                    markNotificationAsRead(n,userChats,user,notifications)
                    setIsOpen(false)
                  }}
                >
                  <span>{`${n.senderName} sen you a new mesage`}</span>
                  <span className="notificaton-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notifications;
