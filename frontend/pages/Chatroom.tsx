import { useNavigate, useParams } from "react-router-dom";
import { disconnectSocket, sendMessage, socket } from "../utils/websocketAPI";
import { useEffect, useState } from "react";

type ChatMessage = {
  nickname: string;
  message: string;
};

export default function Chatroom() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");

  const { room } = useParams();
  const navigate = useNavigate();

  const leaveRoom = () => {
    disconnectSocket();
    navigate(-1);
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    if (!room) {
      console.log("No room found!");
      return;
    }
    sendMessage(input);
    setMessages((prevMessages) => [
      ...prevMessages,
      { nickname: "You", message: input },
    ]);
    setInput("");
  };

  useEffect(() => {
    socket.on("receive_message", ({ nickname, message }) => {
      setMessages((prevMessage) => [...prevMessage, { nickname, message }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-svh py-8">
      <div className="flex items-center w-[70%] justify-between py-2">
        <h1 className="font-bold text-3xl">Welcome to room: {room}</h1>
        <button
          type="button"
          onClick={leaveRoom}
          className="bg-blue-300 py-2 px-3 rounded-lg font-semibold"
        >
          Disconnect
        </button>
      </div>

      <section className="w-[75%] border-2 flex-1">
        {messages.map((message, index) => (
          <p key={index} className="text-xl py-1">
            <span className="font-bold">{message.nickname}</span>:{" "}
            {message.message}
          </p>
        ))}
      </section>
      <section className="py-8 flex items-center w-[75%]">
        <div className="flex-1 border-b-2 mr-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here!"
            className="outline-0 w-full py-1"
          />
        </div>
        <button
          className="bg-gray-300 py-2 px-3 rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </section>
    </div>
  );
}
