import React from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { firestore } from '../../firebase-init';

// single player
interface PropsPlayer {
    player: any | undefined
    // photoURL: String,
    // username: String,
    // status: String // this will give a status to a specific player depending on the current user
}

const Player = (props: PropsPlayer) => {

    const {player} = props;

    // TODO: determine the different uses of status, ie bad makes it red or smth
    // TODO: making this work

    const mapPlayerToTsx = (player: any) => {
        const { photoURL, username } = player;
        return (
            <div>
                <img src={photoURL} alt="https://storage.cloud.google.com/the-odd-goose/goose.jpg" />
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
    const {playersRef} = props;
    const query = playersRef.limit(8);

    const [players] = useCollectionData(query, {idField: "id"});

    return (
        <div>
            {players &&
                players.map((player, i) => <Player key={i} player={player} />)}
        </div>
    )    
}