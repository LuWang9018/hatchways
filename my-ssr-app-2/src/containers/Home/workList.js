import React, { Component } from 'react';
import {
  Button,
  Card,
  ResourceList,
  TextStyle,
  List,
  Caption,
} from '@shopify/polaris';
import { connect } from 'react-redux';
import { loadWorks, loadWorkers } from '../../redux/actions';

export class WorkList extends Component {
  async componentDidMount(props) {
    if (!this.state || !this.state.works) {
      this.props.loadWorks({});
      this.props.loadWorkers({});
    }
  }
  render() {
    const { works } = this.props;
    if (!works) return null;
    return (
      <div style={{ maxWidth: '800px' }}>
        <Card sectioned>
          <ResourceList
            resourceName={{ singular: 'customer', plural: 'customers' }}
            items={works}
            renderItem={item => {
              const { id, name, price, category } = item;
              //const { description } = item;
              const works = Object.assign({}, item);
              return (
                <ResourceList.Item
                  id={id}
                  accessibilityLabel={`View details for ${name}`}
                  onClick={() => this.props.changeEditState(true, works)}
                >
                  <div id="itemListInfo"></div>
                </ResourceList.Item>
              );
            }}
          />
        </Card>
      </div>
    );
  }
}

export default connect(
  state => ({
    works: state.works.works,
  }),
  { loadWorks, loadWorkers }
)(WorkList);
