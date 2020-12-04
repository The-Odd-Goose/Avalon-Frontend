import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";

import firebase from "firebase/app"
import { auth } from '../firebase-init';
import { useAuthState } from 'react-firebase-hooks/auth'
import { Redirect } from 'react-router';

interface Props {
}

// a button for signing in
function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )

}

// a button for signing out
function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

const addToGameFetch = async (username: string, gameId: string, uid: string, photoURL: string | null) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        username,
        gameId,
        uid,
        photoURL
    });

    await fetch("http://localhost:8080/addToGame", {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function JoinGame() {

    const [roomCode, setRoomCode] = useState("");
    const [username, setUsername] = useState("");
    const [inGame, setInGame] = useState(false);

    const joinGameRoom: (e: React.FormEvent<HTMLFormElement>) => void = async (e) => {
        // here we'll add the user id to the specific game room
        e.preventDefault();
        console.log(`This is the given game code: ${roomCode}`)

        // as long as the current user exists, then print out the uid and photoURL
        if (auth.currentUser != null) {
            const { uid, photoURL } = auth.currentUser;
            console.log(`This is the user id ${uid} and the photoURL ${photoURL}`);
            // then here we'll send an http request
            await addToGameFetch(username, roomCode, uid, photoURL)

            // now we want to redirect to a separate page
            setInGame(true);

        }

    }

    if (inGame) {
        // TODO: make this a component, and save to router
        return (
            <Redirect to={`/games/${roomCode}`}/>
        );
    }

    return (
        <div>

            <Form onSubmit={joinGameRoom}>

                <Form.Group>
                    <Form.Label>Game Room Code:</Form.Label>
                    <Form.Control type="text" onChange={(e) => setRoomCode(e.target.value)} />

                    <Form.Label>Nickname:</Form.Label>
                    <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} />

                </Form.Group>

                <Button variant="primary" type="submit">Join</Button>

            </Form>
        </div>
    )

}

export const MainMenu = (props: Props) => {

    const [user] = useAuthState(auth);

    return (
        <>
            <SignOut />
            {user ? <JoinGame /> : <SignIn />}
        </>
    )
}