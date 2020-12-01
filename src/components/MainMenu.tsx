import React from 'react'
import { Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";

import firebase from "firebase/app"
import { auth } from '../firebase-init';
import { useAuthState } from 'react-firebase-hooks/auth'

interface Props {
}

function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )

}

function JoinGame() {

    const joinGameRoom: (e: React.FormEvent<HTMLFormElement>) => void = async (e) => {
        // here we'll add the user id to the specific game room

    }


    return (
        <div>
            <Form onSubmit={joinGameRoom}>

                <Form.Group>
                    <Form.Label>Game Room Code:</Form.Label>
                    <Form.Control type="text" />
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
            {user ? <JoinGame /> : <SignIn />}
        </>
    )
}