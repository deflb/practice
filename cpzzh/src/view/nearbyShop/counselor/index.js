import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { List } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import TitleContent from '../../../component/titleContent';
import SelectionCaseLook from '../../../component/selectionCaseLook';
import CustomCarousel from '../../../component/customCarousel';
import asyncC from '../../../component/asyncC';
import fullC from '../common/fullC';
import MeasureRoom from '../measureRoom';
import { request } from '../../../request';
import api from '../../../request/api';
import whichImgLink from '../../../utlis/whichImgLink';
import styles from './index.less';
const Detail = asyncC(() => import('../../moreCase/caseComponent/detail'));

export default connect(state => ({
    selectionCase: state.selectionCase,
    userInfo: state.userInfo
}))(fullC('顾问')(class counselor extends Component {
    state = {
        shopStaffDetail: {} // 顾问详情
    }

    componentDidMount() {
        const { location } = this.props,
            { state = {} } = location,
            { fsalesid } = state;
        this.getShopStaffDetail(fsalesid)
    }

    componentWillReceiveProps(nextProps) {
        const { location, match } = nextProps,
            { pathname, state } = location;
        if (pathname === match.path && document.title !== '家居顾问 ' + state.fsalesname) {
            document.title = '家居顾问 ' + state.fsalesname;
        }
    }

    getShopStaffDetail = fsalesid => {
        request({ url: api.shopStaffDetail, data: { fsalesid } }).then(res => {
            this.setState({ shopStaffDetail: res })
        }).catch(err => { })
    }

    updateCurrentItem = (field, index) => {
        const { selectionCase } = this.props;
        selectionCase[index][field]++;
    }

    render() {
        const { shopStaffDetail } = this.state,
            { fheadpic, fsalesname, fmobile, fsnname } = shopStaffDetail,
            { selectionCase, match, location, history } = this.props,
            { state = {} } = location;
        return (
            <div>
                <CustomCarousel
                    source={state.shopImgList || []}
                />
                <List renderHeader={() => <ul className={styles.wrapper_info}>
                    <li>
                        <div>
                            {fheadpic ? <img src={whichImgLink(fheadpic)} alt='' /> : null}
                        </div>
                        {fsalesname}
                    </li>
                    <li>
                        {fmobile ? <a href={`tel:${fmobile}`} className='shallowGreyColor'><i className='iconfont icon-phone greenColor' />{fmobile}</a> : null}
                        {/* <i className='iconfont icon-code' /> */}
                    </li>
                </ul>}>
                    <List.Item onClick={e => { history.goBack() }} className={styles.wrapper_extra} thumb={<i className='iconfont icon-store redColor' />} arrow='horizontal'>
                        {fsnname}
                    </List.Item>
                </List>
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
                <Route path={match.path + '/measureRoom'} component={MeasureRoom} />
                <Route path={match.path + '/caseDetail'} render={props => <Detail {...props} updateCurrentItem={this.updateCurrentItem} />} />
            </div>
        );
    }
}))