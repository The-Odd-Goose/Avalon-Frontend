import React from 'react'
import { Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";

interface Props {
}

function joinGameRoom() {
    console.log("test")
}

export const MainMenu = (props: Props) => {
    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Game Room Code:</Form.Label>
                    <Form.Control type="text" />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={joinGameRoom}>Join</Button>

            </Form>


        </div>
    )
}