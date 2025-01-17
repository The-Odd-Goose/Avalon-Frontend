const createFetchRequest = async (data: Object, method: string, endpoint:string) =>
    {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(data);

        const json = await fetch(`${endpoint}`, {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        })
            .then(async response =>
                {
                    if (response.ok) {
                        return await response.json()
                    } else {
                        return await response.text()
                    }
                })
            .catch(error => console.log('error', error));

        return json;
    }

// returns a promise that is fulfilled with post
const createPostRequest = (data: Object, endpoint: string) => {
    return createFetchRequest(data, 'POST', endpoint)
}

const createDeleteRequest = (data: Object, endpoint: string) => {
    return createFetchRequest(data, 'DELETE', endpoint)
}

export {createPostRequest, createDeleteRequest};