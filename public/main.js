//const socket = io.connect(location.origin);//("http://localhost:8000/")
console.log("MainJS loaded");

const peer = new Peer(undefined, {
    host: "localhost",
    port: 8000,
    path: "/peerjs"
});

console.log(peer);