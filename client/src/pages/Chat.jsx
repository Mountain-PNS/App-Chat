import React, { useContext } from "react";
import ChatContexProvider, { ChatContext } from "../context/ChatContex.jsx";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat.jsx";
import { AuthContex } from "../context/AuthContex.jsx";
import PotentialChats from "../components/chat/PotentialChats.jsx";
import ChatBox from "../components/chat/ChatBox.jsx";

const Chat = () => {
  const { user } = useContext(AuthContex);
  const { userChats, isUserChatLoading, updateCurrentChat } =
    useContext(ChatContext);
  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" radioGroup={3}>
            {isUserChatLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
