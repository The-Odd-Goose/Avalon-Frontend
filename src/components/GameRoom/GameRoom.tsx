import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router';
import { firestore } from '../../firebase-init';
import { Mission } from "./Mission";
import { useDocumentData } from "react-firebase-hooks/firestore"
import { Players } from './Players';

interface Props {

}

// this game room will integrate the chat bar as well as the different missions and such
export const GameRoom = (props: Props) => {

    // gets the gameId
    let { gameId }: any | null = useParams();

    // should fetch the data from the firebase store
    const gamesRef = firestore.collection('games').doc(gameId)
    const [gameData, loading]: [any, any, any] = useDocumentData(gamesRef)

    if (gameData === undefined && !loading) {
        return <Redirect to="/" />
    }

    const playersRef = gamesRef.collection("players")

    // TODO: improve the loading haha

    return (
        !loading ?
            <div>
                {gameId}
                <hr />
                <Players playersRef={playersRef} />
                <hr />
                {JSON.stringify(gameData)}
            </div>
            : <>loading...</>
    )
}

