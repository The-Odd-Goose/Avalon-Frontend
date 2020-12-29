import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';

// single player
interface PropsPlayer {
    player: any | undefined
    // photoURL: String,
    // username: String,
    // status: String // this will give a status to a specific player depending on the current user
}

const Player = (props: PropsPlayer) => {

    const { player } = props;

    // TODO: determine the different uses of status, ie bad makes it red or smth
    // TODO: making this work

    const mapPlayerToTsx = (player: any) => {
        const { photoURL, username } = player;
        return (
            <div>
                <img src={photoURL} alt="Profile" />
                {username}
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
    playersRef: firebase.default.firestore.CollectionReference<firebase.default.firestore.DocumentData>
}

export const Players = (props: PropsPlayers) => {
    const { playersRef } = props;

    const [players, loading] = useCollectionData(playersRef, { idField: "id" });

    return (
        !loading ? <div>
            {players &&
                players.map((player, i) => <Player key={i} player={player} />)}
        </div> :
            <>loading...</>
    )
}