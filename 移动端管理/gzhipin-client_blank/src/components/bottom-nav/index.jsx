import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TabBar } from 'antd-mobile'

class BottomNav extends Component {
  render() {
    const { type } = this.props.user
    return (
      <div>
          <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          tabBarPosition="bottom"
        >
          {
            type === 'dashen'
              ?<TabBar.Item
                title="大神"
                key="大神"
                icon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${require("./images/dashen.png")}) center center /  21px 21px no-repeat` }}
                />
                }
                selectedIcon={<div style={{
                  width: '22px',
                  height: '22px',
                  background: `url(${require("./images/dashen-selected.png")}) center center /  21px 21px no-repeat` }}
                />
                }
              >
              </TabBar.Item>
              : <TabBar.Item
              title="老板"
              key="老板"
              icon={<div style={{
                width: '22px',
                height: '22px',
                background: `url(${require("./images/dashen.png")}) center center /  21px 21px no-repeat` }}
              />
              }
              selectedIcon={<div style={{
                width: '22px',
                height: '22px',
                background: `url(${require("./images/dashen-selected.png")}) center center /  21px 21px no-repeat` }}
              />
              }
            >
            </TabBar.Item>
          }
          <TabBar.Item
            title="消息"
            key="消息"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: `url(${require("./images/message.png")}) center center /  21px 21px no-repeat`}}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: `url(${require("./images/message-selected.png")}) center center /  21px 21px no-repeat` }}
            />
            }
            badge={1}
            data-seed="logId"
          >
          </TabBar.Item>
          <TabBar.Item
            title="个人"
            key="Life"
            icon={<div style={{
              width: '22px',
              height: '22px',
              background: `url(${require("./images/personal.png")}) center center /  21px 21px no-repeat` }}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: `url(${require("./images/personal-selected.png")}) center center /  21px 21px no-repeat` }}
            />
            }
            data-seed="logId"
          >
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}
export default connect(
  state=> ({user: state.user})
)(BottomNav);