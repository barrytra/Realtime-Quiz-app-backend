import { useState } from "react";

export const CreateProblem = ({socket}: {socket: any}) => {
    const [title, setTitle] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    return (
        <div>
            <input type="text" placeholder="Problem"
                onChange={(e) => setTitle(e.target.value)}    
            />
            {[1,2,3,4].map((option) => (
                <input type="text" placeholder={`Option ${option}`}
                    onChange={(e) => setOptions([...options, e.target.value])}
                />
            ))}
        </div>
    )
}