import React, { Component } from 'react';
import { Route } from 'react-router';
import { Button, List } from 'antd-mobile';
import asyncC from '../../../component/asyncC';
import CustomListView from '../../../component/customListView';
import Overview from './component/overview';
import routerBase from '../../../router/routerBase';
import styles from './index.less';
import { request } from '../../../request';
import api from '../../../request/api';
import { formatDate } from '../../../utlis';
const Detail = asyncC(() => import('./detail'));

export default class myBusinessReport extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
        businessReward: {},
    }
    getMyBusinessReward = () => {
        request({ url: api.myBusinessReward }).then(res => {
            this.setState({ businessReward: res })
        })
    }
    getMyBusiness = ({
        pageNo = this.state.pageNo,
        dataBlobs = this.state.dataBlobs,
    } = {}) => {
        const { pageSize } = this.state;
        this.setState({ loading: true })
        request({ url: api.myBusiness, data: { pageNo, pageSize } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                dataBlobs: _dataBlobs,
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                loading: false,
                refreshing: false
            })
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }
    componentDidMount() {
        this.getMyBusiness();
        this.getMyBusinessReward();
    }
    goToDetail = item => {
        let { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state: item
        })
    }
    onEndReached = (event) => {
        let { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getMyBusiness()
    }
    onRefresh = () => {
        this.setState({ refreshing: true })
        this.getMyBusiness({ pageNo: 1, dataBlobs: [] })
    }
    render() {
        let { dataBlobs, loading, refreshing, businessReward } = this.state,
            { match, history } = this.props;
        return (<div className={styles.wrapper}>
            <Overview
                source={[
                    { number: businessReward.reward || 0, unit: '元', des: '累计奖励' },
                    { number: businessReward.bonus || 0, unit: '元', des: '累计提成' },
                    { number: businessReward.score || 0, des: '累计积分' },
                ]}
            />
            <div className={styles.report_btn}>
                <Button type='primary' onClick={() => {
                    history.push(routerBase + '/reportBusiness')
                }}>报备商机</Button>
            </div>
            <ul className={styles.report_record_title}>
                <li>报备记录</li>
                <li>共{dataBlobs.length}条</li>
            </ul>
            <CustomListView
                className={styles.report_record_list}
                sectionBodyClassName={null}
                loading={loading}
                data={dataBlobs}
                onEndReached={this.onEndReached}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                renderRow={(rowData, sectionID, index) => (<div key={rowData.businessId} className={styles.report_record_list_item}>
                    <div className={styles.report_record_list_item_header}>
                        <i className='iconfont icon-user' />
                        <div className={styles.report_record_list_item_header_info}>{rowData.customerName} {rowData.customerPhone}</div>
                        <span>{rowData.statusStr}</span>
                    </div>
                    <List.Item
                        className={styles.report_record_list_item_content}
                        arrow='horizontal'
                        onClick={this.goToDetail.bind(this, { businessId: rowData.businessId, customerName: rowData.customerName })}
                    >
                        <ul className={styles.report_record_list_item_content_box}>
                            <li className={styles.report_record_list_item_content_box_money}>{rowData.reward}元</li>
                            <li className={styles.report_record_list_item_content_box_date}>报备日期：{formatDate(rowData.reportTime, 'YYYY/MM/DD hh:mm')}</li>
                        </ul>
                    </List.Item>
                    {rowData.statusStr === '有效' ? <div className={styles.report_record_list_item_footer}>
                        您已获得：
                            <div className={styles.report_record_list_item_footer_text}>
                            商机奖励{rowData.gainReward}元、成交提成{rowData.gainBonus}元、{rowData.gainScore}积分
                            </div>
                    </div> : null}
                </div>)}
            />
            <Route path={match.path + '/detail'} component={Detail} />
        </div>)
    }
}