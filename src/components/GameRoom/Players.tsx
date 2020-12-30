import React from 'react'
import { Card, CardDeck } from 'react-bootstrap';

// single player
interface PropsPlayer {
    player: any | undefined,
    status: String,
    missionMaker: Boolean 
}

const Player = (props: PropsPlayer) => {

    const { player, status, missionMaker } = props;

    // TODO: determine the different uses of status, ie bad makes it red or smth
    // TODO: making this work

    const mapPlayerToTsx = (player: any) => {
        const { photoURL, username } = player;
        return (
            <Card border="secondary" bg={missionMaker ? "primary": "secondary"}>
                {missionMaker && <Card.Header>Mission Maker</Card.Header>}
                <Card.Img variant="top" src={photoURL} alt="Profile" />
                <Card.Body>
                    <Card.Title>{username}</Card.Title>
                    <Card.Text>
                        {status}
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
    missionMaker: any // the mission maker's id
}

export const Players = (props: PropsPlayers) => {
    const { players, loading, user, missionMaker } = props;
    console.log(missionMaker)

    return (
        !loading ?
            <CardDeck>
                {players &&
                    players.map((player, i) => {
                        let status = ""
                        if (player.uid === user.uid) {
                            status += "YOU!"
                            if (player.merlin) {
                                status = "You are the Goose Wizard!"
                            }
                            else if (player.morgana) {
                                status = "You are the Duck Witch"
                            }
                            else if (player.mordred) {
                                status = "You are the rubber ducky!"
                            }
                            else if (player.percival) {
                                status = "You are the duck knight!"
                            } else {
                                status = "You are a normal duck citizen!"
                            }
                        }

                        if (player.bad) {
                            if (user.bad || (!player.mordred && user.merlin)) {
                                status += "BAD Gooose - Tis a duck!!"
                            }
                        }

                        if ((player.merlin || player.morgana) && user.percival) {
                            status += "Goose wizard or Duck Witch!"
                        }

                        status += " NORMAL!"

                        return <Player key={i} player={player} status={status} missionMaker={player.uid === missionMaker}/>
                    })}
            </CardDeck> :
            <>loading...</>
    )
}