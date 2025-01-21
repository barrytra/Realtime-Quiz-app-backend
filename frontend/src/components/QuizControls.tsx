import { Socket } from "socket.io-client";

export const QuizControls = ({socket, roomId}: {socket: Socket | null, roomId: string}) => {
    return (
        <div>
            Quiz Controls
            <button onClick={() => {
                socket?.emit("next", {
                    roomId: roomId,
                });
            }}>Next Problem</button>
        </div>
    )
}