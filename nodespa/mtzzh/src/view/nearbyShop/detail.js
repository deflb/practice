import React, { Component } from 'react';
import { Route } from 'react-router';
import { Button } from 'antd-mobile';
import { wx_config } from '../../utlis/wxConfig';
import asyncC from '../../component/asyncC';
import styles from './detail.less';
const MoreDetail = asyncC(() => import('./moreDetail'));

export default class detail extends Component {
    goToDetail = state => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state
        })
    }

    componentDidMount() {
        wx_config({ jsApiList: ['getLocation'] }).then(res => {
            console.log(res)
        }).catch(err => { })
    }

    render() {
        const { match, location } = this.props,
            { state = {} } = location,
            { fsname = '', isNear = 0, distance = 0, faddress = '' } = state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.wrapper_contain}>
                    <div className={styles.wrapper_contain_map} id='map_view'></div>
                    <ul className={styles.wrapper_contain_info}>
                        <li className={styles.wrapper_contain_info_title}><span className={styles.wrapper_contain_info_title_pos}>{fsname}{isNear === 1 ? <span className={styles.wrapper_contain_info_title_pos_tip}>离你最近</span> : null}</span>{distance.toFixed(1)}km</li>
                        <li className={styles.wrapper_contain_info_address}><i className='iconfont icon-address' />{faddress}</li>
                        <li className={styles.wrapper_contain_info_detail}>
                            <ul className={styles.wrapper_contain_info_detail_des}>
                                {/* <li>营业时间：8:00-17:00</li>
                                <li>电话：13546897774</li> */}
                            </ul>
                            <Button className={styles.wrapper_contain_info_detail_go} inline size='small' type='warning' onClick={this.goToDetail.bind(this, state)}>去门店</Button>
                        </li>
                    </ul>
                </div>
                <Route path={match.path + '/detail'} component={MoreDetail} />
            </div>
        )
    }
}