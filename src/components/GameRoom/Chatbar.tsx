// TODO: make this work with firebase for v2
import React, { useEffect, useState, useRef } from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { firebase } from '../../firebase-init';

interface Props {
  style: { [key: string]: any } | undefined,
  messagesRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
  messages: Array<any> | undefined,
  loading: Boolean,
  players: Array<any> | undefined,
  user: any
}

export const Chatbar = (props: Props) => {

  // The maximum number of messages to display.
  const messageLimit = 100;

  // Extract elements from props.
  const { style, messagesRef, messages, loading, players, user } = props;

  // States.
  const [ playersById, setPlayersById ] = useState<any>(undefined);
  const [ formattedMessages, setFormattedMessages ] = useState<any>(undefined);
  const [ typedMessage, setTypedMessage ] = useState('');

  // Ref for input field.
  const inputRef = useRef<HTMLInputElement>(null);

  // Message styles.
  // TODO: Replace with stylesheet.
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
    
    // Sort newest to oldest.
    let sorted = messages.sort((a, b) => (
      getTime(b.time.seconds, b.time.nanoseconds) - getTime(a.time.seconds, a.time.nanoseconds)
    ));
    // Take the newest messages, reverse to display newest last.
    sorted = sorted.slice(0, messageLimit).reverse();
    
    setFormattedMessages(sorted.map((msg, i) => {  // Loop through all messages.

      let player = playersById[msg.uid];

      // Single message element.
      return (
        <div
          key={i}
          style={(player.uid === user.uid) ? ownMessageStyle : otherMessageStyle} {/* TODO: Replace with stylesheet */}
        >
          <div>{player.username}:</div>
          <div>{msg.text}</div>
        </div>
      );
    }));

  }, [messages]);

  const sendMessage = async () => {

    if (!typedMessage) {
      return;
    }

    await messagesRef.add({
      uid: user.uid,
      text: typedMessage,
      time: firebase.firestore.Timestamp.now()
    });

    // Clear input field.
    if (inputRef && inputRef.current) {
      inputRef.current.value = '';
      setTypedMessage('');
    }
  }

  const onTypedMessageChange = (event: { [key: string]: any }) => {
    // Update the input field in state.
    setTypedMessage(event.target.value);
  }

  const onTypedMessageKeyDown = (event: { [key: string]: any }) => {
    // Pressing 'Enter' in the input field does the same thing as pressing send.
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  }

  if (loading) {
    return <>loading...</>;
  }

  return (
    <div style={{ ...style }}>
      {/* Messages */}
      <div style={{ marginBottom: '0.5em' }}> {/* TODO: Replace with stylesheet */}
        {formattedMessages}
      </div>
      {/* Send message input field and button */}
      <InputGroup>
        <FormControl
          ref={inputRef}
          placeholder="Message"
          aria-label="Message"
          aria-describedby="basic-addon2"
          onChange={onTypedMessageChange}
          onKeyDown={onTypedMessageKeyDown}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={sendMessage}>Send</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  )
}
