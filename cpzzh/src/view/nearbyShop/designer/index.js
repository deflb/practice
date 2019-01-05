import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { List } from 'antd-mobile';
import CustomListView from '../../../component/customListView';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
// import InfoList from '../../../component/infoList';
import TitleContent from '../../../component/titleContent';
import CaseItem from '../../../component/itemPreView/caseItem';
import CustomCarousel from '../../../component/customCarousel';
import asyncC from '../../../component/asyncC';
import fullC from '../common/fullC';
import { request } from '../../../request';
import api from '../../../request/api';
import whichImgLink from '../../../utlis/whichImgLink';
import styles from '../counselor/index.less';
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
        loading: false,
        height: 0,

        shopStaffDetail: {} // 设计师详情
    }

    componentDidMount() {
        const { location } = this.props,
            { state = {} } = location,
            { fsalesid, fusrid } = state;
        this.getCaseList({ fusrid })
        this.getShopStaffDetail(fsalesid)
    }

    componentWillReceiveProps(nextProps) {
        const { location, match } = nextProps,
            { pathname, state } = location;
        if (pathname === match.path && document.title !== '设计师 ' + state.fsalesname)
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
        const { pageSize } = this.state;
        this.setState({ loading: true, keyword, fusrid })
        request({ url: api.pageCase, data: { pageNo, pageSize, keyword, sceneId: '', creator: fusrid } }).then(res => {
            const { list, pageTurn } = res,
                { nextPage, rowCount } = pageTurn,
                _dataBlobs = [...dataBlobs, ...list];
            this.setState({
                height: !_dataBlobs.length ? 45 : _dataBlobs.length === 1 ? 150 : 350,
                hasMore: _dataBlobs.length >= rowCount ? false : true,
                pageNo: nextPage,
                dataBlobs: _dataBlobs,
                loading: false,
            })
        }).catch(err => { this.setState({ loading: false }) })
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        this.getCaseList()
    }

    updateCurrentItem = (field, index) => { // views comments likes
        if (!field) return;
        const { dataBlobs } = this.state,
            _dataBlobs = [...dataBlobs],
            currentRow = { ..._dataBlobs[index] };
        currentRow[field]++;
        _dataBlobs.splice(index, 1, currentRow)
        this.setState({
            dataBlobs: _dataBlobs
        })
    }

    render() {
        const { dataBlobs, height, loading, shopStaffDetail } = this.state,
            { fheadpic, fmobile, fsalesname, fsnname } = shopStaffDetail,
            { match, history, location } = this.props,
            { state = {} } = location;
        return (
            <div>
                <CustomCarousel
                    source={state.shopImgList || []}
                />
                {/* <div className={styles.wrapper_info}>
                    <div className={styles.wrapper_info_avator}>
                        {fheadpic ? <img src={whichImgLink(fheadpic)} alt='' /> : null}
                    </div>
                    <ul className={styles.wrapper_info_detail}>
                        <li className={styles.wrapper_info_detail_name}>{fsalesname}</li>
                        <li className={styles.wrapper_info_detail_address}><i className='iconfont icon-address' />广州 | 梦天旗舰店</li>
                    </ul>
                    <InfoList
                        data={[
                            // { label: '设计经验', value: '10年' },
                            // { label: '擅长风格', value: '现代简约 欧式' },
                            // { label: '设计理念', value: '设计理念设计理念设计理念设计理念设计理念设计理念' },
                        ]}
                    />
                </div> */}
                <List renderHeader={() => <ul className={styles.wrapper_info}>
                    <li>
                        <div>
                            {fheadpic ? <img src={whichImgLink(fheadpic)} alt='' /> : null}
                        </div>
                        {fsalesname}
                    </li>
                    <li>
                        {fmobile ? <a href={`tel:${fmobile}`} className='shallowGreyColor'><i className='iconfont icon-phone greenColor' />{fmobile}</a> : null}
                        <i className='iconfont icon-code' />
                    </li>
                </ul>}>
                    <List.Item onClick={e => { history.goBack() }} className={styles.wrapper_extra} thumb={<i className='iconfont icon-store redColor' />} arrow='horizontal'>
                        {fsnname}
                    </List.Item>
                </List>
                <CustomWhiteSpace />
                <TitleContent title='设计作品'>
                    <div style={{ padding: '10px 15px 0' }}>
                        {/* <ul className={styles.wrapper_filter}>
                            {[
                                { title: '全部', number: 8 },
                                { title: '整装', number: 6 },
                                { title: '主卧', number: 1 },
                                { title: '次卧', number: 1 },
                            ].map(item => <li className={styles.active} key={item.title}>{item.title}（{item.number}）</li>)}
                        </ul> */}
                        <CustomListView
                            style={{ height }}
                            sectionBodyClassName={null}
                            loading={loading}
                            data={dataBlobs}
                            onEndReached={this.onEndReached}
                            renderRow={(rowData, sectionID, index) => (<CaseItem
                                key={rowData.id}
                                style={{ marginBottom: 10 }}
                                rowClick={() => {
                                    history.push({
                                        pathname: match.path + '/caseDetail',
                                        state: { id: rowData.id, index, ...state }
                                    })
                                }}
                                rowData={rowData}
                                updateLikeCount={this.updateCurrentItem.bind(this, 'likes', index)}
                            />)}
                        />
                    </div>
                </TitleContent>
                <Route path={match.path + '/measureRoom'} component={MeasureRoom} />
                <Route path={match.path + '/caseDetail'} render={props => <Detail {...props} updateCurrentItem={this.updateCurrentItem} />} />
            </div>
        );
    }
}))