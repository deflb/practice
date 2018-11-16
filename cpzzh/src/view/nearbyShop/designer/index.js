import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { ListView } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import InfoList from '../../../component/infoList';
import TitleContent from '../../../component/titleContent';
import CasePdLook from '../../../component/casePdLook';
import CustomCarousel from '../../../component/customCarousel';
import asyncC from '../../../component/asyncC';
import fullC from '../common/fullC';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';
const MeasureRoom = asyncC(() => import('../measureRoom'));
const Detail = asyncC(() => import('../../moreCase/caseComponent/detail'));

export default connect(state => ({
    userInfo: state.userInfo
}))(fullC('设计师')(class designer extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        keyword: '',
        dataBlobs: [],
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        isLoading: false,
        height: 0,

        shopStaffDetail: {} // 设计师详情
    }

    componentDidMount() {
        const { location } = this.props,
            { state = {} } = location,
            { fsalesname = '设计师详情', fsalesid, fusrid } = state;
        document.title = '设计师 ' + fsalesname;
        this.getCaseList({ fusrid })
        this.getShopStaffDetail(fsalesid)
    }

    componentWillReceiveProps(nextProps) {
        const { location, match } = nextProps,
            { pathname, state } = location;
        if (pathname === match.path)
            document.title = '设计师 ' + state.fsalesname;
    }

    getShopStaffDetail = fsalesid => {
        request({ url: api.shopStaffDetail, data: { fsalesid } }).then(res => {
            this.setState({ shopStaffDetail: res || {} })
        }).catch(err => { })
    }

    getCaseList = ({
        pageNo = this.state.pageNo,
        keyword = this.state.keyword,
        dataBlobs = this.state.dataBlobs,
        fusrid = this.state.fusrid
    } = {}) => {
        const { pageSize, dataSource } = this.state;
        this.setState({ isLoading: true, keyword, fusrid })
        request({ url: api.pageCase, data: { pageNo, pageSize, keyword, sceneId: '', creator: fusrid } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                height: !_dataBlobs.length ? 45 : _dataBlobs.length === 1 ? 150 : 350,
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                dataSource: dataSource.cloneWithRows([..._dataBlobs]),
                isLoading: false,
            })
            pageNo === 1 && this.lv.scrollTo(0, 0)
        }).catch(err => { this.setState({ isLoading: false }) })
    }

    onEndReached = (event) => {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore)
            return;
        this.getCaseList()
    }

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
        const { dataBlobs, dataSource, height, isLoading, shopStaffDetail } = this.state,
            { match, history, location } = this.props,
            { state = {} } = location;
        return (
            <div className={styles.wrapper}>
                <CustomCarousel
                    source={[]}
                />
                <div className={styles.wrapper_info}>
                    <div className={styles.wrapper_info_avator}>
                        {/* <img src={pd_png} alt='' /> */}
                    </div>
                    <ul className={styles.wrapper_info_detail}>
                        <li className={styles.wrapper_info_detail_name}>{shopStaffDetail.fsalesname}</li>
                        {/* <li className={styles.wrapper_info_detail_address}><i className='iconfont icon-address' />广州 | 梦天旗舰店</li> */}
                    </ul>
                    <InfoList
                        data={[
                            // { label: '设计经验', value: '10年' },
                            // { label: '擅长风格', value: '现代简约 欧式' },
                            // { label: '设计理念', value: '设计理念设计理念设计理念设计理念设计理念设计理念' },
                        ]}
                    />
                </div>
                <CustomWhiteSpace />
                <TitleContent title='设计作品'>
                    <div>
                        {/* <ul className={styles.wrapper_filter}>
                            {[
                                { title: '全部', number: 8 },
                                { title: '整装', number: 6 },
                                { title: '主卧', number: 1 },
                                { title: '次卧', number: 1 },
                            ].map(item => <li className={styles.active} key={item.title}>{item.title}（{item.number}）</li>)}
                        </ul> */}
                        <ListView
                            dataSource={dataSource}
                            renderFooter={() => isLoading ? '加载中...' : dataBlobs.length ? '我是有底线的' : '暂无结果'}
                            renderRow={(rowData, sectionID, index) => {
                                const { id, surfacePlotUrl, title, styleName, views, comments, likes } = rowData;
                                return <CasePdLook
                                    style={{ marginBottom: 10 }}
                                    rowClick={() => {
                                        history.push({
                                            pathname: match.path + '/caseDetail',
                                            state: { id, index, ...state }
                                        })
                                    }}
                                    rowData={{ index, id, surfacePlotUrl, title, styleName, views, comments, likes }}
                                    updateCurrentItem={this.updateCurrentItem}
                                />
                            }}
                            style={{ height }}
                            onEndReached={this.onEndReached}
                        // onEndReachedThreshold={30}
                        />
                    </div>
                </TitleContent>
                <Route path={match.path + '/measureRoom'} component={MeasureRoom} />
                <Route path={match.path + '/caseDetail'} render={props => <Detail {...props} updateCurrentItem={this.updateCurrentItem} />} />
            </div>
        );
    }
}))