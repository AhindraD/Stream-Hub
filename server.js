const express = require("express");
const { Server } = require("socket.io");
const morgan = require('morgan');
const cors = require("cors");
const { ExpressPeerServer } = require('peer');
const app = express();

app.use(express.static("public"));
app.use(cors());

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("index");
})

const httpServer = app.listen(process.env.PORT || 8000, () => {
    const port = httpServer.address().port;
    console.log(`Server running on ${port}`);
});

// peerjs
const peerServer = ExpressPeerServer(httpServer, {
    debug: true,
});
app.use('/peerjs', peerServer);

// listeners
peerServer.on('connection', (client) => {
    console.log("Peer connected with ID: ", client.id);
});

peerServer.on('disconnect', (client) => {
    console.log("Peer disconnected with ID: ", client.id);
});




const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    let room, user;
    socket.on("join-room", (data) => {
        console.log(data)
        socket.join(data.roomId);
        connections[data.roomId] = connections[data.roomId] === undefined ? [data.userId] : connections[data.roomId].concat([data.userId]);
        room = data.roomId;
        user = data.userId;
        console.log(connections)
        io.to(data.roomId).emit("user-connected", data.userId);
    });

    socket.on("disconnect", () => {
        io.to(room).emit("user-disconnected", user);
    });
})