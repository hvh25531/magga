import React, { Component } from 'react'

export default class Tabs extends Component {
  state = {
    activeBarPosition: 0
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTab !== this.props.currentTab) {
      const pos = document.getElementsByClassName('ant-tabs-tab-active')[0].offsetLeft
      this.setState({ activeBarPosition: pos })
    }
  }
  render() {
    const { activeBarPosition } = this.state
    const { tabs, currentTab, onTabChange } = this.props
    return (
      <div className="ant-tabs-bar">
        <div className="ant-tabs-nav-container">
          <div className="ant-tabs-nav-wrap">
            <div className="ant-tabs-nav-scroll">
              <div className="ant-tabs-nav ant-tabs-nav-animated">
                <div
                  className="ant-tabs-ink-bar ant-tabs-ink-bar-animated"
                  style={{
                    transform: `translate3d(${activeBarPosition}px, 0px, 0px)`,
                    width: 79,
                    display: 'block'
                  }} />
                {tabs.map(tab => (
                  <div
                    key={tab.key}
                    className={`ant-tabs-tab${tab.key === currentTab ? ' ant-tabs-tab-active' : ''}`}
                    onClick={() => onTabChange(tab.key)}
                  >
                    {tab.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
