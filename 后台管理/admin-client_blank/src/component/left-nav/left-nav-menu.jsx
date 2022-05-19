import React, { Component } from 'react'
import { Link , withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd';

import menuList from '../../config/menu-config'
import { setHeadTitle } from '../../redux/actions'
import './index.less'
const { SubMenu } = Menu;
/**
 * 导航菜单
 */
 class LeftNavMenu extends Component {
  getMenuNodesBack = menuList => {
   return menuList.map(menu => {
      return !menu.children
      ? (<Menu.Item key={menu.key}>
            <Link to={menu.key}>
              <Icon type={menu.icon}/>
              <span>{menu.title}</span>
            </Link>
          </Menu.Item>)
      : (<SubMenu key={menu.key}
            title={
              <span>
                <Icon type={menu.icon}/>
                <span>{menu.title}</span>
              </span>
            }
          >
            {
              this.getMenuNodes(menu.children)
            }
          </SubMenu>)
    })
  }
  getMenuNodes = menuList => {
    return menuList.map(menu => {
      const {user: {role: {menus}}} = this.props
      if( menus && !menus.includes(menu.key)) return
      if(!menu.children) {
        return (
          <Menu.Item key={menu.key}>
            <Link to={menu.key} onClick={() => {this.props.setHeadTitle(menu.title)}}>
              <Icon type={menu.icon}/>
              <span>{menu.title}</span>
            </Link>
          </Menu.Item>
        )
      }else {
        const {pathname} = this.props.location
        if(menu.children.find(item => item.key === pathname)) this.openKey= menu.key
        return (<SubMenu key={menu.key}
          title={
            <span>
              <Icon type={menu.icon}/>
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            this.getMenuNodes(menu.children)
          }
        </SubMenu>)
      }
    })
  }
  // 第一次render函数执行之前执行一次
  componentWillMount () {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    const { pathname } = this.props.location;
    const openKey = this.openKey;
    return (
      <div style={{ width: '100%' }}>
        {this.openMenu}
        <Menu
          selectedKeys={[pathname]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          { this.menuNodes }
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {setHeadTitle}
)(withRouter(LeftNavMenu))