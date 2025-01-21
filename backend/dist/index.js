"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoManager_1 = require("./managers/IoManager");
const UserManager_1 = require("./managers/UserManager");
const io = IoManager_1.IoManager.getIo();
const usermanager = new UserManager_1.UserManager();
io.on('connection', (client) => {
    usermanager.addUser(client);
});
io.listen(3000);
