"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const QuizManager_1 = require("./QuizManager");
const ADMIN_PASSWORD = "admin";
class UserManager {
    constructor() {
        this.users = [];
        this.quizManager = new QuizManager_1.QuizManager();
    }
    addUser(roomId, socket) {
        this.users.push({ roomId, socket });
        this.createHandlers(roomId, socket);
    }
    createHandlers(roomId, socket) {
        socket.on('join', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("userId", {
                userId,
                currentState: this.quizManager.getCurrentState(data.roomId),
            });
        });
        socket.on('join_admin', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            if (data.password !== ADMIN_PASSWORD) {
                return;
            }
            socket.emit("adminInit", {
                userId,
                currentState: this.quizManager.getCurrentState(data.roomId),
            });
            socket.on("create_problem", data => {
                const roomId = data.roomId;
                this.quizManager.addProblem(roomId, data.problem);
            });
            socket.on("next", data => {
                this.quizManager.next(data.roomId);
            });
        });
        socket.on("submitAnswer", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;
            this.quizManager.submitAnswer(roomId, problemId, userId, submission);
        });
    }
}
exports.UserManager = UserManager;
