import React, { Component } from 'react'
import TopNavigation from '../partials/TopNavigation'

const withWrapper = (InputComponent) => {
  return class extends Component {
    render() {
      return (
        <div>
          <TopNavigation {...this.props} />
          <main id="main-wrapper">
            <InputComponent {...this.props} />
          </main>
        </div>
      );
    }
  };
}

export default withWrapper;
