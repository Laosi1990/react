import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import ProductDetail from "./detail";
import ProductHome from "./index";
import ProductAddUpdate from "./add-update";

/**
 * 商品路由
 */
export default class Products extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/products' component={ProductHome} ></Route>
          <Route path='/products/detail' component={ProductDetail} ></Route>
          <Route path='/products/addupdate' component={ProductAddUpdate} ></Route>
          <Redirect to='/products'/>
        </Switch>
      </Router>
    );
  }
}
