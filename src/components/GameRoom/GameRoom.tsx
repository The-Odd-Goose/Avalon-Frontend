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
import { Loading } from '../Loading';

interface Props {

}

interface OwnerProps {
    gameId: String,
    user: any
}

const deleteGameFetch = async (uid: String, gameId: String) => {
    const data = { gameId, uid }
    return await createDeleteRequest(data, '/game')
}

const Owner = (props: OwnerProps) => {

    const { user, gameId } = props;

    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const deleteGame = async () => {
        const response = await deleteGameFetch(user.uid, gameId)
        if (typeof response === 'string') {
            setError(response)
        }
    }

    const startGame = async () => {
        const data = { gameId, uid: user.uid }
        const response = await createPostRequest(data, "/startGame")

        if (typeof response === 'string') {
            setError(response)
        } else {
            setMessage(response.message)
        }
    }

    return (
        <>
            {error &&
                <Alert variant="danger">
                    <Alert.Heading>An error occured while trying to start the game!</Alert.Heading>
                    <p>{error}</p>
                </Alert>}
            {message &&
                <Alert variant="success">{message}</Alert>}
            <Button variant="danger" onClick={deleteGame}>Delete Game</Button>
            <Button variant="primary" onClick={startGame}>Start Game</Button>
        </>
    )
}

const loopPlayers = (players: Array<any> | undefined, user: any): [Boolean, Boolean, Object, Map<String, any>] => {
    if (!players) {
        return [false, false, {}, new Map()];
    }

    let doesNotBelong = true;
    let isOwner = false;
    let userInfo = {};

    let playersDict = new Map()

    for (const player of players) {
        let uid = player.uid
        if (typeof uid === 'string') {
            playersDict.set(uid, player)
        }
        if (player.uid === user.uid) {
            doesNotBelong = false;
            isOwner = player.owner || isOwner;
            userInfo = player;
        }
    }

    return [doesNotBelong, isOwner, userInfo, playersDict]

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
    const query = messagesRef.orderBy("createdAt").limit(25)
    const [messages, messagesLoading] = useCollectionData(query, { idField: "id" });

    const [owner, setOwner] = useState(false)
    const [notMember, setNotMember] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [missionMaker, setMissionMaker] = useState("") // we need to get the mission maker as well

    const [playersDict, setPlayersDict] = useState(new Map())

    useEffect(() => {

        if (!loading && !playersLoading && user && gameData !== undefined) {
            const [notMember, isOwner, getUserInfo, getPlayersDict] = loopPlayers(players, user)
            setNotMember(!!notMember)
            setOwner(!!isOwner)
            setUserInfo(getUserInfo)
            setPlayersDict(getPlayersDict)
            if (gameData.turn !== 0) {
                setMissionMaker(gameData.playersList[gameData.missionMaker])
            }
        }

    }, [loading, playersLoading, gameData, players]) // should only try again after the players change

    // TODO: improve the loading haha
    if (!loading && !playersLoading) {
        if (!user || gameData === undefined || notMember) {
            return <Redirect to="/" />
        }
    }

    return (
        !loading && !playersLoading ?
            <div>
                <Button variant="link" href="/about">Rules and About!</Button>
                The Room Code is: {gameId}
                <br />
                Turn: {gameData.turn}
                <hr />
                <Players players={players} loading={playersLoading} user={userInfo} missionMaker={missionMaker} turn={gameData.turn}/>
                <hr />
                {gameData.turn === 0 ?
                    <p>Game has not started yet!</p>
                    : <Mission
                        gameData={gameData}
                        gameId={gameId}
                        players={players}
                        uid={user.uid}
                        missionMaker={missionMaker}
                        playersDict={playersDict}
                    />
                }
                <hr />
                {gameData.turn === 60 &&
                    // todo: what to show when the winner is decided!
                    gameData.winner
                }
                <hr />
                {owner && <Owner gameId={gameId} user={userInfo} />}
                <Button variant="outline-info" href="/">Home</Button>

                <Chatbar
                  style={{ border: '4px solid #ff0000' }}
                  messagesRef={messagesRef}
                  messages={messages}
                  playersDict={playersDict}
                  loading={messagesLoading || playersLoading}
                  user={userInfo}
                />
            </div>
            : <Loading />
    )
}

