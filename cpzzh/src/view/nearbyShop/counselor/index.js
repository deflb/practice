import React, { Component } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { Carousel, List } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import TitleContent from '../../../component/titleContent';
import SelectionCaseLook from '../../../component/selectionCaseLook';
import fullC from '../common/fullC';
import MeasureRoom from '../measureRoom';
import { request } from '../../../request';
import api from '../../../request/api';
import { imgAddress } from '../../../request/baseURL';
import styles from './index.less';

export default connect(state => ({
    selectionCase: state.selectionCase
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

    getShopStaffDetail = fsalesid => {
        request({ url: api.shopStaffDetail, data: { fsalesid } }).then(res => {
            this.setState({ shopStaffDetail: res })
        }).catch(err => { })
    }

    render() {
        const { shopStaffDetail } = this.state,
            { selectionCase, match } = this.props;
        return (
            <div className={styles.wrapper}>
                <Carousel
                    autoplay={false}
                    infinite
                    className='carousel_common'
                >
                    {[].map((val, index) => (
                        <span
                            key={index}
                            className='carousel_common_item'
                        >
                            <img
                                src={val}
                                alt=""
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                }}
                            />
                        </span>
                    ))}
                </Carousel>
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
                        {selectionCase.map(item => <SelectionCaseLook style={{ marginBottom: 10 }} key={item.id} data={{ ...item, imgUrl: imgAddress + item.surfacePlotUrl }} />)}
                    </div>
                </TitleContent>
                <Route path={match.path + '/measureRoom'} component={MeasureRoom} />
            </div>
        );
    }
}))