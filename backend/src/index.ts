import { IoManager } from './managers/IoManager';
import { UserManager } from './managers/UserManager';

const io = IoManager.getIo();

const usermanager = new UserManager();

io.on('connection', (client) => {
    usermanager.addUser(client);
});

io.listen(3000);