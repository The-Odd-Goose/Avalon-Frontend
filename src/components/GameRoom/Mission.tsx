import React from 'react'
import { Spinner } from 'react-bootstrap';

interface Props {
    success: Number,
    turn: Number,
    fail: Number,
    rejections: Number
}

const getJsxArray = (num: Number, upperNum: number, jsxTrue: JSX.Element, jsxFalse: JSX.Element): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = []

    for(let i = 0; i < upperNum; i++) {
        if(num < i + 1) {
            jsxArray.push(jsxTrue)
        } else {
            jsxArray.push(jsxFalse)
        }
    }

    return jsxArray
}

export const Mission = (props: Props) => {

    const { success, turn, fail, rejections } = props;

    // turns the number of successes into an array of jsx elements
    // 3 - that number gets turned into a different type
    const successJsx = getJsxArray(success, 3, <Spinner animation="border" variant="secondary"/>, <Spinner animation="grow" variant="success"/>)
    const failJsx = getJsxArray(fail, 3, <Spinner animation="border" variant="secondary"/>, <Spinner animation="grow" variant="danger"/> )
    const rejectionsJsx = getJsxArray(rejections, 5, <Spinner animation="border" variant="secondary"/>, <Spinner animation="grow" variant="dark"/> )

    return (
        <div>
            Mission Successes: {successJsx}
            {' '}
            Mission Fails: {failJsx}
            {" "}
            Mission Rejections: {rejectionsJsx}
        </div>
    )
}
