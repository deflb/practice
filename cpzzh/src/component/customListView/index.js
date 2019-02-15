import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, PullToRefresh } from 'antd-mobile';
import styles from './index.less';

export default class customListView extends Component {
    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        })
    }
    static propTypes = {
        loading: PropTypes.bool,
        data: PropTypes.array,
        refreshing: PropTypes.bool, // 下拉状态
        onRefresh: PropTypes.func, // 下拉刷新后触发的方法
        getListViewInstance: PropTypes.func, // 获取ListView实例
        noFooterInfo: PropTypes.bool,
    }
    static defaultProps = {
        loading: false,
        data: [],
        refreshing: false,
        onRefresh: null,
        getListViewInstance: () => { },
        noFooterInfo: false,
    }
    render() {
        let param = { ...this.props },
            { dataSource } = this.state,
            { data, loading, refreshing, onRefresh, getListViewInstance, noFooterInfo } = this.props;
        if (onRefresh) param.pullToRefresh = <PullToRefresh refreshing={refreshing} direction='down' onRefresh={onRefresh} />;
        return (<ListView
            ref={getListViewInstance}
            renderFooter={() => loading ? '加载中...' : data.length ? '我是有底线的' : noFooterInfo ? null : '暂无结果'}
            sectionBodyClassName={styles.sectionBody}
            {...param}
            dataSource={dataSource.cloneWithRows(data)}
        />)
    }
}