import React from 'react'
import ReactDOM  from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import store from './redux/store'

import Login from './containers/login/login'
import Main from './containers/main/main'
import Register from './containers/register/register'
import Info from './containers/info/info'

ReactDOM.render(
  (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path= '/register' component={Register}/>
          <Route path= '/info' component={Info}/>
          <Route path= '/login' component={Login}/>
          <Route component={Main}/>
        </Switch>
      </Router>
    </Provider>
  ),
document.getElementById('root'))