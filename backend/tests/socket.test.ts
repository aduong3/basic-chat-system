import { server as httpServer } from "../server";
import { AddressInfo } from "net";
import { io as clientIO, Socket as ClientSocket } from "socket.io-client";

type ResponseType = {
  success: boolean;
  message?: string;
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

  afterAll(() => {
    clientA.disconnect();
    clientB.disconnect();
    httpServer.close();
  });

  it("Client A creates room, Client B joins, and receives message", (done) => {
    const room = "test-room";
    const nicknameA = "ClientA";
    const nicknameB = "ClientB";
    const message = "Hello from ClientA!";

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

            clientB.on("receive_message", (msg) => {
              expect(msg.nickname).toBe(nicknameA);
              expect(msg.message).toBe(message);
              done();
            });

            clientA.emit("send_message", message);
          }
        );
      }
    );
  });
});
