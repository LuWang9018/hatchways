import React, { Component } from 'react';
import {
    Card,
    ResourceList,
    ResourceItem,
    DisplayText,
    Heading,
    TextContainer,
} from '@shopify/polaris';
import { connect } from 'react-redux';
import { WorkerInfo } from './workerInfo';
import moment from 'moment';

export class WorkList extends Component {
    state = {
        sortValue: 'DATE_MODIFIED_DESC',
        works: this.props.works,
        wokers: this.props.wokers,
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ works: this.props.works });
        }
    }

    handleSortChange = sortValue => {
        this.setState({ sortValue });

        let tmpworks = this.state.works;
        if (sortValue === 'DATE_MODIFIED_DESC') {
            tmpworks.sort((a, b) => (a.deadline > b.deadline ? 1 : -1));
        } else {
            tmpworks.sort((a, b) => (a.deadline <= b.deadline ? 1 : -1));
        }
        this.setState({ works: tmpworks });
    };

    render() {
        const { works } = this.props;
        if (!works) return null;
        return (
            <div style={{ maxWidth: '800px' }}>
                <Card sectioned>
                    <ResourceList
                        resourceName={{
                            singular: 'work',
                            plural: 'works',
                        }}
                        items={works}
                        sortValue={this.state.sortValue}
                        sortOptions={[
                            {
                                label: 'Earliest first',
                                value: 'DATE_MODIFIED_DESC',
                            },
                            {
                                label: 'Latest first',
                                value: 'DATE_MODIFIED_ASC',
                            },
                        ]}
                        onSortChange={selected => {
                            this.setState({ sortValue: selected });
                            this.handleSortChange(selected);
                        }}
                        renderItem={item => {
                            const {
                                id,
                                name,
                                description,
                                deadline,
                                workerId,
                            } = item;

                            return (
                                <ResourceItem
                                    id={id}
                                    accessibilityLabel={`View details for ${name}`}
                                >
                                    <TextContainer spacing="tight">
                                        <DisplayText
                                            variation="strong"
                                            element="h4"
                                        >
                                            {name}
                                        </DisplayText>
                                        <Heading>Id:</Heading>
                                        <p style={{ maxWidth: '500px' }}>
                                            {id}
                                        </p>
                                        <Heading>Description:</Heading>
                                        <p style={{ maxWidth: '500px' }}>
                                            {description}
                                        </p>
                                    </TextContainer>
                                    {
                                        <WorkerInfo
                                            woker={
                                                this.state.wokers.find(
                                                    element =>
                                                        element.worker.id ===
                                                        workerId
                                                ).worker
                                            }
                                        />
                                    }
                                    <div
                                        id="itemDeadline"
                                        style={{ float: 'right' }}
                                    >
                                        {moment(deadline).format(
                                            'dddd, MMMM Do YYYY, h:mm:ss a'
                                        )}
                                    </div>
                                </ResourceItem>
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
        works: state.works,
        wokers: state.workers,
    }),
    {}
)(WorkList);
