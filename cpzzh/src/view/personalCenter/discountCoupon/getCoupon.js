import React, { Component } from 'react';
import { ListView } from 'antd-mobile';
import Coupon from './coupon';
import fullScreen from '../../../component/fullScreen';

export default fullScreen(class getCoupon extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
    }
    render() {
        const { dataSource, dataBlobs, isLoading } = this.state;
        return (<div className='bg_grey_list_view' style={{ height: '100%' }}>
            <ListView
                ref={el => this.lv = el}
                dataSource={dataSource}
                renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                renderRow={(rowData, sectionID, index) => <Coupon rowData={rowData} />}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={80}
            />
        </div>)
    }
})