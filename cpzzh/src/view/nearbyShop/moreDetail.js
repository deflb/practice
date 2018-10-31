import React, { Component } from 'react';
import { Route } from 'react-router';
import { getSelectionCase } from '../../store/action';
import { connect } from 'react-redux';
import { Carousel, List } from 'antd-mobile';
import CustomWhiteSpace from '../../component/customWhiteSpace';
import TextMaskImageBox from '../../component/textMaskImageBox';
import TitleContent from '../../component/titleContent';
import SelectionCaseLook from '../../component/selectionCaseLook';
// import fullC from './common/fullC';
import asyncC from '../../component/asyncC';
import { request } from '../../request';
import api from '../../request/api';
import { imgAddress, crmFileAddress } from '../../request/baseURL';
import styles from './moreDetail.less';
const Counselor = asyncC(() => import('./counselor'));
const Designer = asyncC(() => import('./designer'));
const MeasureRoom = asyncC(() => import('./measureRoom'));

export default connect(state => ({
    selectionCase: state.selectionCase
}))(class nearbyShopDetail extends Component {

    state = {
        docT: '',
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
            { fsname = '门店详情', fshopid } = state;
        this.setState({ docT: fsname })
        document.title = fsname;
        this.getShopDetail(fshopid)
        this.getShopGuideList(fshopid)
        this.getShopDesignerList(fshopid)
        dispatch(getSelectionCase())
    }

    componentWillReceiveProps() {
        document.title = this.state.docT;
    }

    render() {
        const { shopDetail, shopGuide, shopDesigner } = this.state,
            shopImgList = shopDetail.shopImgList || [],
            { location, match, selectionCase } = this.props,
            { state = {} } = location,
            { fshopid } = state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.wrapper_container}>
                    <Carousel
                        autoplay={false}
                        infinite
                        className='carousel_common'
                    >
                        {shopImgList.map(item => (
                            <span
                                key={item.fid}
                                className='carousel_common_item'
                            >
                                <img
                                    src={crmFileAddress + api.crmFileUrl(item.fimgpath)}
                                    alt=""
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                    }}
                                />
                            </span>
                        ))}
                    </Carousel>
                    <List>
                        <List.Item><div className='titleFontSizeC'>{shopDetail.fsname}</div></List.Item>
                        <List.Item thumb={<i className='iconfont icon-address redColor' />}><div className='normalFontSizeC shallowGreyColor'>{shopDetail.faddress}</div></List.Item>
                        <List.Item thumb={<i className='iconfont icon-phone greenColor' />}><div className='normalFontSizeC shallowGreyColor'>{shopDetail.fmastermobile}</div></List.Item>
                        <List.Item thumb={<i className='iconfont icon-code redColor' />}><div className='normalFontSizeC shallowGreyColor'>
                            {/* 店铺二维码（访问量：3200） */}
                        </div></List.Item>
                    </List>
                    <CustomWhiteSpace />
                    <div className={styles.wrapper_container_personal}>
                        <div className={`${styles.wrapper_container_personal_header} titleFontSizeC`}>设计达人</div>
                        <div className={styles.wrapper_container_personal_body}>
                            {shopDesigner.map((item, index) => <TextMaskImageBox
                                key={index}
                                style={{ margin: index % 3 === 1 ? '0 2%' : null }}
                                className={styles.wrapper_container_personal_body_item}
                                rowData={{ imgUrl: item.imgUrl, title: item.fsalesname }}
                                onClick={this.jumpTo.bind(this, { pathname: match.path + '/designer', state: { ...item, fshopid } })}
                            />)
                            }
                        </div>
                    </div>
                    <CustomWhiteSpace />
                    <div className={styles.wrapper_container_personal}>
                        <div className={`${styles.wrapper_container_personal_header} titleFontSizeC`}>资深家居顾问</div>
                        <div className={styles.wrapper_container_personal_body}>
                            {shopGuide.map((item, index) => <TextMaskImageBox
                                key={index}
                                style={{ margin: index % 3 === 1 ? '0 2%' : null }}
                                className={styles.wrapper_container_personal_body_item}
                                rowData={{ imgUrl: item.imgUrl, title: item.fsalesname }}
                                onClick={this.jumpTo.bind(this, { pathname: match.path + '/counselor', state: { ...item, fshopid } })}
                            />)
                            }
                        </div>
                    </div>
                    <CustomWhiteSpace />
                    <TitleContent title='精选方案'>
                        <div>
                            {selectionCase.map(item => <SelectionCaseLook style={{ marginBottom: 10 }} key={item.id} data={{ ...item, imgUrl: imgAddress + item.surfacePlotUrl }} />)}
                        </div>
                    </TitleContent>
                    <Route path={match.path + '/counselor'} component={Counselor} />
                    <Route path={match.path + '/designer'} component={Designer} />
                    <Route path={match.path + '/measureRoom'} component={MeasureRoom} />
                </div>
            </div>
        );
    }
})