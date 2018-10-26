import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { ListView, PullToRefresh, Toast } from 'antd-mobile';
import asyncC from '../../component/asyncC';
import NoResult from '../../component/noResult';
import CasePdLook from '../../component/casePdLook';
import SearchBar from './common/searchBar';
import Filter from './common/filter';
import Classify from './caseComponent/classify';
import { request } from '../../request';
import api from '../../request/api';
import { imgAddress } from '../../request/baseURL';
import styles from './case.less';
const Detail = asyncC(() => import('./caseComponent/detail'));

export default class designCase extends Component {
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
        keyword: '', // 关键字
        sceneId: '', // 栏目
        areaIdList: [], // 面积id
        huxingIdList: [], // 户型id
        meritsIdList: [], // 亮点id
        priceIdList: [], // 价位id
        styleIdList: [], // 风格id
        sortColumn: '', // 排序字段(查询字段)

        // 基础数据列表
        caseBaseList: [],
    }
    goToDetail = rowData => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/case',
            state: rowData
        })
    }

    getCaseBaseList = () => { // 基础数据
        request({ url: api.caseBaseList }).then(res => {
            this.setState({ caseBaseList: res })
        }).catch(err => { })
    }

    getCaseList = ({
        pageNo = this.state.pageNo,
        keyword = this.state.keyword,
        dataBlobs = this.state.dataBlobs,
        sortColumn = this.state.sortColumn,
    } = {}) => {
        const { pageSize, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, dataSource } = this.state;
        this.setState({ isLoading: true, keyword, sortColumn })
        request({ url: api.pageCase, data: { pageNo, pageSize, keyword, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, sortColumn } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows([..._dataBlobs]),
                isLoading: false,
            })
            pageNo === 1 && this.lv.scrollTo(0, 0)
        }).catch(err => { this.setState({ isLoading: false }) })
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).getBoundingClientRect().top;
        this.setState({ height: hei })
        this.getCaseBaseList()
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getCaseList()
    }

    onRefresh = ({ ...props }) => { console.log(props) }

    onSearch = keyword => {
        if (keyword !== this.state.keyword)
            this.getCaseList({ pageNo: 1, keyword, dataBlobs: [] })
    }

    onOk = () => {
        this.getCaseList({ pageNo: 1, dataBlobs: [] })
    }

    whichOne = (key, one, two, three, four, five, six) => {
        switch (key) {
            case 'space_material': // 栏目
                one()
                break;
            case 'style_material': // 风格
                two()
                break;
            case 'luminance_material': // 亮点
                three()
                break;
            case 'price_material': // 价位
                four()
                break;
            case 'area_material': // 面积
                five()
                break;
            case 'household_material': // 户型
                six()
                break;
            default:
                break;
        }
    }

    onComment = (rowData) => { // 评价
        this.goToDetail(rowData)
    }
    onLikes = (rowData, index) => { // 点赞
        request({ url: api.saveLikes, data: { id: rowData.id, status: 1 } }).then(res => {
            Toast.success(res, 0.7)
            const { dataBlobs, dataSource } = this.state,
                _dataBlobs = [...dataBlobs],
                currentRow = { ..._dataBlobs[index] };
            currentRow.likes++;
            _dataBlobs.splice(index, 1, currentRow)
            this.setState({
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows(_dataBlobs)
            })
        }).catch(err => { })
    }

    render() {
        const { caseBaseList,
            sceneId,
            styleIdList,
            meritsIdList,
            priceIdList,
            areaIdList,
            huxingIdList,
            dataBlobs,
            dataSource,
            height,
        } = this.state,
            { match } = this.props;
        let current;
        return (
            <div className={styles.wrapper}>
                <SearchBar
                    placeholder='请输入关键字'
                    extra={<Filter
                        onRest={() => {
                            this.setState({
                                sceneId: '',
                                styleIdList: [],
                                meritsIdList: [],
                                priceIdList: [],
                                areaIdList: [],
                                huxingIdList: [],
                            })
                        }}
                        onOk={this.onOk}
                    >
                        <div>
                            {caseBaseList.map(item => {
                                this.whichOne(
                                    item.key,
                                    () => { current = sceneId },
                                    () => { current = styleIdList },
                                    () => { current = meritsIdList },
                                    () => { current = priceIdList },
                                    () => { current = areaIdList },
                                    () => { current = huxingIdList },
                                )
                                return <ul key={item.key} className={styles.filter_wrapper}>
                                    <li className='titleFontSizeC'>{item.name}</li>
                                    <li>
                                        <ul className={`${styles.filter_item_wrapper} normalFontSizeC`}>
                                            {item.data.map(row => {
                                                return <li
                                                    key={row.id}
                                                    onClick={e => {
                                                        const filter = which => which.filter(value => value === row.id).length ? which.filter(value => value !== row.id) : [...which, row.id];
                                                        this.whichOne(
                                                            item.key,
                                                            () => { this.setState({ sceneId: row.id === sceneId ? '' : row.id }) },
                                                            () => { this.setState({ styleIdList: filter(styleIdList) }) },
                                                            () => { this.setState({ meritsIdList: filter(meritsIdList) }) },
                                                            () => { this.setState({ priceIdList: filter(priceIdList) }) },
                                                            () => { this.setState({ areaIdList: filter(areaIdList) }) },
                                                            () => { this.setState({ huxingIdList: filter(huxingIdList) }) },
                                                        )
                                                    }}
                                                    className={(Array.isArray(current) && current.some(val => val === row.id)) || row.id === current ? styles.active : null}
                                                >{row.name || row.range}</li>
                                            })}
                                        </ul>
                                    </li>
                                </ul>
                            })}
                        </div>
                    </Filter>}
                    onSearch={this.onSearch}
                />
                <Classify
                    source={[
                        { title: '最新', val: 'a.create_time' },
                        { title: '人气', val: 'b.intents' },
                        { title: '点赞', val: 'b.likes' },
                        { title: '收藏', val: 'b.collects' },
                    ]}
                    itemClick={val => { this.getCaseList({ pageNo: 1, dataBlobs: [], sortColumn: val }) }}
                />
                <div className='bg_grey_list_view'>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={dataSource}
                        renderHeader={() => dataBlobs.length ? null : <NoResult />}
                        renderRow={(rowData, sectionID, index) => {
                            rowData.des = rowData.styleName;
                            rowData.imgUrl = imgAddress + rowData.surfacePlotUrl;
                            return <CasePdLook
                                style={{ marginBottom: 10 }}
                                rowData={rowData}
                                onClick={this.goToDetail.bind(this, rowData)}
                                commentClick={this.onComment.bind(this, rowData)}
                                likeClick={this.onLikes.bind(this, rowData, index)}
                            />
                        }}
                        style={{
                            height
                        }}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={80}
                        pullToRefresh={<PullToRefresh
                            direction='down'
                            distanceToRefresh={40}
                            onRefresh={this.onRefresh}
                        />}
                    />
                </div>
                <Route path={match.path + '/case'} component={Detail} />
            </div>
        );
    }
}