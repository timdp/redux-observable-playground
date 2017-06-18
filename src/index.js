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
import {KEYS as K, ACTIONS as A, App} from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const UPDATE_ACTION = Symbol('UPDATE')

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
    .map(() => ({type: UPDATE_ACTION, nextState: reducer(store.getState())}))

// Epics

const count_ = (action$) =>
  action$.ofType(A.START)
    .switchMap(() => Observable.interval(COUNT_INTERVAL)
      .mapTo({type: A.INCREMENT})
      .takeUntil(action$.ofType(A.STOP)))

const start_ = createStateUpdateEpic(A.START, (state) => ({...state,
  [K.running]: true
}))

const stop_ = createStateUpdateEpic(A.STOP, (state) => ({...state,
  [K.running]: false
}))

const requestIncrement_ = createThrottleEpic(
  A.REQUEST_INCREMENT, A.INCREMENT, CLICK_THROTTLE_TIME)

const requestDecrement_ = createThrottleEpic(
  A.REQUEST_DECREMENT, A.DECREMENT, CLICK_THROTTLE_TIME)

const increment_ = createStateUpdateEpic(A.INCREMENT, (state) => ({...state,
  [K.count]: state[K.count] + 1
}))

const decrement_ = createStateUpdateEpic(A.DECREMENT, (state) => ({...state,
  [K.count]: state[K.count] + 1
}))

// Wirings

const reducer = (state, action) =>
  (typeof state === 'undefined') ? DEFAULT_STATE
    : (action.type === UPDATE_ACTION) ? action.nextState
    : state

const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ != null)
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({serialize: true})
  : compose

const store = createStore(reducer,
  composeEnhancers(applyMiddleware(createEpicMiddleware(combineEpics(
    count_,
    start_,
    stop_,
    requestIncrement_,
    requestDecrement_,
    increment_,
    decrement_
  )))))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
registerServiceWorker()
