import React, { Component } from 'react';
import { Route } from 'react-router';
import { Button, List } from 'antd-mobile';
import asyncC from '../../../component/asyncC';
import CustomListView from '../../../component/customListView';
import Overview from './component/overview';
import routerBase from '../../../router/routerBase';
import styles from './index.less';
const Detail = asyncC(() => import('./detail'));

export default class myBusinessReport extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false
    }
    componentDidMount() {
        let mock = [
            { id: '0' },
            { id: '1' },
            { id: '2' },
        ];
        this.setState({ dataBlobs: mock })
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
        // this.getList()
    }
    onRefresh = () => {

    }
    render() {
        let { dataBlobs, loading, refreshing } = this.state,
            { match, history } = this.props;
        return (<div className={styles.wrapper}>
            <Overview
                source={[
                    { number: 1200, unit: '元', des: '累计奖励' },
                    { number: 3650, unit: '元', des: '累计提成' },
                    { number: 12000, des: '累计积分' },
                ]}
            />
            <div className={styles.report_btn}>
                <Button type='primary' onClick={() => {
                    history.push(routerBase + '/reportBusiness')
                }}>报备商机</Button>
            </div>
            <ul className={styles.report_record_title}>
                <li>报备记录</li>
                <li>共16条</li>
            </ul>
            <CustomListView
                className={styles.report_record_list}
                sectionBodyClassName={null}
                loading={loading}
                data={dataBlobs}
                onEndReached={this.onEndReached}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                renderRow={(rowData, sectionID, index) => (<div key={rowData.id} className={styles.report_record_list_item}>
                    <div className={styles.report_record_list_item_header}>
                        <i className='iconfont icon-user' />
                        <div className={styles.report_record_list_item_header_info}>小明 186*****233</div>
                        <span>待确认</span>
                    </div>
                    <List.Item
                        className={styles.report_record_list_item_content}
                        arrow='horizontal'
                        onClick={this.goToDetail.bind(this, rowData)}
                    >
                        <ul className={styles.report_record_list_item_content_box}>
                            <li className={styles.report_record_list_item_content_box_money}>104元</li>
                            <li className={styles.report_record_list_item_content_box_date}>报备日期：2018/08/28 10:02</li>
                        </ul>
                    </List.Item>
                    <div className={styles.report_record_list_item_footer}>
                        您已获得：
                            <div className={styles.report_record_list_item_footer_text}>
                            商机奖励130元、成交提成300元、5000积分
                            </div>
                    </div>
                </div>)}
            />
            <Route path={match.path + '/detail'} component={Detail} />
        </div>)
    }
}