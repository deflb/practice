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
            { fsalesname = '顾问详情', fsalesid } = state;
        document.title = '家居顾问 ' + fsalesname;
        this.getShopStaffDetail(fsalesid)
    }

    componentWillReceiveProps(nextProps) {
        const { location, match } = nextProps,
            { pathname, state } = location;
        if (pathname === match.path)
            document.title = '家居顾问 ' + state.fsalesname;
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
            { selectionCase, match, location, history } = this.props,
            { state = {} } = location;
        return (
            <div className={styles.wrapper}>
                <CustomCarousel
                    source={[]}
                />
                <List renderHeader={() => <ul className={styles.wrapper_info}>
                    <li>
                        <div>
                            {/* <img src={pd_png} alt='' /> */}
                        </div>
                        {shopStaffDetail.fsalesname}
                    </li>
                    <li>
                        {/* <i className='iconfont icon-phone' />
                            13597456698 */}
                        <i className='iconfont icon-code' />
                    </li>
                </ul>}>
                    {/* <List.Item className={styles.wrapper_extra} thumb={<i className='iconfont icon-store redColor' />} arrow='horizontal'><div>东莞南城金隅小区</div></List.Item> */}
                </List>
                <CustomWhiteSpace />
                <TitleContent title='精选方案'>
                    <div>
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