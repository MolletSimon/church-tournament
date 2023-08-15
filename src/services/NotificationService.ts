const url = "https://api-ongoal.onrender.com"

export const NotifyUser = (message: string, title: string, topic: string) => {
    fetch(`${url}/notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            title,
            team: topic
        })
    })
};