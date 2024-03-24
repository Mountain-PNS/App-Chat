import React, { useContext } from "react";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { ChatContext } from "../../context/ChatContex";
import { unreadNoitification } from "../../utils/unreadNotification";
import { useFetchLasterMessage } from "../../hooks/useFetchLasterMessage";
import moment from "moment";
const UserChat = ({ chat, user }) => {
  const {latesMessage} = useFetchLasterMessage(chat)
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers,notifications ,markThisUserNotificationAsRead} = useContext(ChatContext);
  const unreadNotifications = unreadNoitification(notifications);
  const thisUserNotifications = unreadNotifications?.filter((n) => n.senderId === recipientUser?._id);
  const isOnline = onlineUsers?.some(
    (user) => user.userId === recipientUser?._id
  );

  const truncateText = (text) => {  
    let shortText = text.substring(0, 20);
    if(text.length > 20){
      return shortText + "..."
    }
    return shortText
  }
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={()=>{
        if(thisUserNotifications?.length !==0){
          markThisUserNotificationAsRead(notifications,thisUserNotifications)

        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" alt="" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name} </div>
          <div className="text">
            {latesMessage?.text && (
              <span>{truncateText(latesMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="data">
          {moment(latesMessage?.createdAt).calendar()}
        </div>
        <div className={thisUserNotifications?.length > 0 ? "this-user-notifications" : ""}>
          {thisUserNotifications?.length > 0 ? thisUserNotifications?.length : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
