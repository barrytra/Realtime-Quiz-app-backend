import { useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";
const ADMIN_PASSWORD = "admin";
import CreateProblem from "./CreateProblem";

export const Admin = () => {
    const [roomId, setRoomId] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [quizId, setQuizId] = useState("")

    useEffect(() => {
        const socket = io("http://localhost:3000");
        setSocket(socket);
        socket.on("connect", () => {
            console.log("Connected to server");
            socket.emit("joinAdmin", {
                password: ADMIN_PASSWORD,
            });
        });
    }, []);

    if (!quizId) {
        <div>

            <input type="text" placeholder="Room ID" onChange={(e) => setRoomId(e.target.value)} />
            <button onClick={() => {
                socket?.emit("createQuiz", {
                    roomId: roomId,
                });
                setQuizId(roomId);
            }}>Create Quiz</button>
        </div>

    }
    return (
        <>
            <CreateProblem socket={socket} />
        </>
    )
}
