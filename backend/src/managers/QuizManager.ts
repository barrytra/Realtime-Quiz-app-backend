import { AllowedSubmissions, Quiz } from "../Quiz";
import { IoManager } from "./IoManager";
let globalProblemId = 0;
export class QuizManager {
    private quizzes: Quiz[]
    constructor() {
        this.quizzes = [];
    }

    public start(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }
        quiz.start(); 
    }

    public addProblem(roomId: string, problem: {
        title: string;
        image?: string;
        options: {
            id: number;
            text: string;
        }[];
        answer: AllowedSubmissions;
    }) {
       const quiz = this.getQuiz(roomId);
       if(!quiz) {
        return;
       }
       quiz.addProblem({
        ...problem,
        id: (globalProblemId++).toString(),
        startTime: new Date().getTime(),
        submissions: [],
       });
    }

    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }
        quiz.next();
    }
    addUser(roomId: string, name: string) {
        this.getQuiz(roomId)?.addUser(name);
    }

    submitAnswer(roomId: string, problemId: string, userId: string, submission: 0|1|2|3) {
        this.quizzes.find(quiz => quiz.getRoomId() === roomId)?.submitAnswer(roomId, problemId, userId, submission);
    }

    getQuiz(roomId: string) {
        return this.quizzes.find(quiz => quiz.getRoomId() === roomId) ?? null;
    }

    getCurrentState(roomId: string) {
        const quiz = this.quizzes.find(quiz => quiz.getRoomId() === roomId);
        if(quiz) {
            return quiz.getCurrentState();
        }
        return null; 
    }

    addQuiz(roomId: string) {
        if(this.getQuiz(roomId)) {
            console.log("quiz already exists")
            return;
        }
        const quiz = new Quiz(roomId);
        this.quizzes.push(quiz);
    }
}