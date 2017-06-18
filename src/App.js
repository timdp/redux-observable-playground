import React from 'react'
import {connect} from 'react-redux'
import logo from './logo.svg'
import './App.css'

const RE_TOKENS = /(\S+)/g

const qw = (str) => {
  const tokens = []
  let match
  while ((match = RE_TOKENS.exec(str)) !== null) {
    tokens.push(match[1])
  }
  return tokens
}

const enumerize = (names) => Object.assign({},
  ...names.map((name) => ({[name]: Symbol(name)})))

const ACTIONS = enumerize(qw`
  START
  STOP
  INCREMENT
  DECREMENT
  REQUEST_INCREMENT
  REQUEST_DECREMENT
`)

const KEYS = enumerize(qw`
  count
  running
`)

const BaseApp = ({count, running, onStartClick, onStopClick, onIncrementClick, onDecrementClick}) => (
  <div className='App'>
    <div className='App-header'>
      <img src={logo} className='App-logo' alt='logo' />
      <h2>Welcome to React</h2>
    </div>
    <p className='App-intro'>
      {count}
    </p>
    <p>
      <button onClick={onStartClick} disabled={running}>Start</button>
      {' '}
      <button onClick={onStopClick} disabled={!running}>Stop</button>
      {' '}
      <button onClick={onIncrementClick}>Increment</button>
      {' '}
      <button onClick={onDecrementClick}>Decrement</button>
    </p>
    <p>
      {running ? 'Counting …' : 'Press start!'}
    </p>
  </div>
)

const mapStateToProps = (state) => ({
  count: state[KEYS.count],
  running: state[KEYS.running]
})

const mapDispatchToProps = (dispatch) => ({
  onStartClick: () => {
    dispatch({type: ACTIONS.START})
  },
  onStopClick: () => {
    dispatch({type: ACTIONS.STOP})
  },
  onIncrementClick: () => {
    dispatch({type: ACTIONS.REQUEST_INCREMENT})
  },
  onDecrementClick: () => {
    dispatch({type: ACTIONS.REQUEST_DECREMENT})
  }
})

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseApp)

export {
  KEYS,
  ACTIONS,
  App
}
