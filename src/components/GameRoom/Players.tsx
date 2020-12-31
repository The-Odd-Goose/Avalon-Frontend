import React from 'react'
import { Card, CardDeck } from 'react-bootstrap';

// single player
interface PropsPlayer {
    player: any | undefined,
    status: String,
    missionMaker: Boolean,
    owner: boolean,
    you: boolean,
    bad: boolean
}

const Player = (props: PropsPlayer) => {

    const { player, status, missionMaker, owner, you, bad } = props;

    // TODO: determine the different uses of status, ie bad makes it red or smth
    // TODO: making this work

    const mapPlayerToTsx = (player: any) => {
        const { photoURL, username } = player;
        return (
            <Card border="secondary" bg={missionMaker ? "primary": (you ? "secondary": "success")}>
                {missionMaker && <Card.Header>Mission Maker</Card.Header>}
                {owner && <Card.Header>Owner</Card.Header>}
                <Card.Img variant="top" src={photoURL} alt="Profile" />
                <Card.Body>
                    <Card.Title>{username}</Card.Title>
                    <Card.Text>
                        {status}
                        {bad && "\nThis character is a duck, evil denizen of the goose kingdom"}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    return (
        player &&
        mapPlayerToTsx(player)
    )
}

// the following is all the players together
interface PropsPlayers {
    players: Array<any> | undefined,
    loading: Boolean,
    user: any,
    missionMaker: any, // the mission maker's id
    turn: number
}

export const Players = (props: PropsPlayers) => {
    const { players, loading, user, missionMaker, turn } = props;

    return (
        !loading ?
            <CardDeck>
                {players &&
                    players.map((player, i) => {
                        let status = "?"
                        let bad = false
                        if (player.uid === user.uid || turn >= 60) {
                            if (player.merlin) {
                                status = "You are the Goose Wizard! You have the ability to sniff out all evil except sir rubber ducky"
                            }
                            else if (player.morgana) {
                                status = "You are the Duck Witch! You confuse the good duck knight by appearing as goose wizard"
                            }
                            else if (player.mordred) {
                                status = "You are the rubber ducky! You are hidden from the goose wizard!"
                            }
                            else if (player.percival) {
                                status = "You are the duck knight!"
                            } else {
                                status = "You are a normal duck citizen!"
                            }
                        }

                        if (player.bad) {
                            if (user.bad || (!player.mordred && user.merlin) || turn >= 60) {
                                bad = true
                            }
                        }

                        if ((player.merlin || player.morgana) && user.percival && turn < 60) {
                            status = "Be wary of these two -- they are either your good goose wizard, or evil duck witch"
                        }

                        return <Player key={i} bad={bad} you={player.uid === user.uid} player={player} status={status} missionMaker={player.uid === missionMaker} owner={player.owner}/>
                    })}
            </CardDeck> :
            <>loading...</>
    )
}