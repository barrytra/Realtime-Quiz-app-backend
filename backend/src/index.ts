import { IoManager } from './managers/IoManager';

const io = IoManager.getIo();

io.on('connection', client => {
    client.on('event', data => {
        console.log(data);
    });
    client.on('disconnect', () => { /* … */ });
});

io.listen(3000);