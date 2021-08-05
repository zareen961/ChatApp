import React from "react"

import InputEmoji from "react-input-emoji"

import "./Input.css"

const Input = ({ message, setMessage, sendMessage }) => {
    return (
        <form className="form">
            {/* <input
                type="text"
                className="input"
                placeholder="Type a message..."
                value={message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
            /> */}
            <InputEmoji
                className="input"
                value={message}
                placeholder="Type a message..."
                onChange={setMessage}
                // onClick={}
                onEnter={sendMessage}
                // onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
                cleanOnEnter
            />
            <button className="sendButton" onClick={(event) => sendMessage(event)}>
                Send
            </button>
        </form>
    )
}

export default Input
