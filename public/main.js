const socket = io.connect(location.origin);//("http://localhost:8000/")
console.log("MainJS loaded");

const peer = new Peer(undefined, {
    host: "localhost",
    port: 8000,
    path: "/peerjs"
});

//HTML Component
const videoElm = document.querySelector(".stream");
const videoDiv = document.querySelector(".vid-cont")

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
})
    .then(stream => {
        videoElm.srcObject = stream;
        videoElm.addEventListener("loadedmetadata", () => {
            videoElm.play();
        })

        peer.on("call", (call) => {
            //console.log("B4 call");
            call.answer(stream);
        })

        //console.log(stream);

        socket.on("user-add", (newPeerID) => {
            setTimeout(() => {
                let call = peer.call(newPeerID, stream);
                call.on("stream", (remoteStream) => {
                    console.log("Stream received!");
                    console.log(remoteStream);

                    const newVideo = document.createElement("video");
                    newVideo.srcObject = remoteStream;
                    newVideo.addEventListener("loadedmetadata", () => {
                        newVideo.play();
                    });
                    videoDiv.appendChild(newVideo);
                })
            }, 1000);
        })
    })
    .catch(err => console.log("Error retrieving webcam", err))



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