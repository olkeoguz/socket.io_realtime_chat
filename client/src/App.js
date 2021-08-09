import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import uuid from 'react-uuid';
import { Page, Container, TextArea, Button, Form } from './styles';
import Messages from './Messages';

function App() {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on('your id', (id) => {
      setYourID(id);
    });

    socketRef.current.on('message', (message) => {
      receiveMessage(message);
    });

    socketRef.current.on('delete', (message) => {
      removeDeletedMessage(message);
    });
  }, []);

  const receiveMessage = (message) => {
    setMessages((oldMessages) => [...oldMessages, message]);
  };

  const removeDeletedMessage = (message) => {
    setMessages((oldMessages) =>
      oldMessages.filter((m) => m.messageId !== message.messageId)
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (file) {
      //constructing the image File
      const messageObj = {
        userID: yourID,
        type: 'file',
        body: file,
        messageId: uuid(),
        mimeType: file.type,
        fileName: file.name,
      };
      setMessage('');
      setFile(null);
      socketRef.current.emit('send message', messageObj);
    } else {
      const messageObj = {
        body: message,
        userID: yourID,
        messageId: uuid(),
      };
      setMessage('');
      socketRef.current.emit('send message', messageObj);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const deleteMessage = (message) => {
    const obj = {
      body: message.body,
      messageId: message.messageId,
      userID: message.userID,
    };
    socketRef.current.emit('delete message', obj);
  };

  const selectFile = (e) => {
    setMessage(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  return (
    <Page>
      <Container>
        <Messages messages={messages} yourID={yourID} del={deleteMessage} />
      </Container>
      <Form onSubmit={sendMessage}>
        <TextArea
          value={message}
          onChange={handleChange}
          placeholder='Say Something...'
        />
        <input type='file' onChange={selectFile} />
        <Button type='submit'>Send</Button>
      </Form>
    </Page>
  );
}

export default App;
