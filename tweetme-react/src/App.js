import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {TweetsComponent} from './tweets'


function App(props) {
  // const {username} = props.username
  console.log(props)
  return (
    <React.Fragment>
    
    <TweetsComponent props={props} />
    </React.Fragment>
  );
}

export default App;
