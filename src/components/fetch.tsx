const createFetchRequest = async (data: Object, method: string, endpoint:string) =>
    {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(data);

        // const backendURL = "https://backend-26kgkl3loq-uc.a.run.app"
        const json = await fetch(`http://localhost:8080${endpoint}`, {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        })
            .then(async response =>
                {
                    if (response.ok){
                        return await response.json()
                    } else{
                        return await response.text()
                    }
                })
            .catch((error) => console.log('error', error));

        return json;
    }

// returns a promise that is fulfilled with post
const createPostRequest = (data: Object, endpoint: string) => {
    return createFetchRequest(data, 'POST', endpoint)
}

export {createPostRequest};