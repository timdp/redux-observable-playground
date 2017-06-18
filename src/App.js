import React from 'react'
import {connect} from 'react-redux'
import K from './state-keys'
import A from './actions'
import logo from './logo.svg'
import './App.css'

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
  count: state[K.count],
  running: state[K.running]
})

const mapDispatchToProps = (dispatch) => ({
  onStartClick: () => {
    dispatch({type: A.START})
  },
  onStopClick: () => {
    dispatch({type: A.STOP})
  },
  onIncrementClick: () => {
    dispatch({type: A.INCREMENT})
  },
  onDecrementClick: () => {
    dispatch({type: A.DECREMENT})
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseApp)
