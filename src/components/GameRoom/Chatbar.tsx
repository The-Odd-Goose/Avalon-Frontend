// TODO: make this work with firebase for v2
import React, { useEffect, useState, useRef } from 'react'
import { Button, InputGroup, FormControl, Image } from 'react-bootstrap';
import { firebase } from '../../firebase-init';
import { Loading } from '../Loading';

interface Props {
  style: { [key: string]: any } | undefined,
  messagesRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
  messages: Array<any> | undefined,
  loading: Boolean,
  playersDict: Map<String, any>,
  user: any
}

export const Chatbar = (props: Props) => {

  // The maximum number of messages to display.
  const messageLimit = 25;

  // Extract elements from props.
  const { style, messagesRef, messages, loading, playersDict, user } = props;

  // States.
  const [formattedMessages, setFormattedMessages] = useState<any>(undefined);
  const [typedMessage, setTypedMessage] = useState('');

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

    if (!playersDict) {
      return undefined;
    }

  }, [playersDict]);

  // Set formattedMessages when needed.
  useEffect(() => {

    if (!messages) {
      return undefined;
    }

    let sorted = messages;

    setFormattedMessages(sorted.map((msg, i) => {  // Loop through all messages.

      let player = playersDict.get(msg.uid);

      // Single message element.
      // TODO: Replace with stylesheet.
      return (
        <div
          key={i}
          style={(player.uid === user.uid) ? ownMessageStyle : otherMessageStyle}
        >
          <Image roundedCircle src={player.photoURL}/>
          <div>{player.username}:</div>
          <div>{msg.text}</div>
        </div>
      );
    }));

  }, [messages]);


  // adds the message
  const sendMessage: () => void = async () => {
    const { uid } = user;

    if (!typedMessage) {
      return;
    }

    await messagesRef.add({
      uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      text: typedMessage,
    })

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
    return <Loading />;
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