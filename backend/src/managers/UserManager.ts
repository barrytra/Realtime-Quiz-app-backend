import { Socket } from 'socket.io';
import { QuizManager } from './QuizManager';
const ADMIN_PASSWORD = "admin";
export class UserManager {
    private users: {
        roomId: string;
        socket: Socket;
    }[];
    private quizManager: QuizManager;

    constructor() {
        this.users = [];
        this.quizManager = new QuizManager();
    }

    addUser(roomId: string, socket: Socket) {
        this.users.push({ roomId, socket });
        this.createHandlers(roomId, socket);
    }

    private createHandlers(roomId: string, socket: Socket) {
        socket.on('join', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name)
            socket.emit("userId", {
                userId,
                currentState: this.quizManager.getCurrentState(data.roomId),
            });  
        });

        socket.on('join_admin', (data) => {
            
            if(data.password !== ADMIN_PASSWORD) {
                return 
            }

            socket.on("create_quiz", data => {
                this.quizManager.addQuiz(data.roomId);
            })

            socket.on("create_problem", data => {
                const roomId = data.roomId;
                this.quizManager.addProblem(roomId, data.problem);
            })

            socket.on("next", data => {
                this.quizManager.next(data.roomId);
            })
        });


        socket.on("submitAnswer", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;
            this.quizManager.submitAnswer(roomId, problemId, userId, submission);
        })
    }
}