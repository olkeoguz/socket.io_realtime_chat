import React from 'react';
import Image from './Image';
import { MyRow, MyMessage, PartnerRow, PartnerMessage } from './styles';

const Messages = ({ messages, yourID, del }) => {
  const renderMessages = (message, index) => {

    //deciding if it's a text or image
    if (message.type === 'file') {
      const blob = new Blob([message.body], { type: message.type }); //image file data type = blob

      if (message.userID === yourID) {
        return (
          <MyRow key={index}>
            <Image fileName={message.fileName} blob={blob} />
            <button onClick={() => del(message)}>X</button>
          </MyRow>
        );
      }
      return (
        <PartnerRow key={index}>
          <Image fileName={message.fileName} blob={blob} />
        </PartnerRow>
      );
    }

    if (message.userID === yourID) {
      return (
        <MyRow key={index}>
          <MyMessage>{message.body}</MyMessage>
          <button onClick={() => del(message)}>X</button>
        </MyRow>
      );
    }
    return (
      <PartnerRow key={index}>
        <PartnerMessage>{message.body}</PartnerMessage>
      </PartnerRow>
    );
  };

  return <div>{messages.map(renderMessages)}</div>;
};

export default Messages;
