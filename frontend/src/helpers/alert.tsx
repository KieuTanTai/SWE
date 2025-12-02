import React, { useEffect, useRef, useState } from "react";

type AlertMessage = {
    type: string;
    message?: string;
    from?: string;
};

interface TempAlertWSProps {
    username: string;
}

const TempAlertWS: React.FC<TempAlertWSProps> = ({ username }) => {
    const [message, setMessage] = useState<string>("");
    const [alert, setAlert] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new window.WebSocket("ws://localhost:8080");

        ws.current.onopen = () => {
            ws.current?.send(
                JSON.stringify({ type: "register", username })
            );
        };
        ws.current.onmessage = (event: MessageEvent) => {
            try {
                const data: AlertMessage = JSON.parse(event.data);
                if (data.type === "alert" && data.message && data.from) {
                    setAlert(`${data.from}: ${data.message}`);
                    setTimeout(() => setAlert(null), 3000);
                }
            } catch (err) {
                console.log(err);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [username]);

    function sendAlert(targetUser: string) {
        ws.current?.send(
            JSON.stringify({
                type: "alert",
                to: targetUser,
                alert: message,
            })
        );
        setMessage("");
    }

    return (
        <div>
            <div>
                Me: <b>{username}</b>
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type alert message"
            />
            <button onClick={() => sendAlert("userB")}>Alert to userB</button>
            <button onClick={() => sendAlert("userA")}>Alert to userA</button>
            {alert && <div className="alert">{alert}</div>}
        </div>
    );
};

export default TempAlertWS;