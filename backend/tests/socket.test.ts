import { server as httpServer } from "../server";
import { AddressInfo } from "net";
import { io as clientIO, Socket as ClientSocket } from "socket.io-client";

type ResponseType = {
  success: boolean;
  message?: string;
};

type MessageDataType = {
  nickname: string;
  message: string;
};

describe("Real Chat Server test", () => {
  let clientA: ClientSocket;
  let clientB: ClientSocket;
  let port: number;

  beforeAll((done) => {
    httpServer.listen(() => {
      port = (httpServer.address() as AddressInfo).port;

      clientA = clientIO(`http://localhost:${port}`);
      clientB = clientIO(`http://localhost:${port}`);

      let connectedSockets = 0;
      const check = () => ++connectedSockets === 2 && done();

      clientA.on("connect", check);
      clientB.on("connect", check);
    });
  });

  afterAll((done) => {
    let disconnected = 0;

    const check = () => {
      disconnected++;
      if (disconnected === 2) {
        httpServer.close(done);
      }
    };

    clientA.on("disconnect", check);
    clientB.on("disconnect", check);

    clientA.disconnect();
    clientB.disconnect();
  });

  it("Client A creates room, Client B joins, and receives message", (done) => {
    const room = "test-room";
    const nicknameA = "ClientA";
    const nicknameB = "ClientB";
    const message = "Hello from ClientA!";
    const messageB = "Hey A, it's ClientB!";

    clientA.emit(
      "create_room",
      { nickname: nicknameA, room },
      (responseA: ResponseType) => {
        expect(responseA.success).toBe(true);

        clientB.emit(
          "join_room",
          { nickname: nicknameB, room },
          (responseB: ResponseType) => {
            expect(responseB.success).toBe(true);

            clientB.once("receive_message", (msg: MessageDataType) => {
              expect(msg.nickname).toBe(nicknameA);
              expect(msg.message).toBe(message);
            });

            clientA.once("receive_message", (msg: MessageDataType) => {
              expect(msg.nickname).toBe(nicknameB);
              expect(msg.message).toBe(messageB);
              done();
            });

            clientA.emit("send_message", message);
            clientB.emit("send_message", messageB);
          }
        );
      }
    );
  });

  it("Both clients try to create a room with the same name", (done) => {
    const room2 = "test-room-1";
    const nicknameA = "ClientA";
    const nicknameB = "ClientB";

    clientA.emit(
      "create_room",
      { nickname: nicknameA, room2 },
      (resA: ResponseType) => {
        expect(resA.success).toBe(true);

        clientA.once("receive_message", (msg: MessageDataType) => {
          expect(msg.nickname).toBe("System");
          expect(msg.message).toBe(
            `${nicknameA} has created the room: ${room2}`
          );
        });

        clientB.emit(
          "create_room",
          { nickname: nicknameB, room2 },
          (resB: ResponseType) => {
            expect(resB.success).toBe(false);
            expect(resB.message).toBe(
              "This room name is already being used! Please choose a different name."
            );
            done();
          }
        );
      }
    );
  });
});
