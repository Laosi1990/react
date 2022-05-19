import React , {Component} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Admin from './pages/admin/admin.jsx'
import './App.css';
// 应用根组件
class App extends Component {
  render() {
     return (
      <Router>
        <Switch>{/*职匹配其中一个路由*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </Router>
     )
  }
}
export default App;
