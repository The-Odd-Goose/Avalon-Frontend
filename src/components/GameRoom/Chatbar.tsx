// TODO: make this work with firebase for v2
import React, { useEffect, useState } from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { firestore, firebase } from '../../firebase-init';

interface Props {
  messages: Array<any> | undefined,
  loading: Boolean,
  players: Array<any> | undefined,
  user: any
}

export const Chatbar = (props: Props) => {

  const { messages, loading, players, user } = props;

  const [ playersById, setPlayersById ] = useState<any>(undefined);
  const [ formattedMessages, setFormattedMessages ] = useState<any>(undefined);
  const [ typedMessage, setTypedMessage ] = useState('');

  const otherMessageStyle = {
    padding: '0.5em',
    textAlign: 'left' as const
  };
  const ownMessageStyle = {
    padding: '0.5em',
    textAlign: 'right' as const
  };

  // Set playersById when needed.
  useEffect(() => {

    if (!players) {
      return undefined;
    }

    let temp : { [key: string]: any } = {};
    players.forEach(p => { temp[p.uid] = p; });
    setPlayersById(temp);

  }, [players]);

  // Set formattedMessages when needed.
  useEffect(() => {

    if (!messages) {
      return undefined;
    }

    const getTime = (sec: number, nsec: number) => (sec * Math.pow(10, 9) + nsec);
    
    let sorted = messages.sort((a, b) => (
      getTime(a.time.seconds, a.time.nanoseconds) - getTime(b.time.seconds, b.time.nanoseconds)
    ));

    setFormattedMessages(sorted.map((msg, i) => {

      let player = playersById[msg.uid];

      return (
        <div key={i} style={(player.uid === user.uid) ? ownMessageStyle : otherMessageStyle}>
          <div>{player.username}:</div>
          <div>{msg.text}</div>
        </div>
      );
    }));

  }, [messages]);

  const sendMessage = async () => {

    await firestore.collection('messages').doc().set({
      uid: user.uid,
      text: typedMessage,
      time: firebase.firestore.Timestamp.now()
    });
  }

  const onTypedMessageChange = (event : { [key: string]: any }) => {
    setTypedMessage(event.target.value);
  }

  if (loading) {
    return <>loading...</>;
  }

  return (
    <div style={{ border: '4px solid #000000' }}>
      <div style={{ marginBottom: '0.5em' }}>
        {formattedMessages}
      </div>
      {/* Send message form */}
      <InputGroup>
        <FormControl
          placeholder="Enter message"
          aria-label="Enter message"
          aria-describedby="basic-addon2"
          onChange={onTypedMessageChange}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={sendMessage}>Send</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  )
}
