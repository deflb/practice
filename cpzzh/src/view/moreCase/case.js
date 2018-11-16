import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import {
    ListView,
    // PullToRefresh
} from 'antd-mobile';
import { globalLoadingToggle } from '../../store/action';
import asyncC from '../../component/asyncC';
import CasePdLook from '../../component/casePdLook';
import TypesClassifySelect from '../../component/typesClassifySelect';
import SearchBar from './common/searchBar';
import Filter from './common/filter';
import { request } from '../../request';
import api from '../../request/api';
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
        const { pageSize, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, dataSource } = this.state,
            { dispatch } = this.props;
        dispatch(globalLoadingToggle(true));
        this.setState({ isLoading: true, keyword, sortColumn })
        request({ url: api.pageCase, data: { pageNo, pageSize, keyword, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, sortColumn } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            dispatch(globalLoadingToggle(false));
            this.setState({
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows([..._dataBlobs]),
                isLoading: false,
            })
            pageNo === 1 && this.lv.scrollTo(0, 0)
        }).catch(err => {
            this.setState({ isLoading: false });
            dispatch(globalLoadingToggle(false));
        })
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

    // updateList = () => { // 更新list (下拉刷新)
    //     const { dataBlobs, dataSource, keyword, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, sortColumn } = this.state,
    //         len = dataBlobs.length;
    //     request({ url: api.pageCase, data: { pageNo: 1, pageSize: len, keyword, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, sortColumn } }).then(res => {
    //         const { list, pageTurn } = res,
    //             { rowCount } = pageTurn;
    //         this.setState({
    //             hasMore: list.length >= rowCount ? false : true,
    //             dataBlobs: list,
    //             dataSource: dataSource.cloneWithRows(list),
    //         })
    //     }).catch(error => { })
    // }

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

    // 为了性能考虑 字段方面的更新 前端直接处理 不去拉取数据
    updateCurrentItem = (field, index) => { // views comments likes
        if (!field) return;
        const { dataBlobs, dataSource } = this.state,
            _dataBlobs = [...dataBlobs],
            currentRow = { ..._dataBlobs[index] };
        currentRow[field]++;
        _dataBlobs.splice(index, 1, currentRow)
        this.setState({
            dataBlobs: _dataBlobs,
            dataSource: dataSource.cloneWithRows(_dataBlobs)
        })
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
            isLoading,
        } = this.state,
            { match, history } = this.props;
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
                                    <li className={styles.filter_wrapper_title}>{item.name}</li>
                                    <li className={styles.filter_wrapper_content}>
                                        <ul className={styles.filter_item_wrapper}>
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
                <TypesClassifySelect
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
                        renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                        renderRow={(rowData, sectionID, index) => {
                            const { id, surfacePlotUrl, title, styleName, views, comments, likes } = rowData;
                            return <CasePdLook
                                style={{ marginBottom: 10 }}
                                rowClick={() => {
                                    history.push({
                                        pathname: match.path + '/case',
                                        state: { id, index }
                                    })
                                }}
                                rowData={{ index, id, surfacePlotUrl, title, styleName, views, comments, likes }}
                                updateCurrentItem={this.updateCurrentItem}
                            />
                        }}
                        style={{ height }}
                        onEndReached={this.onEndReached}
                    // onEndReachedThreshold={100}
                    // pullToRefresh={<PullToRefresh
                    //     direction='down'
                    //     distanceToRefresh={40}
                    //     onRefresh={this.updateList}
                    // />}
                    />
                </div>
                <Route path={match.path + '/case'} render={props => <Detail {...props} updateCurrentItem={this.updateCurrentItem} />} />
            </div>
        );
    }
}