import { createContext, useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import {
  baseUrl,
  baseUrlChats,
  baseUrlMessages,
  getRequest,
  postRequest,
} from "../utils/services";
import { io } from "socket.io-client";
export const ChatContext = createContext();
const ChatContexProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatsError, setUserChatError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLaoding] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setsendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUser, setAllUser] = useState([]);
  useEffect(() => {
    const newSoket = io("http://localhost:3000");
    setSocket(newSoket);
    return () => {
      newSoket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find((id) => id !== user?._id);
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });
    socket.on("getNotifications", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);
      console.log(isChatOpen);
      if (isChatOpen) {
        setNotifications((prev) =>
          Array.isArray(prev) ? [{ ...res, isRead: true }, ...prev] : [res]
        );
      } else {
        setNotifications((prev) =>
          Array.isArray(prev) ? [...prev, res] : [res]
        );
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotifications");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChats = response.filter((u) => {
        let isChatCreate = false;
        if (user?._id === u._id) {
          return false;
        }
        if (userChats) {
          isChatCreate = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreate;
      });

      setPotentialChats(pChats);
      setAllUser(response);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatLoading(true);
        setUserChatError(null);
        const response = await getRequest(`${baseUrlChats}/${user?._id}`);
        setIsUserChatLoading(true);
        if (response.error) {
          return setUserChatError(response);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user,notifications]);
  useEffect(() => {
    const getMessage = async () => {
      setIsMessagesLaoding(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrlMessages}/${currentChat?._id}`
      );
      setIsMessagesLaoding(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };
    getMessage();
  }, [currentChat]);
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, sendTextMessage) => {
      if (!textMessage) {
        return console.log("You must type something");
      }
      const response = await postRequest(
        `${baseUrlMessages}`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setsendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      sendTextMessage("");
    },
    []
  );
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrlChats}`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );
    if (response.error) {
      return console.log(("Error creating chat", response));
    }
    setUserChats((prev) => [...prev, response]);
  }, []);
  const markAllNotificationAsRead = useCallback((notification) => {
    const mNofications = notification.map((n) => {
      return {
        ...n,
        isRead: true,
      };
    });
    setNotifications(mNofications);
  });
  const markNotificationAsRead = useCallback(
    (n, userChats, user, notification) => {
      const desiredChat = userChats.find((chat) => {
        const chatMember = [user._id, n.senderId];
        const isDesiredChat = chat.members.filter((m) => {
          return chatMember.includes(m);
        });
        return isDesiredChat;
      });
      const mNofications = notification.map((noti) => {
        if (noti.senderId === n.senderId) {
          return { ...n, isRead: true };
        } else {
          return noti;
        }
      });
      updateCurrentChat(desiredChat);
      setNotifications(mNofications);
    },[]
  );
  const markThisUserNotificationAsRead = useCallback((notification,thisUserNotifications) => {
    const mNofications = notification.map((el) => {
     let notification 
     thisUserNotifications?.forEach((n)=>{
       if(n.senderId === el.senderId){
         notification = {...n,isRead:true}
       } else {
         notification = el
       }
     })
     return notification
    })
    setNotifications(mNofications);
  },[])
  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatLoading,
        potentialChats,
        currentChat,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUser,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
        newMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContexProvider;
