import React, { useState, useEffect } from "react"
import io from "socket.io-client"

import "./Chat.css"

import Infobar from "../Infobar/index"
import Input from "../Input/index"
import Messages from "../Messages/index"
import TextContainer from "../TextContainer/index"

const ENDPOINT = "http://localhost:8080"

let socket

const Chat = ({ location }) => {
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")
    const [users, setUsers] = useState("")
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const data = location.search.split("=")
        const name = data[1].split("&")[0]
        const room = data[2]

        setName(name)
        setRoom(room)

        socket = io(ENDPOINT, { transports: ["websocket", "polling", "flashsocket"] })

        socket.emit("join", { name, room }, (error) => {
            if (error) alert(error)
        })

        // console.log(socket)

        // return () => {
        //     socket.emit("disconnect")
        //     socket.off()
        // }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((messages) => [...messages, message])
        })
        socket.on("roomData", ({ users }) => {
            setUsers(users)
        })
    }, [])

    const sendMessage = (event) => {
        // event.preventDefault()
        if (message) {
            socket.emit("sendMessage", message, () => setMessage(""))
        }
    }

    console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room} />
                <Messages messages={messages} name={name} />
                <Input
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat
