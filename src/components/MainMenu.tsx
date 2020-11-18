import React from 'react'
import { Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";

interface Props {
}

function SignIn() {
}

export const MainMenu = (props: Props) => {

    const joinGameRoom:(e: React.FormEvent<HTMLFormElement>) => void = async (e) => {
        // here we'll add the user id to the specific game room

    }

    return (
        <div>
            <Form onSubmit={joinGameRoom}>
                <Form.Group>
                    <Form.Label>Game Room Code:</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>

                <Button variant="primary" type="submit">Join</Button>

            </Form>


        </div>
    )
}