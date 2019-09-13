import React, { Component } from 'react';
import { ResourceItem, DisplayText, Avatar } from '@shopify/polaris';

export class WorkerInfo extends Component {
    state = {
        worker: this.props.worker,
    };

    render() {
        if (!this.props.woker) return null;
        const { id, name, email, companyName, image } = this.props.woker;
        return (
            <ResourceItem
                id={id}
                media={
                    <Avatar customer size="large" name={name} source={image} />
                }
            >
                <div style={{ maxWidth: '600px' }}>
                    <div spacing="tight">
                        <DisplayText variation="strong" element="h4">
                            {name}
                        </DisplayText>
                        <div>{companyName}</div>
                        <div>{email}</div>
                    </div>
                </div>
            </ResourceItem>
        );
    }
}
