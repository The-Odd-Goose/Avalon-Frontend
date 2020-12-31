import React, { useState, useEffect } from 'react'
import { Spinner, Image, Badge, Button, Alert, Modal } from 'react-bootstrap';
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
    players: Map<String, any>,
    gameId: string
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

interface VoteFormProps {
    gameId: string,
    uid: string,
    voteField: string,
    stringFor: string,
    stringAgainst: string,
    path: string
}

const Vote = (props: VoteFormProps) => {
    const { gameId, uid, voteField, stringFor, stringAgainst, path } = props;

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [show, setShow] = useState({ show: false, voteFor: false })

    const voteOnMission = async () => {
        setLoading(true)
        const response = await createPostRequest({ gameId, uid, [voteField]: show.voteFor }, path)
        if (typeof response === 'string') {
            // ie there is an error,
            setError(response)
        }
        setLoading(false)
        setShow({ show: false, voteFor: false })
    }

    const handleClick = (voteFor: boolean) => {
        setShow({ show: true, voteFor })
    }

    const handleClose = () => setShow((state) => ({ show: false, voteFor: state.voteFor }))

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={() => handleClick(true)}>{stringFor}</Button>
            <Button variant="danger" onClick={() => handleClick(false)}>{stringAgainst}</Button>

            <Modal
                show={show.show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{show.voteFor ? stringFor : stringAgainst}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{loading ? "...loading" : "Are you sure you want to vote this way?"}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={voteOnMission}>Yes</Button>
                </Modal.Footer>
            </Modal>

        </>
    )

}

// finds if uid is in array vote
const getCanVote = (vote: Array<any>, uid: string): boolean => {
    return vote.reduce((prev, current) => {
        return prev || uid === current
    }, false)
}

const VoteMission = (props: VoteProps) => {

    const { voteFor, voteAgainst, mission, vote, players, uid, gameId } = props;

    const canVote = getCanVote(vote, uid)

    return (
        <>
            Players on Mission: {" "}
            {mission?.map((player, key) => {
                return displayPlayer(players.get(player), key)
            })}

            <hr />
            {vote && 
                <>Players left to vote:
                {vote?.map((player, key) => {
                    return displayPlayer(players.get(player), key)
                })}
                </>
            }
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
            {canVote &&
                <Vote
                    gameId={gameId}
                    uid={uid}
                    voteField="voteFor"
                    path="/voteMission"
                    stringAgainst="Vote Against Mission"
                    stringFor="Vote For Mission"
                />}
        </>
    )
}

interface DecideMissionProps {
    mission: Array<any>,
    uid: string,
    gameId: string
}

const DecideMission = (props: DecideMissionProps) => {
    const { mission, uid, gameId } = props;
    const canVote = getCanVote(mission, uid)

    return (
        <>
            {canVote &&
                <>Decide on mission!
                    <Vote
                        gameId={gameId}
                        uid={uid}
                        voteField="vote"
                        path="/choose"
                        stringAgainst="Fail Mission"
                        stringFor="Succeed Mission"
                    />
                </>
            }
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

interface MissionChoicesProps {
    successMission: number,
    failMission: number
}

const MissionChoices = (props: MissionChoicesProps) => {
    const {successMission, failMission} = props;

    return (
        <>Votes for success: {successMission} {" "} Votes for fail: {failMission}</>
    )
}

export const Mission = (props: Props) => {

    const { gameData, missionMaker, players, uid, gameId, playersDict } = props;
    const { success, turn, fail, rejected: rejections, voteFor, voteAgainst, vote, mission, successMission, failMission } = gameData

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

            {(turn % 10 === 0) && (turn < 60) &&

                <>
                    {turn >= 20 && 
                        <MissionChoices successMission={successMission} failMission={failMission}/>
                    }
                    {missionMaker === uid && // if the turn is x1 and we are the mission maker, show choosing mission
                        <>
                            Possible Mission People:
                            <ChooseMission players={players} turn={turn} uid={missionMaker} gameId={gameId} />
                        </>
                    }
                </>
            }

            {(turn % 10 === 1 || (turn % 10 === 5)) &&
                <VoteMission gameId={gameId} uid={uid} voteFor={voteFor} voteAgainst={voteAgainst} vote={vote} mission={mission} players={playersDict} />
            }

            {(turn % 10 === 5) &&
                <DecideMission gameId={gameId} uid={uid} mission={mission} />
            }

        </div>
    )
}
