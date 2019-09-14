import React, { Component } from 'react';
import {
    Card,
    ResourceList,
    ResourceItem,
    DisplayText,
    Heading,
    TextContainer,
    TextField,
    Filters,
    Button,
} from '@shopify/polaris';
import { connect } from 'react-redux';
import { WorkerInfo } from './workerInfo';
import moment from 'moment';

export class WorkList extends Component {
    state = {
        queryValue: null,
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

    handleChange = key => async value => {
        await this.setState({ queryValue: value });
    };

    applyFilter(works) {
        const name = this.state.queryValue;

        if (!name || name === '') return works;
        const result = [];
        for (let i = 0; i < works.length; i++) {
            let tmpId = works[i].workerId;

            const woker = this.props.wokers.find(function(element) {
                return (
                    element.worker.id === tmpId &&
                    element.worker.name.includes(name)
                );
            });
            if (woker) result.push(works[i]);
        }
        return result;
    }

    render() {
        const { works } = this.props;
        const { queryValue } = this.state;
        if (!works) return null;

        const filters = [];
        const worksAfter = this.applyFilter(works);
        const appliedFilters = [];
        const filterControl = (
            <Filters
                queryValue={queryValue}
                filters={filters}
                appliedFilters={appliedFilters}
                onQueryChange={this.handleChange('queryValue')}
                onQueryClear={this.handleQueryClear}
                onClearAll={this.handleClearAll}
            ></Filters>
        );

        return (
            <div style={{ maxWidth: '800px' }}>
                <Card sectioned>
                    <ResourceList
                        resourceName={{
                            singular: 'work',
                            plural: 'works',
                        }}
                        items={worksAfter}
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
                        filterControl={filterControl}
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
                                    <TextContainer spacing='tight'>
                                        <DisplayText
                                            variation='strong'
                                            element='h4'
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
                                        id='itemDeadline'
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
