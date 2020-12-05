import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";

import firebase from "firebase/app"
import { auth } from '../firebase-init';
import { useAuthState } from 'react-firebase-hooks/auth'
import { Redirect } from 'react-router';

import { createPostRequest } from './fetch'

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

    const data = { username, gameId, uid, photoURL };
    await createPostRequest(data, '/addToGame')

}

const createGameFetch = async (username: string, uid: string, photoURL: string | null) => {
    const data = { username, uid, photoURL }
    return await createPostRequest(data, '/addToGame')
}

function JoinGame() {

    const [roomCode, setRoomCode] = useState("");
    const [username, setUsername] = useState("");
    const [inGame, setInGame] = useState(false);

    // for joining a game
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

    // for creating a game
    const createGameRoom: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void = async (e) => {
        e.preventDefault();

        if (auth.currentUser != null) {
            const { uid, photoURL } = auth.currentUser;
            const newRoomCode = await createGameFetch(username, uid, photoURL)

            if (typeof newRoomCode === 'string') {
                setRoomCode(newRoomCode);
                setInGame(true)
            } else {
                console.error("Error creating game")
            }

        }

    }

    if (inGame) {
        // TODO: make this a component, and save to router
        return (
            <Redirect to={`/games/${roomCode}`} />
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

                    <Form.Label>Or create your own game:</Form.Label>
                    <Button variant="secondary" onClick={createGameRoom}>Host</Button>

                </Form.Group>

                <Button variant="primary" type="submit">Join</Button>

            </Form>

            {/* separate form to create a game */}

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