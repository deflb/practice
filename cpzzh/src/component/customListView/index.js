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
        style: PropTypes.object,
        className: PropTypes.string,
        sectionBodyClassName: PropTypes.string,
        loading: PropTypes.bool,
        data: PropTypes.array,
        renderRow: PropTypes.func,
        refreshing: PropTypes.bool, // 下拉状态
        onRefresh: PropTypes.func, // 下拉刷新后触发的方法
        onEndReached: PropTypes.func,
        onEndReachedThreshold: PropTypes.number, // 滚动条距离页面底部多少 加载更多 触发 onEndReached
        getListViewInstance: PropTypes.func, // 获取ListView实例
    }
    static defaultProps = {
        style: null,
        className: '',
        sectionBodyClassName: styles.sectionBody,
        loading: false,
        data: [],
        renderRow: () => { },
        refreshing: false,
        onRefresh: null,
        onEndReached: () => { },
        onEndReachedThreshold: 1000,
        getListViewInstance: () => { }
    }
    render() {
        let param = {},
            { dataSource } = this.state,
            { style, className, sectionBodyClassName, data, loading, renderRow, onEndReached, refreshing, onRefresh, onEndReachedThreshold, getListViewInstance } = this.props;
        if (onRefresh) param.pullToRefresh = <PullToRefresh refreshing={refreshing} direction='down' onRefresh={onRefresh} />;
        return (<ListView
            ref={getListViewInstance}
            style={style}
            className={className}
            sectionBodyClassName={sectionBodyClassName}
            dataSource={dataSource.cloneWithRows(data)}
            renderFooter={() => loading ? '加载中...' : data.length ? '我是有底线的' : '暂无结果'}
            renderRow={renderRow}
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            {...param}
        />)
    }
}