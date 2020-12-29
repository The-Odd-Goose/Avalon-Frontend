// TODO: make this work with firebase for v2
import React from 'react'

interface Props {
  messages: Array<any> | undefined,
  loading: Boolean,
  players: Array<any> | undefined
}

export const Chatbar = (props: Props) => {

  const { messages, loading, players } = props;

  if (loading) {
    return <>loading...</>;
  }

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
