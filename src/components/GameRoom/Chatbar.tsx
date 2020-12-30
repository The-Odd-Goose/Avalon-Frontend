// TODO: make this work with firebase for v2
import React from 'react'
import { firebase } from '../../firebase-init';
interface Props {
  messages: Array<any> | undefined,
  loading: Boolean,
  players: Array<any> | undefined,
  messagesRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
  user: any
}

export const Chatbar = (props: Props) => {

  const { messages, loading, players, messagesRef, user } = props;

  // adds the message
  const sendMessage: (e: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault()
    const {uid, photoURL} = user;
    await messagesRef.add({
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      text: "Here we'll pass in the value"      
    })

  }
  
  if (loading) {
    return <>loading...</>;
  }

  // TODO: max add a form here that gets the message I guess
  // TODO: maybe save it as a state? -- then use sendMessage after form submission

  return (
    <div style={{border: '4px solid #000000'}}>
      Chatbar:
      <div style={{backgroundColor: '#ff0000'}}>
        {JSON.stringify(messages)}
      </div>
      <div style={{backgroundColor: '#0000ff'}}>
        {JSON.stringify(players)}
      </div>
    </div>
  )
}
