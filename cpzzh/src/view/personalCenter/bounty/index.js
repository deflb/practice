import React, { Component } from 'react';
import CustomModal from '../../../component/customModal';
import CustomListView from '../../../component/customListView';
import styles from './index.less';

export default class bounty extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
    }
    componentDidMount() {
        let mock = [
            { id: '0' },
            { id: '1' },
        ];
        this.setState({
            dataBlobs: mock
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
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        let { dataBlobs, loading, refreshing } = this.state;
        return (<div className={styles.wrapper}>
            <div className={styles.overview}>
                <ul className={styles.overview_info}>
                    <li className={styles.overview_info_top}>奖励金：<span className={styles.overview_info_top_money}>1300</span>元</li>
                    <li className={styles.overview_info_bottom}>累计：1600元     已提现：300元</li>
                </ul>
                <span className={styles.overview_btn} role='button' onClick={() => {
                    CustomModal.withdraw((v) => {
                        console.log(v)
                    })
                }}>提现</span>
            </div>
            <CustomListView
                className={styles.list}
                sectionBodyClassName={null}
                loading={loading}
                data={dataBlobs}
                onEndReached={this.onEndReached}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                renderRow={(rowData, sectionID, index) => (<div className={styles.list_item}>
                    <ul className={styles.list_item_top}>
                        <li>+100元</li>
                        <li>2018/10/03 08:46</li>
                    </ul>
                    <div className={styles.list_item_bottom}>商机奖励（商机报备）</div>
                </div>)}
            />
        </div>)
    }
}