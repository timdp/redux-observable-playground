import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/throttleTime'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeUntil'
import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import {createEpicMiddleware, combineEpics} from 'redux-observable'
import App from './App'
import K from './state-keys'
import A from './actions'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

// Internal actions

const A_UPDATE = Symbol('UPDATE')
const A_INCREMENT_REAL = Symbol('INCREMENT_REAL')
const A_DECREMENT_REAL = Symbol('DECREMENT_REAL')

// Config

const DEFAULT_STATE = {
  [K.count]: 0,
  [K.running]: false // TODO Allow true
}

const CLICK_THROTTLE_TIME = 1000

const COUNT_INTERVAL = 500

// Helpers

const createThrottleEpic = (inputType, outputType, time) => (action$) =>
  action$.ofType(inputType)
    .throttleTime(time)
    .mapTo({type: outputType})

const createStateUpdateEpic = (actionType, reducer) => (action$, store) =>
  action$.ofType(actionType)
    .map(() => ({type: A_UPDATE, nextState: reducer(store.getState())}))

// Epics

const count_ = (action$) =>
  action$.ofType(A.START)
    .switchMap(() => Observable.interval(COUNT_INTERVAL)
      .mapTo({type: A_INCREMENT_REAL})
      .takeUntil(action$.ofType(A.STOP)))

const start_ = createStateUpdateEpic(A.START,
  (state) => ({...state,
    [K.running]: true
  }))

const stop_ = createStateUpdateEpic(A.STOP,
  (state) => ({...state,
    [K.running]: false
  }))

const increment_ = createThrottleEpic(A.INCREMENT, A_INCREMENT_REAL,
  CLICK_THROTTLE_TIME)

const decrement_ = createThrottleEpic(A.DECREMENT, A_DECREMENT_REAL,
  CLICK_THROTTLE_TIME)

const incrementReal_ = createStateUpdateEpic(A_INCREMENT_REAL,
  (state) => ({...state,
    [K.count]: state[K.count] + 1
  }))

const decrementReal_ = createStateUpdateEpic(A_DECREMENT_REAL,
  (state) => ({...state,
    [K.count]: state[K.count] - 1
  }))

// Wirings

const reducer = (state, action) =>
  (typeof state === 'undefined') ? DEFAULT_STATE
    : (action.type === A_UPDATE) ? action.nextState
    : state

const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ != null)
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({serialize: true})
  : compose

const store = createStore(reducer,
  composeEnhancers(applyMiddleware(createEpicMiddleware(combineEpics(
    count_,
    start_,
    stop_,
    increment_,
    decrement_,
    incrementReal_,
    decrementReal_
  )))))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
