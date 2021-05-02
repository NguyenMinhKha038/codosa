import server from "http";
import socketio from "socket.io"
server.createServer();

const io=socketio(server);
const sendNotification = async(data)=>{
  const message = `Có đơn hàng mới ${data}`;
  io.sockets.emit("Server-sent-data", message);
}

export default {sendNotification}