import { useState } from "react";
import { useApp } from "../AppProvider";
import { H1, H3 } from "../components/Headers";

export default function Contact () {
  const {router: {page}, auth: {isAuthenticated}, contact: {messages, getMessages, sendMessage}, useForm} = useApp ();
  
  const [messageErr, setMessageErr] = useState (null);
  const {set, get, submit} = useForm (values => {
    if (!values.name) return setMessageErr ('Please enter your name!');
    if (!values.message) return setMessageErr ('Please enter a message to send us!');
    if (!values.contact) return setMessageErr ('Please enter your contact information!');
    sendMessage (values);
  });
    
  if (page !== '/Clergymen/?page=contact') return '';
  if (isAuthenticated) return (
    <>
      <div className="text-center">
        <H1>Messages</H1>
      </div>
      <main className="contact-page">
        {
          messages.map (message => (
            <div className="contact-message">
              <H3>Dear {message.to || 'Clergymen'},</H3>
              <p>{message.message}</p>
              <p>Contact me at {message.contact}</p>
              <p>Sincerely, {message.name}</p>
            </div>
          ))
        }
      </main>
    </>
  );
  return (
    <>
      <div className="text-center">
        <H1>Contact The Clergymen</H1>
      </div>
      <main className="contact-page">
        {
          messageErr &&
          <div className="error">{messageErr}</div>
        }
        <div className="form-group">
          <H3>Your Name:</H3>
          <div contentEditable onBlur={e => set ('name') (e.target.innerText)}>{get ('name')}</div>
        </div>
        <div className="form-group">
          <H3>Your Contact Info:</H3>
          <div contentEditable onBlur={e => set ('contact') (e.target.innerText)}>{get ('contact')}</div>
        </div>
        <div className="form-group">
          <H3>Message:</H3>
          <div contentEditable onBlur={e => set ('message') (e.target.innerText)}>{get ('message')}</div>
        </div>
        <div className="form-group">
          <button onClick={submit}>Send Message</button>
        </div>
      </main>
    </>
  )
}