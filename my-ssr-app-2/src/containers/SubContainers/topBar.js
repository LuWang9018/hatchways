import React from 'react';

import { TopBar } from '@shopify/polaris';
import { connect } from 'react-redux';
export class MyTopBar extends React.Component {
  render() {
    return <TopBar />;
  }
}

export default connect()(MyTopBar);
