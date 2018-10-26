import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tabs, ListView, PullToRefresh } from 'antd-mobile';
import { Route } from 'react-router';
import asyncC from '../../component/asyncC';
import NoResult from '../../component/noResult';
import SearchBar from './common/searchBar';
import Filter from './common/filter';
import { request } from '../../request';
import api from '../../request/api';
import { imgAddress } from '../../request/baseURL';
import styles from './mountings.less';
const Detail = asyncC(() => import('./mountingsComponent/detail'));

export default class mountings extends Component {

    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
        height: 0,
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
            state: rowData
        })
    }

    getBrandList = () => {
        request({ url: api.brandList }).then(res => {
            this.setState({ brandList: res })
        }).catch(err => { console.log(err) })
    }

    getMountingsClassify = () => {
        request({ url: api.partSortList, data: { pid: 0 } }).then(res => {
            this.setState({ classifyList: res })
        }).catch(err => { console.log(err) })
    }

    getMountingsList = ({ pageNo = this.state.pageNo, keyword = this.state.keyword, dataBlobs = this.state.dataBlobs } = {}) => {
        const { pageSize, pid, brandname, dataSource } = this.state;
        this.setState({ isLoading: true, keyword })
        request({ url: api.partDetailList, data: { pageNo, pageSize, status: 1, pid, brandname, keyword } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows(_dataBlobs),
                isLoading: false,
            })
            pageNo === 1 && this.lv.scrollTo(0, 0)
        }).catch(err => { console.log(err); this.setState({ isLoading: false }) })
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
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
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getMountingsList()
    }

    onRefresh = ({ ...props }) => { console.log(props) }

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
            dataSource,
            height,
        } = this.state,
            { match } = this.props;
        return (
            <div>
                <SearchBar
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
                <div className='bg_grey_list_view'>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={dataSource}
                        renderHeader={() => dataBlobs.length ? null : <NoResult />}
                        renderRow={(rowData, sectionID, rowID) => <div onClick={this.goToDetail.bind(this, rowData)} key={rowID} style={{ marginRight: rowID % 2 === 0 ? '2%' : null }} className={styles.list_row_wrapper}>
                            <div className='xBottom1px'>
                                <img src={imgAddress + rowData.surfacePlotUrl} alt={rowData.name} />
                            </div>
                            <div>{rowData.name}</div>
                        </div>}
                        style={{
                            height
                        }}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={60}
                        pullToRefresh={<PullToRefresh
                            direction='down'
                            distanceToRefresh={40}
                            onRefresh={this.onRefresh}
                        />}
                    />
                </div>
                <Route path={match.path + '/mountings'} component={Detail} />
            </div>
        );
    }
}