import React, { Component } from 'react';
import Coupon from './coupon';
import CustomListView from '../../../component/customListView';
import fullScreen from '../../../component/fullScreen';

export default fullScreen(class getCoupon extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
    }
    onRefresh = () => {

    }

    onEndReachedonEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        // this.getList()
    }
    render() {
        const { dataBlobs, loading, refreshing } = this.state;
        return (<CustomListView
            style={{ heigh: '100%' }}
            loading={loading}
            data={dataBlobs}
            onEndReached={this.onEndReached}
            refreshing={refreshing}
            onRefresh={this.onRefresh}
            renderRow={(rowData, sectionID, index) => (<Coupon rowData={rowData} />)}
        />)
    }
})