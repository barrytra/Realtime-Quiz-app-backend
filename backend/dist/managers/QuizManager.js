"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
const Quiz_1 = require("../Quiz");
let globalProblemId = 0;
class QuizManager {
    constructor() {
        this.quizzes = [];
    }
    start(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.start();
    }
    addProblem(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem(Object.assign(Object.assign({}, problem), { id: (globalProblemId++).toString(), startTime: new Date().getTime(), submissions: [] }));
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    }
    addUser(roomId, name) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.addUser(name);
    }
    submitAnswer(roomId, problemId, userId, submission) {
        var _a;
        (_a = this.quizzes.find(quiz => quiz.getRoomId() === roomId)) === null || _a === void 0 ? void 0 : _a.submitAnswer(roomId, problemId, userId, submission);
    }
    getQuiz(roomId) {
        var _a;
        return (_a = this.quizzes.find(quiz => quiz.getRoomId() === roomId)) !== null && _a !== void 0 ? _a : null;
    }
    getCurrentState(roomId) {
        const quiz = this.quizzes.find(quiz => quiz.getRoomId() === roomId);
        if (quiz) {
            return quiz.getCurrentState();
        }
        return null;
    }
    getLeaderboard(roomId) {
        var _a;
        return (_a = this.quizzes.find(quiz => quiz.getRoomId() === roomId)) === null || _a === void 0 ? void 0 : _a.getLeaderboard();
    }
    addQuiz(roomId) {
        if (this.getQuiz(roomId)) {
            console.log("quiz already exists");
            return;
        }
        const quiz = new Quiz_1.Quiz(roomId);
        this.quizzes.push(quiz);
    }
}
exports.QuizManager = QuizManager;
