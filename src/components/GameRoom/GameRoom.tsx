import React, { useState } from 'react'
import { Redirect, useParams } from 'react-router';
import { firestore } from '../../firebase-init';
import { Chatbar } from "./Chatbar";
import { Mission } from "./Mission";
import { useDocumentData } from "react-firebase-hooks/firestore"

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

    console.table(gameData)

    // TODO: improve the loading haha

    return (
        gameData ?
            <div>
                {gameId}
                <br />
                {gameData && gameData.merlin}
                <img src="https://storage.cloud.google.com/the-odd-goose/goose.jpg" alt="This is a goose" />
            </div>
            : <>loading...</>
    )
}

