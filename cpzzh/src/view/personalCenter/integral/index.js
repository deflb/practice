import React, { Component } from 'react';
import { Route } from 'react-router';
import integral_png from '../../../assets/image/integral.png';
import record_png from '../../../assets/image/record.png';
import question_png from '../../../assets/image/question.png';
import macBook_png from '../../../assets/image/macBook.png';
import asyncC from '../../../component/asyncC';
import CustomListView from '../../../component/customListView';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import Title from './title';
import styles from './index.less';
const IntegralDetail = asyncC(() => import('./integralDetail/index'));
const ExchangeRecord = asyncC(() => import('./exchangeRecord/index'));
const ProductDetail = asyncC(() => import('./productDetail/index'));

export default class integralIndex extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false
    }
    componentDidMount() {
        this.getProductList();
    }
    getProductList = () => {
        let mockData = [
            { id: 0, },
            { id: 1, },
            { id: 2, },
        ];
        this.setState({
            dataBlobs: mockData
        })
    }
    goToIntegralDetail = () => { // 进入积分明细
        let { history, match, location } = this.props,
            { state } = location;
        history.push({
            pathname: match.path + '/integralDetail',
            state: { score: state.score }
        })
    }
    goToExchangeRecord = () => { // 进入兑换记录
        let { history, match, location } = this.props,
            { state } = location;
        history.push({
            pathname: match.path + '/exchangeRecord',
            state: { score: state.score }
        })
    }
    goToExchange = () => { // 去兑换
        let { history, match, location } = this.props,
            { state } = location;
        history.push({
            pathname: match.path + '/productDetail',
            state: { score: state.score }
        })
    }
    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        // this.getProductList()
    }
    onRefresh = () => { }
    render() {
        let { dataBlobs, loading, refreshing } = this.state,
            { location, match } = this.props,
            { state = {} } = location;
        return (<div className={styles.wrapper}>
            <ul className={styles.wrapper_header}>
                <li onClick={this.goToIntegralDetail}>
                    <img src={integral_png} alt='' />
                    <p>{state.score}积分</p>
                </li>
                <li onClick={this.goToExchangeRecord}>
                    <img src={record_png} alt='' />
                    <p>兑换记录</p>
                </li>
                <li>
                    <img src={question_png} alt='' />
                    <p>积分规则</p>
                </li>
            </ul>
            <CustomWhiteSpace />
            <Title title='积分兑换' />
            <CustomListView
                style={{ flex: 1 }}
                sectionBodyClassName={null}
                loading={loading}
                data={dataBlobs}
                onEndReached={this.onEndReached}
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                renderRow={(rowData, sectionID, index) => (<ul key={rowData.id} className={styles.wrapper_product}>
                    <li className={styles.wrapper_product_title}>Apple MacBook</li>
                    <li className={styles.wrapper_product_des}>超乎想象的薄</li>
                    <li className={styles.wrapper_product_img}><img src={macBook_png} alt='' /></li>
                    <li className={styles.wrapper_product_operate}>
                        <span className={styles.wrapper_product_operate_left}><img src={integral_png} alt='' />3000</span>
                        <span className={styles.wrapper_product_operate_right} onClick={this.goToExchange}>兑换</span>
                    </li>
                </ul>)}
            />
            <Route exact path={match.path + '/integralDetail'} component={IntegralDetail} />
            <Route exact path={match.path + '/exchangeRecord'} component={ExchangeRecord} />
            <Route exact path={match.path + '/productDetail'} component={ProductDetail} />
        </div>);
    }
}