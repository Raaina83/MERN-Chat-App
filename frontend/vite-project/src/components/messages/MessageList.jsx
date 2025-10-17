import { useSelector } from "react-redux";
import Message from "./Message";
import { format, isSameDay } from "date-fns";
import MessageHeader from "./MessageHeader";
import { useChatDetailsQuery } from "../../redux/api/api";
import { Skeleton } from "@mui/material";
import React from "react";

const MessageList = ({ messages, chatId }) => {
  const { user } = useSelector((state) => state.auth);
  const { data, isError, isLoading } = useChatDetailsQuery({
    chatId,
    populate: true,
  });
  const selectedUser = data?.chat?.participants?.filter(
    (participant) => participant._id != user._id
  );
  let lastDate = null;

  return isLoading ? (
    <Skeleton />
  ) : (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MessageHeader conversationUser={selectedUser} />
      {messages?.map((message) => {
        const messageDate = new Date(message.createdAt);
        const formattedDate = format(messageDate, "MMMM dd, yyyy"); // e.g., "January 18, 2025"

        const showDateHeader = !lastDate || !isSameDay(lastDate, messageDate);
        lastDate = messageDate;

        return (
          <React.Fragment key={message._id}>
            {showDateHeader && (
              <div
                className="date-header"
                style={{
                  textAlign: "center",
                  margin: "1rem 0",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                {formattedDate}
              </div>
            )}

            <Message message={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MessageList;
