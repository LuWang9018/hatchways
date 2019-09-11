import React from 'react';
import {
  Card,
  FormLayout,
  TextField,
  AppProvider,
  SkeletonBodyText,
  Layout,
  TextContainer,
  SkeletonDisplayText,
  Frame,
  Loading,
  Page,
  SkeletonPage,
} from '@shopify/polaris';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MyTopBar } from '../SubContainers/topBar';
import { WorkList } from './workList';
import { theme } from '../../utils/globals';

class Home extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object,
  };

  constructor(props, context) {
    super(props);

    this.store = context.store;

    this.state = {
      showToast: false,
      isLoading: false,
      searchActive: false,
      userMenuOpen: false,
      showMobileNavigation: false,
      modalActive: false,
    };
  }

  componentDidUpdate(prevProps) {
    //if no user info
    if (this.props !== prevProps && this.store) {
      //console.log('Home update');
      const userInfo = this.store.getState().users.user;
      //console.log(userInfo);
      this.setState({
        userInfo: userInfo,
      });
    }
  }

  render() {
    //console.log('store', this.context.store.getState());
    const { isLoading } = this.state;

    const topBarMarkup = <MyTopBar logout={this.props.logout} />;

    const loadingMarkup = isLoading ? <Loading /> : null;

    const actualPageMarkup = (
      <Page title="Works">
        <WorkList></WorkList>
      </Page>
    );

    const loadingPageMarkup = (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={9} />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );

    const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

    return (
      <div style={{ height: '500px' }}>
        <AppProvider theme={theme}>
          <Frame topBar={topBarMarkup}>
            {loadingMarkup}
            {pageMarkup}
          </Frame>
        </AppProvider>
      </div>
    );
  }

  toggleState = key => {
    return () => {
      this.setState(prevState => ({ [key]: !prevState[key] }));
    };
  };
}

export default connect(
  state => ({}),
  {}
)(Home);
