import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
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

const addToGameFetch = async (username: string, gameId: string, uid: string) => {

    const data = { username, gameId, uid };
    return await createPostRequest(data, '/gameMember')

}

const createGameFetch = async (username: string, uid: string) => {
    const data = { username, uid }
    return await createPostRequest(data, '/game')
}

function JoinGame() {

    // TODO: add in a loading after pressing join game and create game and disable buttons

    const [roomCode, setRoomCode] = useState("");
    const [username, setUsername] = useState("");
    const [inGame, setInGame] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    // for joining a game
    const joinGameRoom: (e: React.FormEvent<HTMLFormElement>) => void = async (e) => {
        setLoading(true)
        // here we'll add the user id to the specific game room
        e.preventDefault();

        // as long as the current user exists, then print out the uid and photoURL
        if (auth.currentUser != null) {
            const { uid } = auth.currentUser;
            // then here we'll send an http request
            const response = await addToGameFetch(username, roomCode, uid)

            if (typeof response === 'string') {
                // then an error has occured
                setError(response)
                setLoading(false)
            } else {
                // now we want to redirect to a separate page
                setInGame(true);
            }
        }


    }

    // for creating a game
    const createGameRoom: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void = async (e) => {
        setLoading(true)
        e.preventDefault();

        if (auth.currentUser != null) {
            const { uid } = auth.currentUser;
            const gameCode = await createGameFetch(username, uid)

            if (typeof gameCode !== 'string') {
                setRoomCode(gameCode.gameId);
                setInGame(true)
            } else {
                setError(gameCode)
                setLoading(false)
            }

        }

    }

    if (inGame) {
        return (
            <Redirect to={`/games/${roomCode}`} />
        );
    }

    return (
        loading ? <>loading...</> :
        <div>
            {error && 
                <Alert variant="danger">
                    <Alert.Heading>An error has occured!</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            }

            <Form onSubmit={joinGameRoom}>

                <Form.Group>
                    <Form.Label>Game Room Code:</Form.Label>
                    <Form.Control type="text" onChange={(e) => setRoomCode(e.target.value)} />

                    <Form.Label>Nickname:</Form.Label>
                    <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} />

                    {/* For hosting your own game */}
                    <Form.Label>Or create your own game:</Form.Label>
                    <Button variant="secondary" onClick={createGameRoom}>Host</Button>

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
            {user ?
                <div><JoinGame /></div> : <SignIn />}
        </>
    )
}