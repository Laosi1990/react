import React from 'react'
import { Link } from 'react-router-dom'
import LeftNavMenu from './left-nav-menu'
import logo  from "../../assets/images/logo.png"
import './index.less'
/**
 * 导航菜单布局
 * @returns
 */
function LeftNav() {
    return (
      <div className='left-nav'>
        <Link to='/'>
          <div className='left-nav-logo'>
              <img src={logo} alt="" />
              <div>后台管理</div>
          </div>
        </Link>
        <div className='left-nav-menu'>
         <LeftNavMenu />
        </div>
      </div>
    )
}
export default LeftNav