import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();

export class IoManager {
    private static io: Server;
    public static instance: IoManager;
    
    public static getIo(){
        if (!this.instance) {
            this.instance = new IoManager();
            const io = new Server(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
                },
            });
            this.io = io;
        }
        return this.io;
    }

}
