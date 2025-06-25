import React, { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      console.log("Information is empty or not alphanumeric");
      return;
    }
    console.log(nickname, chatroom);
  };

  return (
    <div className="w-full min-h-svh flex flex-col gap-6 justify-center items-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="bg-blue-300 py-2 px-3 rounded-lg font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
