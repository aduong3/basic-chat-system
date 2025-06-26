import React, { useState } from "react";
import { connectSocket, createRoom, joinRoom } from "../utils/websocketAPI";
import { useNavigate } from "react-router-dom";

/*
Goal of Welcome Page:
Users will be asked to input an Alphanumeric nickname.
Users will be asked to put in a chatroom code to join or create a chatroom.
They will submit the button to continue to the actual chatroom.

Reasonings:
In the overall project, the user will not be putting their own name, but sign in using GitHub or Google Log In.
When they get matched with a random person, they will receive a random name to show anonymity.
The users can add each other to remove that anonymity if they desire.
*/

const inputFormStyle = "text-2xl py-2 px-2";

export default function WelcomePage() {
  const [nickname, setNickname] = useState<string>("");
  const [chatroom, setChatroom] = useState<string>("");
  const navigate = useNavigate();

  const isAlphaNumeric = (str: string): boolean => {
    str = str.trim();
    return /^[a-zA-Z0-9]+$/.test(str);
  };

  // if the nickname and chatroom is not empty, and if they are both alphanumeric... Then we have a valid form.
  const isFormValid =
    nickname.trim() !== "" &&
    chatroom.trim() !== "" &&
    isAlphaNumeric(nickname) &&
    isAlphaNumeric(chatroom);

  const handleRoom = async (e: React.FormEvent, action: "create" | "join") => {
    e.preventDefault();
    if (!isFormValid) {
      console.log("Information is empty or not alphanumeric");
      return;
    }
    connectSocket();
    let response;
    if (action === "create") {
      response = await createRoom({ nickname, room: chatroom });
    } else {
      response = await joinRoom({ nickname, room: chatroom });
    }
    if (response.success) navigate(`/chat/${chatroom}`);
    else alert(response.message);
  };

  return (
    <div className="w-full min-h-svh flex flex-col gap-6 justify-center items-center">
      <div className="flex flex-col gap-8">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.trim())}
          className={inputFormStyle}
        />
        <input
          type="text"
          placeholder="Chatroom ID"
          value={chatroom}
          onChange={(e) => setChatroom(e.target.value.trim())}
          className={inputFormStyle}
        />
        <div className="flex justify-evenly items-center">
          <button
            type="submit"
            onClick={(e) => {
              handleRoom(e, "create");
            }}
            className="bg-blue-300 py-2 px-3 rounded-lg font-semibold "
          >
            Create
          </button>
          <button
            type="submit"
            onClick={(e) => {
              handleRoom(e, "join");
            }}
            className="bg-blue-300 py-2 px-3 rounded-lg font-semibold"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
