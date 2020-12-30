import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router';
import { firestore, auth } from '../../firebase-init';
import { Mission } from "./Mission";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore"
import { Players } from './Players';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Alert, Button } from 'react-bootstrap';
import { createPostRequest, createDeleteRequest } from '../fetch';
import { Chatbar } from "./Chatbar";

interface Props {

}

interface OwnerProps {
    gameId: String,
    user: any
}

const deleteGameFetch = async (uid: String, gameId: String) => {
    const data = { gameId, uid }
    console.log("deleted game")
    return await createDeleteRequest(data, '/game')
}

const Owner = (props: OwnerProps) => {

    const {user, gameId} = props;

    const [error, setError] = useState("")

    const deleteGame = async () => {
        const response = await deleteGameFetch(user.uid, gameId)
        if (typeof response === 'string'){
            setError(response)
        }
    }

    const startGame = async () => {
        console.log("start game")
        const data = {gameId, uid: user.uid}
        const response = await createPostRequest(data, "/startGame")

        if (typeof response === 'string') {
            setError(response)
        }
    }

    return (
        <>
            {error &&
                <Alert variant="danger">
                    <Alert.Heading>An error occured while trying to start the game!</Alert.Heading>    
                    <p>{error}</p>
                </Alert>}
            <Button variant="danger" onClick={deleteGame}>Delete Game</Button>
            <Button variant="primary" onClick={startGame}>(Re)Start Game</Button>
        </>
    )
}

const loopPlayers = (players: Array<any> | undefined, user: any): [Boolean, Boolean, Object] => {
    if (!players) {
        return [false, false, {}];
    }

    let doesNotBelong = true;
    let isOwner = false;
    let userInfo = {};
    for (const player of players) {
        if (player.uid === user.uid) {
            doesNotBelong = false;
            isOwner = player.owner || isOwner;
            userInfo = player;
        }
    }

    return [doesNotBelong, isOwner, userInfo]

}

// this game room will integrate the chat bar as well as the different missions and such
export const GameRoom = (props: Props) => {

    // gets the gameId
    let { gameId }: any | null = useParams();

    // should fetch the data from the firebase store
    const gamesRef = firestore.collection('games').doc(gameId)
    const [gameData, loading]: [any, any, any] = useDocumentData(gamesRef)
    const [user] = useAuthState(auth)

    const playersRef = gamesRef.collection("players")
    const [players, playersLoading] = useCollectionData(playersRef, { idField: "id" });

    const messagesRef = gamesRef.collection("messages")
    const [messages, messagesLoading] = useCollectionData(messagesRef, { idField: "id" });

    const [owner, setOwner] = useState(false)
    const [notMember, setNotMember] = useState(false)
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {

        if (!loading && !playersLoading && user && gameData !== undefined) {
            console.log("calling...")
            const [notMember, isOwner, getUserInfo] = loopPlayers(players, user)
            setNotMember(!!notMember)
            setOwner(!!isOwner)
            setUserInfo(getUserInfo)
        }

    }, [loading, playersLoading]) // should only try again after the players change

    // TODO: improve the loading haha
    if (!loading && !playersLoading) {
        if (!user || gameData === undefined || notMember) {
            return <Redirect to="/" />
        }
    }

    return (
        !loading ?
            <div>
                {gameId}
                <hr />
                <Players players={players} loading={playersLoading} user={userInfo} />
                <hr />
                {JSON.stringify(gameData)}
                {owner && <Owner gameId={gameId} user={userInfo}/>}
                {userInfo && JSON.stringify(userInfo)}
                <Button variant="outline-info" href="/">Home</Button>

                <Chatbar
                  style={{ border: '4px solid #ff0000' }}
                  messages={messages}
                  players={players}
                  loading={messagesLoading || playersLoading}
                  user={userInfo}
                />
            </div>
            : <>loading...</>
    )
}

