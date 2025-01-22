import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Question } from "./Question";
import { Leaderboard } from "./Leaderboard";

export const User = () => {
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [code, setCode] = useState("");
    if (!submitted) {
        return <div>
            <div className="bg-gray-100 flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold mb-2 text-slate-600">
                            Enter the code to join
                        </h1>
                        <p className="text-gray-600">It’s on the screen in front of you</p>
                    </div>
                    <div className="mb-8">
                        <input
                            className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
                            placeholder="1234 5678"
                            style={{ fontSize: "1rem" }}
                            type="text"
                            onChange={(e) => {
                                setCode(e.target.value)
                            }}
                        />
                        <br /> <br />
                        <input
                            className="text-center w-64 p-2 border-2 border-purple-600 rounded-lg shadow-sm focus:outline-none focus:border-purple-800"
                            placeholder="Your name"
                            style={{ fontSize: "1rem" }}
                            type="text"
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                    </div>
                    <button
                        className="bg-purple-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-opacity-50"
                        style={{ fontSize: "1rem" }}
                        onClick={() => {
                            setSubmitted(true);
                        }}
                    >
                        Join
                    </button>
                </div>
            </div>

        </div>
    }

    return <UserLoggedIn name={name} code={code} />
}

export const UserLoggedIn = ({ name, code }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const roomId = searchParams.get("roomId");
    const [currentState, setCurrentState] = useState("not_started");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const socket = io("http://localhost:3000");
        setSocket(socket);
        socket.on("connect", () => {
            console.log("Connected to server");
            socket.emit("join", {
                roomId: code,
                name: name,
            });
        });

        socket.on("init", (userId, state) => {
            setUserId(userId);
            if (state.leaderboard) {
                setLeaderboard(state.leaderboard);
            }
            if (state.problem) {
                setCurrentQuestion(state.problem);
            }
            setCurrentState(state.type);
        })
    }, []);

    return (
        <>
            {currentState === "not_started" &&
                <div>quis not started</div>
            }
            {currentState === "question" &&
                <div>
                    <Question question={currentQuestion} />
                </div>
            }
            {currentState === "leaderboard" &&
                <div>
                    <Leaderboard leaderboard={leaderboard} />
                </div>
            }
            {currentState === "ended" &&
                <div>
                    quiz has ended
                </div>
            }
        </>
    )
}