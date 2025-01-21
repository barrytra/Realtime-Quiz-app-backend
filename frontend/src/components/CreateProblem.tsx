import { useState } from "react";
import { Socket } from "socket.io-client";

export const CreateProblem = ({socket, roomId}: {socket: Socket | null, roomId: string}) => {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [answer, setAnswer] = useState("");
    return (
        <div>
            <input type="text" placeholder="Problem"
                onChange={(e) => setTitle(e.target.value)}    
            />
            <br />
            {[0,1,2,3].map((option) => (
                <div>
                    <input type="text" placeholder={`Option ${option}`}
                        onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[option] = e.target.value;
                            setOptions(newOptions);
                        }}
                    />
                    <br />
                </div>
            ))}
            <input type="text" placeholder="Answer"
                onChange={(e) => setAnswer(e.target.value)}
            />
            <br />
            <button onClick={() => {
                socket?.emit("create_problem", {
                    roomId: roomId,
                    problem: {
                        title: title,
                        options: options,
                        answer: answer,
                    }
                });
            }}>Add problem</button>
        </div>
    )
}