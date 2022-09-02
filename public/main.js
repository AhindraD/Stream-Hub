//HTML Component
const videoElm = document.querySelector(".stream");

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
})
    .then(stream => {
        videoElm.srcObject = stream;
        videoElm.addEventListener("loadedmetadata", () => {
            videoElm.play();
        })
    })
    .catch(err => console.log("Error retrieving webcam"))



const socket = io.connect(location.origin);//("http://localhost:8000/")
console.log("MainJS loaded");

const peer = new Peer(undefined, {
    host: "localhost",
    port: 8000,
    path: "/peerjs"
});

//console.log(peer);

peer.on("open", (id) => {
    socket.emit("new-connection", peer.id);
    console.log("Peer ID: ", id);
})

socket.on("user-add", (newPeerID) => {
    let conn = peer.connect(newPeerID);
    //on Open will be launched when you successfully connect to peerService
    conn.on("open", function () {
        //here you have conn.id
        conn.send("hi! from " + peer.id);
    })
})

peer.on("connection", function (conn) {
    conn.on("data", function (data) {
        //will print "hi"
        console.log(data);
    })
})