import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import { Route } from 'react-router';
import asyncC from '../../component/asyncC';
import CustomListView from '../../component/customListView';
import CustomSearchBar from '../../component/customSearchBar';
import Filter from './common/filter';
import { request } from '../../request';
import api from '../../request/api';
import whichImgLink from '../../utlis/whichImgLink';
import styles from './mountings.less';
const Detail = asyncC(() => import('./mountingsComponent/detail'));

export default class mountings extends Component {

    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
        pid: '',
        brandname: '',
        keyword: '',

        // 品牌列表
        brandList: [],
        // 配件分类列表
        classifyList: [],
    }

    goToDetail = rowData => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/mountings',
            state: {id: rowData.id}
        })
    }

    getBrandList = () => {
        request({ url: api.brandList }).then(res => {
            this.setState({ brandList: res })
        }).catch(err => { })
    }

    getMountingsClassify = () => {
        request({ url: api.partSortList, data: { pid: 0 } }).then(res => {
            this.setState({ classifyList: res })
        }).catch(err => { })
    }

    getMountingsList = ({ pageNo = this.state.pageNo, keyword = this.state.keyword, dataBlobs = this.state.dataBlobs } = {}) => {
        const { pageSize, pid, brandname } = this.state;
        this.setState({ loading: true, keyword })
        request({ url: api.partDetailList, data: { pageNo, pageSize, status: 1, pid, brandname, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
                refreshing: false,
            });
            pageNo === 1 && this.listView.scrollTo(0, 0);
        }).catch(err => {
            this.setState({ loading: false, refreshing: false });
        })
    }

    componentDidMount() {
        this.getBrandList()
        this.getMountingsClassify()
        this.getMountingsList()
    }

    renderContent = ({ ...props }) => {
        const { brandList, brandname, pid } = this.state,
            { children, name } = props;
        return <ul className={styles.tabs_content}>
            {name === '品牌' ? brandList.map(item => <li
                className={brandname === item.brandname ? styles.active : null}
                key={item.id}
                onClick={e => { this.setState({ brandname: brandname === item.brandname ? '' : item.brandname }) }}
            >{item.brandname}</li>) : children.map(item => <li
                className={pid === item.id ? styles.active : null}
                key={item.id}
                onClick={e => { this.setState({ pid: pid === item.id ? '' : item.id }) }}
            >{item.name}</li>)}
        </ul>
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getMountingsList()
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getMountingsList({ pageNo: 1, dataBlobs: [] })
    }

    onSearch = keyword => {
        if (keyword !== this.state.keyword)
            this.getMountingsList({ pageNo: 1, keyword, dataBlobs: [] })
    }

    onOk = () => {
        this.getMountingsList({ pageNo: 1, dataBlobs: [] })
    }

    render() {
        const {
            classifyList,
            dataBlobs,
            loading,
            refreshing
        } = this.state,
            { match } = this.props;
        return (
            <div className={styles.wrapper}>
                <CustomSearchBar
                    placeholder='请输入配件名称'
                    extra={<Filter
                        onRest={() => {
                            this.setState({
                                pid: '',
                                brandname: ''
                            })
                        }}
                        onOk={this.onOk}
                    >
                        <Tabs
                            tabs={[
                                { name: '品牌' },
                                ...classifyList
                            ]}
                            tabBarActiveTextColor='#DA4943'
                            tabBarUnderlineStyle={{ borderColor: '#FF0000' }}
                            renderTabBar={props => <Tabs.DefaultTabBar renderTab={row => row.name} {...props} page={3} />}
                        >
                            {this.renderContent}
                        </Tabs>
                    </Filter>}
                    onSearch={this.onSearch}
                />
                <CustomListView
                    style={{ flex: 1 }}
                    getListViewInstance={instance => this.listView = instance}
                    sectionBodyClassName={styles.list_wrapper}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, index) => (<div onClick={this.goToDetail.bind(this, rowData)} key={index} style={{ marginRight: index % 2 === 0 ? '2%' : null }} className={styles.list_row_wrapper}>
                        <div>
                            {rowData.surfacePlotUrl ? <img src={whichImgLink(rowData.surfacePlotUrl)} alt={rowData.name} /> : null}
                        </div>
                        <div>{rowData.name}</div>
                    </div>)}
                />
                <Route path={match.path + '/mountings'} component={Detail} />
            </div>
        );
    }
}