import { IoManager } from "./managers/IoManager";

export 
type AllowedSubmissions = 0|1|2|3;
const PROBLEM_DURATION = 20; // seconds 

interface User {
    name: string;
    id: string;
    points: number;
}

interface Submission {
    userId: string;
    problemId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions;
}

interface Problem {
    id: string;
    title: string;
    image?: string;
    startTime: number;
    options: {
        id:number;
        text:string; 
    }[]
    answer: AllowedSubmissions;
    submissions: Submission[];
}

export class Quiz {
    private roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: "leaderboard" | "question" | "not_started" | "ended"; 

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
        setInterval(() => {
            this.debug();
        }, 10000)
    }
    debug() {
        console.log("----debug---")
        console.log(this.roomId)
        console.log(JSON.stringify(this.problems))
        console.log(this.users)
        console.log(this.currentState)
        console.log(this.activeProblem);
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
        console.log(this.problems)  
    }

    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0])
    }

    setActiveProblem(problem: Problem) {
        console.log("setting active problem") 
        this.currentState = "question" 
        problem.startTime = new Date().getTime()
        problem.submissions = []
        IoManager.getIo().to(this.roomId).emit('CHANGE_PROBLEM', {
            problem
        });
        setTimeout(() => {
            this.sendLeaderBoard()
        }, PROBLEM_DURATION * 1000);
    } 

    sendLeaderBoard() {
        console.log("sending leaderboard")
        this.currentState = "leaderboard"
        const leaderboard = this.getLeaderboard()
        IoManager.getIo().to(this.roomId).emit('LEADERBOARD', {
            leaderboard
        });    
    }


    next() {
        this.activeProblem++; 
        const problem = this.problems[this.activeProblem];
        const io = IoManager.getIo();
        if(problem) {
            this.setActiveProblem(problem)
        }
        else {
            // send final results here  
            // io.emit('QUIZ_END', {
            //     problem
            // });
            // this.hasStarted = false; 
        }
    }
    generateRandomString(length: number) {
        return Math.random().toString(36).substring(2, length + 2);
    }
    randomId() {
        return 
    }

    addUser(name: string) {
        const id = this.generateRandomString(7);
        this.users.push({
            name,
            id,
            points: 0,
        });
        return id;
    }

    getRoomId() {
        return this.roomId;
    }

    submitAnswer(userId: string, roomId: string, problemId: string, submission: 0|1|2|3) {
        const problem = this.problems.find(x => x.id === problemId);
        const user = this.users.find(x => x.id === userId);
        if(problem && user) {
            const existingSubmission = problem.submissions.find(x => x.userId === userId)
            if( existingSubmission ) {
                return 
            }
            problem.submissions.push({
                userId,
                problemId,
                isCorrect: problem.answer === submission,
                optionSelected: submission,
            });
            user.points += 1000 - 500*(new Date().getTime() - problem.startTime) / PROBLEM_DURATION;
        }  
    }

    getLeaderboard() {
        return this.users.sort((a, b) => b.points - a.points).splice(0,20);
    }

    getCurrentState() {
        if(this.currentState === "not_started") {
            return {
                type: "not_started",
            }
        }
        else if(this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard(),
            }
        }
        else if(this.currentState === "question") {
            return {
                type: "question",
                problem: this.problems[this.activeProblem],
            }
        }
        else if(this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard(),
            }
        }
    }

}


