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

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}
function disambiguateLabel(key, value) {
    switch (key) {
        case 'taggedWith':
            return `Tagged with ${value}`;
        default:
            return value;
    }
}

export class WorkList extends Component {
    state = {
        taggedWith: 'VIP',
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

    render() {
        const { works } = this.props;
        const { taggedWith, queryValue } = this.state;
        if (!works) return null;

        const filters = [
            {
                key: 'taggedWith',
                label: 'Tagged with',
                filter: (
                    <TextField
                        label="Tagged with"
                        value={taggedWith}
                        onChange={this.handleChange('taggedWith')}
                        labelHidden
                    />
                ),
                shortcut: true,
            },
        ];

        const appliedFilters = Object.keys(this.state)
            .filter(key => !isEmpty(this.state[key]) && key === 'taggedWith')
            .map(key => {
                return {
                    key,
                    label: disambiguateLabel(key, this.state[key]),
                    onRemove: this.handleRemove,
                };
            });

        const filterControl = (
            <Filters
                queryValue={queryValue}
                filters={filters}
                appliedFilters={appliedFilters}
                onQueryChange={this.handleChange('queryValue')}
                onQueryClear={this.handleQueryClear}
                onClearAll={this.handleClearAll}
            >
                <div style={{ paddingLeft: '8px' }}>
                    <Button onClick={() => console.log('New filter saved')}>
                        Save
                    </Button>
                </div>
            </Filters>
        );

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
