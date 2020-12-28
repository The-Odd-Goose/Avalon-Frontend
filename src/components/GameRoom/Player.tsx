import React from 'react'

interface Props {
    photoURL: String,
    username: String,
    status: String // this will give a status to a specific player depending on the current user
}

export const Player = (props: Props) => {

    const {photoURL, username, status} = props;

    // TODO: determine the different uses of status, ie bad makes it red or smth
    // TODO: making this work

    return (
        <div>
            
        </div>
    )
}
