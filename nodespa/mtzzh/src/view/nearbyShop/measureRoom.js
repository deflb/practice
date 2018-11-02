import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { List, InputItem, Button, Toast, Modal } from 'antd-mobile';
import { regExp } from '../../utlis';
import { request } from '../../request';
import api from '../../request/api';
import styles from './measureRoom.less';
const { alert } = Modal;

export default createForm()(class measureRoom extends Component {
    componentDidMount() {
        document.title = '预约量房'
    }
    submit = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                alert('提示', '确认提交预约吗？', [
                    { text: '取消' },
                    {
                        text: '提交', onPress: () => {
                            const { fcname, fmobile } = values,
                                param = { fcname, fmobile: fmobile.replace(regExp.removeEmpty, '') },
                                { location, userInfo } = this.props,
                                { state = {} } = location,
                                { flag, fsalesid } = state;
                            param.fcstid = userInfo.customerId;
                            if (flag === '设计师')
                                param.fdesignerid = fsalesid;
                            if (flag === '顾问')
                                param.fnavusrid = fsalesid;
                            request({ url: api.appointMeasure, data: param }).then(res => {
                                Toast.success('提交成功!', 0.7)
                                let timer = setTimeout(() => {
                                    this.props.history.goBack();
                                    clearTimeout(timer)
                                    timer = null
                                }, 700)
                            }).catch(err => { })
                        }
                    },
                ])
            }
        })
    }
    render() {
        const { location, form } = this.props,
            { state = {} } = location,
            { getFieldProps } = form,
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
                    <InputItem
                        {...getFieldProps('fcname', {
                            rules: [
                                { required: true, message: '请输入您的姓名' },
                            ],
                        })}
                        autoFocus
                        clear
                        labelNumber={1}
                        type='text'
                        placeholder='请输入您的姓名'
                    ><i className='iconfont icon-user' /></InputItem>
                    <InputItem
                        {...getFieldProps('fmobile', {
                            rules: [
                                { required: true, message: '请输入您的手机号' },
                            ],
                        })}
                        clear
                        labelNumber={1}
                        type='phone'
                        placeholder='请输入您的手机号'
                    ><i className='iconfont icon-phone1' /></InputItem>
                </List>
                <Button className={styles.wrapper_content_button} type='warning' onClick={this.submit}>预约量房</Button>
                <p className={styles.wrapper_content_extra}>在您提交您的信息后，{flag ? `${fsalesname}${flag}将会及时跟进您的预约。并根据您的时间安排合适人员上门测量!` : '我们将会尽快与您联系'}</p>
            </div>
        </div>)
    }
})