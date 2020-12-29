import React from 'react'

// single player
interface PropsPlayer {
    player: any | undefined,
    status: String
    // photoURL: String,
    // username: String,
    // status: String // this will give a status to a specific player depending on the current user
}

const Player = (props: PropsPlayer) => {

    const { player, status } = props;

    // TODO: determine the different uses of status, ie bad makes it red or smth
    // TODO: making this work

    const mapPlayerToTsx = (player: any) => {
        const { photoURL, username } = player;
        return (
            <div>
                <img src={photoURL} alt="Profile" />
                {username}
                <p>{status}</p>
            </div>
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
    user: any
}

export const Players = (props: PropsPlayers) => {
    const { players, loading, user } = props;
    console.log(user)

    return (
        !loading ? <div>
            {players &&
                players.map((player, i) => {
                    let status = ""
                    if (player.uid === user.uid) {
                        status += "YOU!"
                        if(player.merlin){
                            status = "You are the Goose Wizard!"
                        }
                        else if(player.morgana) {
                            status = "You are the Duck Witch"
                        }
                        else if(player.mordred) {
                            status = "You are the rubber ducky!"
                        }
                        else if(player.percival) {
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

                    if((player.merlin || player.morgana) && user.percival) {
                        status += "Goose wizard or Duck Witch!"
                    }

                    status += " NORMAL!"

                    return <Player key={i} player={player} status={status} />
                })}
        </div> :
            <>loading...</>
    )
}