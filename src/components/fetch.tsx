const createFetchRequest = async (data: Object, method: string, endpoint:string) =>
    {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(data);

        const text = await fetch(`http://localhost:8080${endpoint}`, {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        })
            .then(response => response.text())
            .catch(error => console.log('error', error));

        console.log(text)
        return text;
    }

// returns a promise that is fulfilled with post
const createPostRequest = (data: Object, endpoint: string) => {
    return createFetchRequest(data, 'POST', endpoint)
}

export {createPostRequest};