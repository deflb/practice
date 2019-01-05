import React, { Component } from 'react';
import { Route } from 'react-router';
import { getSelectionCase } from '../../store/action';
import { connect } from 'react-redux';
import { List } from 'antd-mobile';
import CustomWhiteSpace from '../../component/customWhiteSpace';
import TextMaskImageBox from '../../component/textMaskImageBox';
import TitleContent from '../../component/titleContent';
import SelectionCaseLook from '../../component/selectionCaseLook';
import CustomCarousel from '../../component/customCarousel';
import asyncC from '../../component/asyncC';
import fullC from './common/fullC';
import { request } from '../../request';
import api from '../../request/api';
import styles from './moreDetail.less';
const Counselor = asyncC(() => import('./counselor'));
const Designer = asyncC(() => import('./designer'));
const MeasureRoom = asyncC(() => import('./measureRoom'));
const Detail = asyncC(() => import('../moreCase/caseComponent/detail'));

export default connect(state => ({
    selectionCase: state.selectionCase,
    userInfo: state.userInfo,
}))(fullC()(class nearbyShopDetail extends Component {

    state = {
        shopDetail: [],
        shopGuide: [],
        shopDesigner: [],
    }

    jumpTo = ({ pathname, state = {} }) => {
        const { history } = this.props;
        history.push({
            pathname,
            state
        })
    }

    getShopGuideList = shopid => {
        request({ url: api.shopGuideList, data: { shopid } }).then(res => {
            this.setState({ shopGuide: res || [] })
        }).catch(err => { })
    }
    getShopDesignerList = shopid => {
        request({ url: api.shopDesignerList, data: { shopid } }).then(res => {
            this.setState({ shopDesigner: res || [] })
        }).catch(err => { })
    }

    getShopDetail = shopid => {
        request({ url: api.shopDetail, data: { fshopid: shopid } }).then(res => {
            this.setState({ shopDetail: res || {} })
        }).catch(err => { })
    }

    componentDidMount() {
        const { location, dispatch } = this.props,
            { state = {} } = location,
            { fshopid } = state;
        this.getShopDetail(fshopid)
        this.getShopGuideList(fshopid)
        this.getShopDesignerList(fshopid)
        dispatch(getSelectionCase())
    }

    componentWillReceiveProps(nextProps) {
        const { location, match } = nextProps,
            { pathname, state } = location;
        if (pathname === match.path && document.title !== state.fsname)
            document.title = state.fsname
    }

    updateCurrentItem = (field, index) => {
        const { selectionCase } = this.props;
        selectionCase[index][field]++;
    }

    render() {
        const { shopDetail, shopGuide, shopDesigner } = this.state,
            { shopImgList, fsname, fdistrictname, faddress, ftel } = shopDetail,
            _shopImgList = shopImgList && shopImgList.length ? shopImgList.map(item => item.fimgpath) : [],
            { location, match, selectionCase, history, dispatch } = this.props,
            { state = {} } = location;
        return (<div>
            <CustomCarousel
                source={_shopImgList}
            />
            <List>
                <List.Item><div className='titleFontSizeC'>{fsname}</div></List.Item>
                <List.Item thumb={<i className='iconfont icon-address redColor' />}><div className='normalFontSizeC shallowGreyColor oneRowOverflowOmit'>{fdistrictname}{faddress}</div></List.Item>
                <List.Item thumb={<i className='iconfont icon-phone greenColor' />}><a href={`tel:${ftel}`} className='normalFontSizeC shallowGreyColor'>{ftel}</a></List.Item>
                {/* <List.Item thumb={<i className='iconfont icon-code redColor' />}><div className='normalFontSizeC shallowGreyColor'>
                    店铺二维码（访问量：3200）
                </div></List.Item> */}
            </List>
            <CustomWhiteSpace />
            <div className={styles.personal}>
                <div className={styles.personal_header}>设计达人</div>
                <div className={styles.personal_body}>
                    {shopDesigner.map((item, index) => {
                        const { fheadpic, fsalesname, fsalesid, fusrid } = item;
                        return <TextMaskImageBox
                            key={fsalesid}
                            style={{ margin: index % 3 === 1 ? '0 2%' : null }}
                            className={styles.personal_body_item}
                            rowData={{ imgUrl: fheadpic, title: fsalesname }}
                            onClick={this.jumpTo.bind(this, { pathname: match.path + '/designer', state: { shopImgList: _shopImgList, fsalesname, fsalesid, fusrid, fheadpic, ...state } })}
                        />
                    })
                    }
                </div>
            </div>
            <CustomWhiteSpace />
            <div className={styles.personal}>
                <div className={styles.personal_header}>资深家居顾问</div>
                <div className={styles.personal_body}>
                    {shopGuide.map((item, index) => {
                        const { fheadpic, fsalesname, fsalesid, fusrid } = item;
                        return <TextMaskImageBox
                            key={fsalesid}
                            style={{ margin: index % 3 === 1 ? '0 2%' : null }}
                            className={styles.personal_body_item}
                            rowData={{ imgUrl: fheadpic, title: fsalesname }}
                            onClick={this.jumpTo.bind(this, { pathname: match.path + '/counselor', state: { shopImgList: _shopImgList, fsalesname, fsalesid, fusrid, fheadpic, ...state } })}
                        />
                    })
                    }
                </div>
            </div>
            <CustomWhiteSpace />
            <TitleContent title='精选方案'>
                <div style={{ padding: '10px 15px 0' }}>
                    {selectionCase.map((item, index) => {
                        const { id, styleName, buildName, creator, views, createTime, surfacePlotUrl } = item;
                        return <SelectionCaseLook
                            style={{ marginBottom: 10 }}
                            key={id}
                            rowClick={() => {
                                history.push({
                                    pathname: match.path + '/caseDetail',
                                    state: { id, index, ...state }
                                })
                            }}
                            data={{ styleName, buildName, creator, views, createTime, surfacePlotUrl }}
                        />
                    })}
                </div>
            </TitleContent>
            <Route path={match.path + '/counselor'} component={Counselor} />
            <Route path={match.path + '/designer'} component={Designer} />
            <Route path={match.path + '/measureRoom'} render={props => <MeasureRoom {...props} dispatch={dispatch} />} />
            <Route path={match.path + '/caseDetail'} render={props => <Detail {...props} updateCurrentItem={this.updateCurrentItem} />} />
        </div>);
    }
}))