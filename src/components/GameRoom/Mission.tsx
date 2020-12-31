import React, { useState, useEffect } from 'react'
import { Spinner, Image, Badge, Button, Alert } from 'react-bootstrap';
import { createPostRequest } from '../fetch';

interface Props {
    gameData: any,
    missionMaker: string,
    players: Array<any> | undefined,
    uid: string,
    gameId: string,
    playersDict: Map<String, any>
}

interface ChooseProps {
    players: Array<any> | undefined,
    turn: number,
    uid: string,
    gameId: string
}

const numMission = [
    [2, 3, 2, 3, 3], // 5 people
    [2, 3, 3, 3, 4], // 6 people
    [3, 4, 3, 4, 5], // 7 people
    [3, 4, 4, 4, 5] // 8 people
]

const ChooseMission = (props: ChooseProps) => {
    const { players, turn, uid, gameId } = props;

    const [mission, setMission]: [boolean[], any] = useState([])
    const [remaining, setRemaining] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (players) {
            const length = players.length
            const boolPlayers = []
            for (let i = 0; i < length; i++) {
                boolPlayers.push(false)
            }
            setMission(boolPlayers)
            setRemaining(numMission[length - 5][(turn - 10) / 10])
        }
    }, [players])

    const changeChoice = (key: number) => {
        if (remaining <= 0 && !mission[key]) {
            return;
        }
        const newMission = mission;
        newMission[key] = !mission[key]
        setMission(newMission)
        setRemaining((remaining) => (mission[key] ? remaining - 1 : remaining + 1))
    }

    const mapPlayerToMissionChoice = (player: any, key: number) => {
        const { photoURL, username } = player;
        return (
            <span key={key}>
                <Image src={photoURL} alt="Profile" roundedCircle onClick={(e) => changeChoice(key)} />
                {" "} {username} {" "}
                {mission[key] && <Badge variant="success">Mission Select</Badge>}
            </span>
        )
    }

    const submitMissionProposal = async () => {
        setLoading(true)
        const proposeMission = []
        for (let i = 0; i < mission.length; i++) {
            if (players) {
                const element = players[i]
                if (mission[i] && element) {
                    proposeMission.push(element.uid)
                }
            }
        }

        const response = await createPostRequest({ uid, gameId, mission: proposeMission }, "/proposeMission")

        if (typeof response === 'string') {
            setError(response)
        }

        setLoading(false)
    }

    return (
        <>
            {loading && <>...loading</>}
            {error && <Alert variant="danger">{error}</Alert>}
            {players?.map((player, i) => {
                return mapPlayerToMissionChoice(player, i)
            })}
            Remaining Number of People to add to mission: {remaining}
            {" "}
            <Button variant="outline-warning" onClick={submitMissionProposal} disabled={remaining !== 0 && !loading}>Submit Mission Proposal!</Button>
        </>
    )
}

interface VoteProps {
    voteFor: Array<any>,
    voteAgainst: Array<any>,
    mission: Array<string>,
    vote: Array<string>,
    uid: string,
    players: Map<String, any>
}

const displayPlayer = (player: any, key: number): JSX.Element => {
    if (player) {
        const { photoURL, username } = player;
        return (
            <span key={key}>
                <Image src={photoURL} alt="Profile" roundedCircle />
                {" "} {username} {" "}
            </span>
        )
    }
    return <></>;
}

const VoteMission = (props: VoteProps) => {

    const { voteFor, voteAgainst, mission, vote, players, uid } = props;

    const canVote = vote.reduce((prev, current) => {
        return prev || uid === current
    }, false)

    console.log(canVote)

    return (
        <>
            Players on Mission: {" "}
            {mission?.map((player, key) => {
                return displayPlayer(players.get(player), key)
            })}

            <hr />
            Voted For: {" "}
            {voteFor?.map((player, key) => {
                return displayPlayer(players.get(player), key)
            })}

            <hr />
            Voted Against: {" "}
            {voteAgainst?.map((player, key) => {
                return displayPlayer(players.get(player), key)
            })}

            <hr />
            
        </>
    )
}

const getJsxArray = (num: Number, upperNum: number, jsxTrue: (key: number) => JSX.Element, jsxFalse: (key: number) => JSX.Element): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = []

    for (let i = 0; i < upperNum; i++) {
        if (num < i + 1) {
            jsxArray.push(jsxTrue(i))
        } else {
            jsxArray.push(jsxFalse(i))
        }
    }

    return jsxArray;
}

export const Mission = (props: Props) => {

    const { gameData, missionMaker, players, uid, gameId, playersDict } = props;
    const { success, turn, fail, rejected: rejections, voteFor, voteAgainst, vote, mission } = gameData

    // turns the number of successes into an array of jsx elements
    // 3 - that number gets turned into a different type
    const successJsx = getJsxArray(success, 3, (key) => <Spinner key={key} animation="border" variant="secondary" />, (key) => <Spinner key={key} animation="grow" variant="success" />)
    const failJsx = getJsxArray(fail, 3, (key) => <Spinner key={key} animation="border" variant="secondary" />, (key) => <Spinner key={key} animation="grow" variant="danger" />)
    const rejectionsJsx = getJsxArray(rejections, 5, (key) => <Spinner key={key} animation="border" variant="secondary" />, (key) => <Spinner key={key} animation="grow" variant="dark" />)

    return (
        <div>
            Mission Successes: {successJsx}
            {' '}
            Mission Fails: {failJsx}
            {" "}
            Mission Rejections: {rejectionsJsx}

            <hr />

            {(turn % 10 === 0) && missionMaker === uid && // if the turn is x1 and we are the mission maker, show choosing mission
                <>Possible Mission People:
                    <ChooseMission players={players} turn={turn} uid={missionMaker} gameId={gameId} />
                </>
            }

            {(turn % 10 === 1) &&
                <VoteMission uid={uid} voteFor={voteFor} voteAgainst={voteAgainst} vote={vote} mission={mission} players={playersDict} />
            }

        </div>
    )
}
