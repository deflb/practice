import React, { Component } from 'react';
import { Route } from 'react-router';
import { Button } from 'antd-mobile';
import { mapInstanceSimple, convertorTranslate } from '../../utlis/bMap';
import asyncC from '../../component/asyncC';
import fullScreen from '../../component/fullScreen';
import styles from './detail.less';
const MoreDetail = asyncC(() => import('./moreDetail'));

export default fullScreen(class detail extends Component {
    goToDetail = state => {
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/detail',
            state
        })
    }

    componentDidMount() {
        let { location } = this.props,
            { state = {} } = location,
            { flongitude, flatitude } = state;
        convertorTranslate({ longitude: flongitude, latitude: flatitude }, (bPos) => {
            mapInstanceSimple(bPos, 'map_view')
        });
    }

    render() {
        const { match, location } = this.props,
            { state = {} } = location,
            { fsname = '', isNear = 0, distance = 0, faddress = '', fshopid, fmastermobile, flongitude, flatitude } = state;
        return (<div className={styles.wrapper}>
            <div id='map_view'></div>
            <ul className={styles.wrapper_info}>
                <li className={styles.wrapper_info_title}><span className={styles.wrapper_info_title_pos}>{fsname}{isNear === 1 ? <span className={styles.wrapper_info_title_pos_tip}>离你最近</span> : null}</span>{distance.toFixed(1)}km</li>
                <li className={styles.wrapper_info_address}><i className='iconfont icon-address' />{faddress}</li>
                <li className={styles.wrapper_info_detail}>
                    <ul className={styles.wrapper_info_detail_des}>
                        {/* <li>营业时间：</li> */}
                        {fmastermobile ? <li>电话：<a href={`tel:${fmastermobile}`}>{fmastermobile}</a></li> : null}
                    </ul>
                    <Button className={styles.wrapper_info_detail_go} inline size='small' type='warning' onClick={this.goToDetail.bind(this, { fsname, isNear, distance, faddress, fshopid, fmastermobile, flongitude, flatitude })}>去门店</Button>
                </li>
            </ul>
            <Route path={match.path + '/detail'} component={MoreDetail} />
        </div>)
    }
})