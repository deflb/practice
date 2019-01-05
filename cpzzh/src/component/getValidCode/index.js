import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import { regExp } from '../../utlis';
import CustomModal from '../../component/customModal';
import { request } from '../../request';
import api from '../../request/api';

export default class getValidCode extends Component {
    state = {
        getCodeText: '获取验证码',
        second: 60, // 定时秒数 判断值
        current: 60,
    }
    static propTypes = {
        getPhone: PropTypes.func, // 手机号 函数返回
        userName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) // 用户信息里面的name字段 做为获取验证码接口参数
    }
    static defaultProps = {
        getPhone: () => { },
        userName: '',
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
    }

    getCode = e => {
        e.stopPropagation();
        const { current, second } = this.state, { getPhone = () => { }, userName } = this.props;
        if (current !== second) return
        const phone = getPhone();
        if (!phone) {
            Toast.info('请输入手机号', 0.7)
            return
        }
        const formatPhone = regExp.allNumber.test(phone) ? phone : phone.replace(regExp.removeEmpty, '');
        if (regExp.phone.test(formatPhone)) {
            CustomModal.alert({
                title: '确认手机号码', message: <ul><li>我们将发送验证码短信到：</li><li>{phone}</li></ul>, actions: [
                    { text: '取消' },
                    {
                        text: '好', onPress: () => {
                            request({ url: api.sendValidCode, data: { phone: formatPhone, user: userName } }).then(res => {
                                if (!res.msgcode) {
                                    Toast.info('短信已发出', 0.7);
                                    this.startTimer()
                                }
                            }).catch(err => { })
                        }
                    },
                ]
            })
        } else
            Toast.info('请正确填写手机号', 0.7)
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog()
    }

    render() {
        const { getCodeText, second, current } = this.state,
            { style, className } = this.props;
        return (<div onClick={this.getCode} className={className} style={style}>{current === second ? getCodeText : `${current}秒后重新发送`}</div>)
    }
}