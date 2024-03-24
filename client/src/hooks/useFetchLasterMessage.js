import { useContext, useEffect, useState } from "react";
import { baseUrlMessages, getRequest } from "../utils/services";
import { ChatContext } from "../context/ChatContex";

export const useFetchLasterMessage = (chat) => {
  const { newMeaage, notification } = useContext(ChatContext);
  const [latesMessage, setLatesMessage] = useState(null);
  useEffect(() => {
    const getMessage = async () => {
      const response = await getRequest(`${baseUrlMessages}/${chat?._id}`);
   
      if (response.error) {
       console.log(error);
      }
      const lastMessage = response[response.length - 1];

      setLatesMessage(lastMessage);
    };
    getMessage();
    console.log("new", latesMessage);
  }, [newMeaage, notification]);
  return { latesMessage };

};
