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
    console.log("Peer connected ", client.id);
});

peerServer.on('disconnect', (client) => {
    console.log("Peer disconnected ", client);
});




const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("Client Connected: ", socket.id);
})