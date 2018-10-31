import React, { Component } from 'react';
import { Card } from 'antd-mobile';
import normalFullScreen from '../../../component/normalFullScreen';

export default normalFullScreen(class messageDetail extends Component {
    render() {
        const { location } = this.props,
            { state } = location;
        return (
            <Card full>
                <Card.Header
                    title={<div>{state.msgTitle}</div>}
                />
                <Card.Body>
                    <pre style={{ overflowX: 'auto' }}>{state.msgContent}</pre>
                </Card.Body>
            </Card>
        )
    }
})