const url = "http://localhost:3001"

export const  NotifyUser = (message: string, title: string, team: string) => {
    fetch(`${url}/notification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            title,
            team
        })
    })
};
