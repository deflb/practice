import React, { Component } from 'react';
import CustomListView from '../../component/customListView';
import CaseItem from '../../component/itemPreView/caseItem';
import TypesClassifySelect from '../../component/typesClassifySelect';
import CustomSearchBar from '../../component/customSearchBar';
import Filter from './common/filter';
import { request } from '../../request';
import api from '../../request/api';
import styles from './case.less';
import routerBase from '../../router/routerBase';

export default class designCase extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
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
        const { pageSize, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList } = this.state;
        this.setState({ loading: true, keyword, sortColumn })
        request({ url: api.pageCase, data: { pageNo, pageSize, keyword, sceneId, areaIdList, huxingIdList, meritsIdList, priceIdList, styleIdList, sortColumn, sortOrder: 1 } }).then(res => {
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
        this.getCaseBaseList()
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getCaseList()
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getCaseList({ pageNo: 1, dataBlobs: [] })
    }

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
        if (!field || (!index && index !== 0)) return;
        const { dataBlobs } = this.state,
            _dataBlobs = [...dataBlobs],
            currentRow = { ..._dataBlobs[index] };
        currentRow[field]++;
        _dataBlobs.splice(index, 1, currentRow)
        this.setState({ dataBlobs: _dataBlobs })
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
            loading,
            refreshing,
        } = this.state,
            { history } = this.props;
        let current;
        return (
            <div className={styles.wrapper}>
                <CustomSearchBar
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
                        { title: '人气', val: 'b.views' },
                        { title: '点赞', val: 'b.likes' },
                        { title: '收藏', val: 'b.collects' },
                    ]}
                    itemClick={val => { this.getCaseList({ pageNo: 1, dataBlobs: [], sortColumn: val }) }}
                />
                <CustomListView
                    style={{ flex: 1 }}
                    getListViewInstance={instance => this.listView = instance}
                    loading={loading}
                    data={dataBlobs}
                    onEndReached={this.onEndReached}
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                    renderRow={(rowData, sectionID, index) => (<CaseItem
                        key={rowData.id}
                        style={{ marginBottom: 10 }}
                        rowClick={() => {
                            history.push({
                                pathname: routerBase + '/caseDetail',
                                state: { id: rowData.id, index }
                            })
                        }}
                        rowData={rowData}
                        updateLikeCount={this.updateCurrentItem.bind(this, 'likes', index)}
                    />)}
                />
            </div>
        );
    }
}