const express = require("express")
const socketIo = require("socket.io")
const http = require("http")

const router = require("./router.js")

const { addUser, removeUser, getUser, getUserInRoom } = require("./users.js")

const PORT = process.env.PORT || 8080

const app = express()

const server = http.createServer(app)

const io = socketIo(server)

io.on("connection", (socket) => {
    console.log("We have a new connection!!!")

    socket.on("join", ({ name, room }, callback) => {
        console.log(`${name} joined room-${room}`)
        const { error, user } = addUser({ id: socket.id, name, room })
        if (error) return callback(error)

        socket.emit("message", {
            user: "admin",
            text: `${user.name}, welcome to the room ${user.room}`,
        })
        socket.broadcast
            .to(user.room)
            .emit("message", { user: "admin", text: `${user.name} has joined` })

        socket.join(user.room)

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUserInRoom(user.room),
        })

        callback()
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit("message", { user: user.name, text: message })
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUserInRoom(user.room),
        })

        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", {
                user: "admin",
                text: `${user.name} has left`,
            })
        }
    })
})

app.use(router)

server.listen(PORT, () => console.log(`<<--- SERVER RUNNING ON PORT:${PORT} --->>`))
