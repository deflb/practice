import React, { Component } from 'react';
import CustomListView from '../../../../component/customListView';
import Item from './item';

export default class get extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
    }
    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        // this.getIntegralUseList()
    }
    render() {
        let { dataBlobs, loading } = this.state;
        return (<CustomListView
            style={{ height: '100%' }}
            sectionBodyClassName={null}
            loading={loading}
            data={dataBlobs}
            onEndReached={this.onEndReached}
            renderRow={(rowData, sectionID, index) => (<Item key={rowData.id} rowData={rowData} />)}
        />);
    }
}