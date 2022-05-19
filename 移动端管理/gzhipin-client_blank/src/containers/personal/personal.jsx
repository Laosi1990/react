import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * 个人信息路由
 */
class Personal extends Component {
  render() {
    return (
      <div>
        Personal
      </div>
    );
  }
}

export default connect()(Personal);