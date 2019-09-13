import React from 'react';
import {
    Card,
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
import { connect } from 'react-redux';
import { MyTopBar } from '../SubContainers/topBar';
import WorkList from './workList';
import { theme } from '../../utils/globals';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps && this.store) {
            //console.log('Home update');
            const userInfo = this.store.getState().users.user;
            console.log('componentDidUpdate', this.props);
            this.setState({
                userInfo: userInfo,
                isLoading: false,
            });
        }
    }

    topBarMarkup = () => {
        return <MyTopBar logout={this.props.logout} />;
    };

    loadingMarkup = () => {
        const { isLoading } = this.state;
        return isLoading ? <Loading /> : null;
    };

    loadingPageMarkup = () => {
        return (
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
    };

    pageMarkup = () => {
        const { isLoading } = this.state;
        if (isLoading) {
            return (
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
        }
        return (
            <Page title="Works">
                <WorkList />
            </Page>
        );
    };

    render() {
        //console.log('store', this.context.store.getState());

        return (
            <div style={{ height: '500px' }}>
                <AppProvider theme={theme}>
                    <Frame topBar={this.topBarMarkup()}>
                        {this.loadingMarkup()}
                        {this.pageMarkup()}
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
