import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { Modal, InputItem, Icon, List, Toast } from 'antd-mobile';
import { regExp } from '../../../utlis';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './goToVerify.less';
const { alert } = Modal;

export default createForm()(class goToVerify extends Component {
    state = {
        visible: false,
        getCodeText: '获取验证码',
        timer: null,
        second: 60, // 定时秒数 判断值
        current: 60,
    }
    startTimer = () => {
        let timer = setInterval(() => {
            const { current, second } = this.state;
            this.setState({ current: current - 1 })
            if (current <= 1) {
                clearInterval(timer);
                timer = null;
                this.setState({ current: second })
            }
        }, 1000)
        this.setState({ timer })
    }
    getCode = () => {
        const { current, second } = this.state;
        if (current !== second) return
        const phone = this.props.form.getFieldValue('phone');
        if (!phone) {
            Toast.info('请输入手机号!')
            return
        }
        const formatPhone = phone.replace(regExp.removeEmpty, '');
        if (regExp.phone.test(formatPhone)) {
            alert('确认手机号码', <ul><li>我们将发送验证码短信到这个号码：</li><li>{phone}</li></ul>, [
                { text: '取消' },
                {
                    text: '好', onPress: () => {
                        request({ url: api.sendValidCode, data: { phone: formatPhone } }).then(res => {
                            console.log(res)
                            this.startTimer()
                        }).catch(err => { console.log(err); this.startTimer() })
                    }
                },
            ])
        } else
            Toast.info('请正确填写手机号!')
    }
    onOpen = () => {
        const { second, current } = this.state;
        this.props.form.resetFields();
        if (current !== second)
            this.setState({ current: second })
        this.setState({ visible: true });
    }
    onClose = () => {
        this.setState({ visible: false, timer: null })
        clearInterval(this.state.timer)
    }
    onOk = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const { phone, validCode } = values;
                request({ url: api.bindPhone, data: { phone: phone.replace(regExp.removeEmpty, ''), validCode } }).then(res => {
                    this.onClose()
                }).catch(err => { })
            }
        })
    }
    render() {
        const { visible, getCodeText, second, current } = this.state,
            { getFieldProps } = this.props.form;
        return (<List>
            <List.Item extra={<span
                className={styles.wrapper}
                onClick={this.onOpen}
            >去验证</span>}>验证成功后，订单信息一手掌握</List.Item>
            <Modal
                className={styles.verify_modal}
                visible={visible}
                transparent
                onClose={this.onClose}
                title={<div className={styles.verify_modal_title}>验证登陆<Icon type='cross-circle' onClick={this.onClose} /></div>}
                footer={[{ text: <div className={styles.verify_modal_footer}>确定</div>, onPress: this.onOk }]}
            // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >
                <List>
                    <InputItem
                        {...getFieldProps('phone', {
                            rules: [
                                { required: true, message: '请填写手机号' }
                            ],
                        })}
                        disabled={current === second ? false : true}
                        clear
                        type='phone'
                        autoFocus
                        placeholder='输入手机号' />
                    <InputItem
                        {...getFieldProps('validCode', {
                            rules: [
                                { required: true, message: '请填写验证码' },
                            ],
                        })}
                        clear
                        extra={<div onClick={this.getCode}>{current === second ? getCodeText : `${current}秒后重新发送`}</div>}
                        type='number'
                        placeholder='输入验证码'
                    />
                </List>
            </Modal>
        </List>)
    }
})