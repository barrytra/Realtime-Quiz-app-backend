import { useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";
const ADMIN_PASSWORD = "admin";

export const Admin = () => {
    const [roomId, setRoomId] = useState("");
    const [inputRoomId, setInputRoomId] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io("http://localhost:3000");
        setSocket(socket);
        socket.on("connect", () => {
            console.log("Connected to server");
            socket.emit("join_admin", {
                password: ADMIN_PASSWORD,
            });
        });
    }, []);

    if (!roomId) {
        return <div>
            <input 
                type="text" 
                placeholder="Room ID" 
                onChange={(e) => setInputRoomId(e.target.value)}
                value={inputRoomId}
            />
            <br />
            <button onClick={() => {
                socket?.emit("create_quiz", {
                    roomId: inputRoomId,
                });
                setRoomId(inputRoomId);
            }}>Create Quiz</button>
        </div>
    }
    return (
        <div>
            <CreateProblem socket={socket} roomId={roomId} />
            <QuizControls socket={socket} roomId={roomId} />
        </div>
    )
}
