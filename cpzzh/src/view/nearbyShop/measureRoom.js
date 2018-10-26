import React, { Component } from 'react';
import { List, InputItem, Button } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import styles from './measureRoom.less';

export default class measureRoom extends Component {
    componentDidMount() {
        document.title = '预约量房'
    }
    submit = () => {
        const param = {
            fcname: '',
            fcstid: '',
            fmobile: '',
            fdesignerid: '',
            fnavusrid: ''
        }
        request({ url: api.appointMeasure, data: param }).then(res => {

        }).catch(err => { })
    }
    render() {
        const { location } = this.props,
            { state = {} } = location,
            { flag, fsalesname } = state;
        return (<div className={styles.wrapper}>
            <div className={styles.wrapper_tip}>
                {flag ? <div className={styles.wrapper_tip_container}>
                    <div className={styles.wrapper_tip_container_avator}>
                        {/* <img src={} alt='' /> */}
                    </div>
                    <span className={styles.wrapper_tip_container_name}>{fsalesname} {flag}</span>
                    <span className={styles.wrapper_tip_container_extra}>将为您贴心服务！</span>
                </div> : null}
            </div>
            <div className={styles.wrapper_content}>
                <List className={styles.wrapper_content_list}>
                    <InputItem clear labelNumber={1} type='text' placeholder='请输入您的姓名'><i className='iconfont icon-user' /></InputItem>
                    <InputItem clear labelNumber={1} type='phone' placeholder='请输入您的手机号'><i className='iconfont icon-phone1' /></InputItem>
                </List>
                <Button className={styles.wrapper_content_button} type='warning'>预约量房</Button>
                <p className={styles.wrapper_content_extra}>在您提交您的信息后，{flag ? `${fsalesname}${flag}将会及时跟进您的预约。并根据您的时间安排合适人员上门测量!` : '我们将会尽快与您联系'}</p>
            </div>
        </div>)
    }
}