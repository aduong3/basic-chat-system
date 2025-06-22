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

export default function WelcomePage() {
  const [nickname, setNickname] = useState<string>("");
  const [chatroom, setChatroom] = useState<string>("");
  const isAlphaNumeric = (str: string) => /^[a-zA-Z0-9]+$/.test(str);

  const inputFormStyle = "text-2xl py-2 px-2";

  return (
    <div className="w-full min-h-svh flex justify-center items-center">
      <form className="flex flex-col gap-8">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={inputFormStyle}
        />
        <input
          type="text"
          placeholder="Chatroom ID"
          value={chatroom}
          onChange={(e) => setChatroom(e.target.value)}
          className={inputFormStyle}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
