import { WindowControls } from '#components';
import { socials } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import React from 'react';

const Contact = () => {
  return (
    <>
      <div id='window-header'>
        <WindowControls target='contact' />
        <h2>Get in Touch</h2>
      </div>
      <div className='p-8 bg-white'>
        <img src="/images/adrian.jpg" alt="adarsh" className='w-20 rounded-full'/>
        <h3>Let's Connect!</h3>
        <p>Got an idea? A bug to squash? Or just wanna do tech talk?
            I'm in.
        </p>
        <br />
        <p>Mr.aadarshkumarsingh@gmail.com</p>
        <br />
        <ul>
          {socials.map(({ id, text, icon, bg, link }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a href={link} target='_blank' rel='noopener noreferrer' title={text}>
                <img src={icon} alt={text} className='size-5' />
                <p>{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, 'contact');

export default ContactWindow;
