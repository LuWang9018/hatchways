//aap is using Shopify UI framework
//https://polaris.shopify.com/components/navigation/navigation/sections/items

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from 'containers/Home';

export default class App extends Component {
  render() {
    //console.log('router render');
    return (
      <div>
        <Switch>
          <Route exact path="*" component={Home} />
        </Switch>
      </div>
    );
  }
}
