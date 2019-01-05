import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { createForm } from 'rc-form';
import { Icon, InputItem, Button, Toast, List } from 'antd-mobile';
import { regExp } from '../../utlis';
import { request } from '../../request';
import api from '../../request/api';
import { getUserInfo } from '../../store/action';
import styles from './index.less';
const Wrap = ({ children, onClick, className }) => (<div role='dialog' className={className ? `${styles.wrap} ${className}` : styles.wrap} onClick={onClick}>
    {React.cloneElement(children, { onClick: e => { e.stopPropagation() } })}
</div>);

class CustomModal extends Component {
    static propTypes = {
        maskClosable: PropTypes.bool,
        visible: PropTypes.bool,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        onClose: PropTypes.func,
    }
    static defaultProps = {
        maskClosable: true,
        visible: false,
        title: '提示',
        onClose: function () { }
    }
    renderDialog = (visible) => {
        let { maskClosable, className, style, title, onClose, children } = this.props;
        if (visible) {
            this.getContainer();
            ReactDOM.render(<Wrap onClick={() => { maskClosable && onClose() }}>
                <ul className={className ? `${styles.normal} ${className}` : styles.normal} style={style}>
                    <li className={styles.normal_header}>
                        <span className={styles.normal_header_title}>{title}</span>
                        <Icon type='cross-circle'
                            onClick={onClose}
                            className={styles.normal_header_icon} />
                    </li>
                    <li className={styles.normal_content}>
                        {children}
                    </li>
                </ul>
            </Wrap>, this.container)
        } else
            this.removeContainer()
    }
    getContainer = () => {
        if (!this.container) {
            var container = document.createElement('div');
            document.body.appendChild(container);
            this.container = container;
        }
    };
    removeContainer = () => {
        if (this.container) {
            ReactDOM.unmountComponentAtNode(this.container);
            document.body.removeChild(this.container);
            this.container = null;
        }
    }
    componentDidMount() {
        if (this.props.visible)
            this.renderDialog(true);
    }

    componentWillReceiveProps(nextProps) {
        this.renderDialog(nextProps.visible);
    }

    componentWillUnmount() {
        this.removeContainer()
    }

    render() {
        return null;
    }
}

// 以下为方法类dialog 简单易用 注意：由于不受生命周期控制，须在调用页面生命周期componentWillUnmount进行卸载
let alert_container = null,
    withdraw_container = null,
    verify_container = null;
function unmountAlert() {
    if (alert_container) {
        ReactDOM.unmountComponentAtNode(alert_container)
        document.body.removeChild(alert_container)
        alert_container = null;
    }
}
function unmountWithdraw() {
    if (withdraw_container) {
        ReactDOM.unmountComponentAtNode(withdraw_container)
        document.body.removeChild(withdraw_container)
        withdraw_container = null;
    }
}
function unmountVerify() {
    if (verify_container) {
        ReactDOM.unmountComponentAtNode(verify_container)
        document.body.removeChild(verify_container)
        verify_container = null;
    }
}
function unmountFnDialog() { // 移除所有 供调用页面使用
    unmountAlert();
    unmountWithdraw();
    unmountVerify();
};
CustomModal.unmountFnDialog = unmountFnDialog;
// 提示
CustomModal.alert = ({ maskClosable = true, title = '提示', message = '', actions = [{ text: '取消' }, { text: '确认' }] }) => {
    alert_container = document.createElement('div');
    document.body.appendChild(alert_container);
    // 样式：am-swipe-actions 只是为了清除dialog的touchstart对SwipeAction的影响(请阅读SwipeAction源码)
    ReactDOM.render(<Wrap className='am-swipe-actions' onClick={() => { maskClosable && unmountAlert() }}>
        <ul className={styles.alert}>
            <li className={styles.alert_header}>
                {title}
            </li>
            <li className={styles.alert_content}>
                {message}
            </li>
            <li className={styles.alert_footer}>
                {actions.map(item => <span key={item.text} onClick={() => {
                    unmountAlert();
                    item.onPress && item.onPress();
                }}>{item.text}</span>)}
            </li>
        </ul>
    </Wrap>, alert_container);
}
// 提现
const Withdraw = createForm()(class _withdraw extends Component {
    onConfirm = () => {
        let { onConfirm, form } = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                onConfirm(values);
                unmountWithdraw();
            }
        })
    }
    render() {
        let { getFieldProps } = this.props.form;
        return <Wrap>
            <ul className={styles.withdraw}>
                <li className={styles.withdraw_header}>
                    <span className={styles.withdraw_header_title}>提现</span>
                    <Icon type='cross-circle'
                        onClick={unmountWithdraw}
                        className={styles.withdraw_header_icon} />
                </li>
                <li className={styles.withdraw_content}>
                    <div className={styles.withdraw_content_title}>提现到微信钱包</div>
                    <InputItem
                        {...getFieldProps('money', {
                            rules: [
                                { required: true },
                            ],
                            normalize: (v, prev) => {
                                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                                    if (v === '.') {
                                        return '0.';
                                    }
                                    return prev;
                                }
                                return v;
                            },
                        })}
                        placeholder='输入金额'
                        type='money'
                        clear
                        moneyKeyboardAlign='left'
                        extra='元'
                    />
                    <InputItem
                        {...getFieldProps('password', {
                            rules: [
                                { required: true },
                            ],
                        })}
                        placeholder='支付密码'
                        type='password'
                        clear
                    />
                    <Button type='warning' className={styles.withdraw_content_btn} onClick={this.onConfirm}>确定</Button>
                </li>
            </ul>
        </Wrap>
    }
})
CustomModal.withdraw = (onConfirm = () => { }) => {
    withdraw_container = document.createElement('div');
    document.body.appendChild(withdraw_container);
    ReactDOM.render(<Withdraw onConfirm={onConfirm} />, withdraw_container);
}
// 验证
const VerifyModal = createForm()(class _verifyModal extends Component {
    state = {
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
    getCode = e => {
        e.stopPropagation();
        const { current, second } = this.state;
        if (current !== second) return
        const phone = this.props.form.getFieldValue('phone');
        if (!phone) {
            Toast.info('请输入手机号', 0.7)
            return
        }
        const formatPhone = phone.replace(regExp.removeEmpty, '');
        if (regExp.phone.test(formatPhone)) {
            CustomModal.alert({
                title: '确认手机号码', message: <ul><li>我们将发送验证码短信到：</li><li>{phone}</li></ul>, actions: [
                    { text: '取消' },
                    {
                        text: '好', onPress: () => {
                            request({ url: api.sendValidCode, data: { phone: formatPhone, user: this.props.userInfo.name } }).then(res => {
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
    onOk = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const phone = values.phone.replace(regExp.removeEmpty, '');
                if (!regExp.phone.test(phone)) {
                    Toast.info('请正确填写手机号', 0.7);
                    return
                }
                request({ url: api.bindPhone, data: { phone, validCode: values.validCode } }).then(res => {
                    Toast.success('验证成功!', 0.7);
                    this.props.dispatch(getUserInfo()); // 完成验证 更新用户信息
                    unmountVerify();
                }).catch(err => { })
            } else {
                if (error.phone) {
                    Toast.info('请输入手机号', 0.7);
                    return
                }
                if (error.validCode) {
                    Toast.info('请输入验证码', 0.7);
                    return
                }
            }
        })
    }
    render() {
        const { getCodeText, second, current } = this.state,
            { getFieldProps } = this.props.form;
        return (<Wrap>
            <div className={styles.verify}>
                <div className={styles.verify_header}>
                    <span className={styles.verify_header_title}>验证手机</span>
                    <Icon type='cross-circle'
                        onClick={unmountVerify}
                        className={styles.verify_header_icon} />
                </div>
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
                <Button type='warning' className={styles.verify_btn} onClick={this.onOk}>验证</Button>
            </div>
        </Wrap>)
    }
})
CustomModal.verify = ({ dispatch, userInfo }) => {
    if (userInfo.isAuth === 1)
        return true;
    verify_container = document.createElement('div');
    document.body.appendChild(verify_container);
    ReactDOM.render(<VerifyModal dispatch={dispatch} userInfo={userInfo} />, verify_container);
    return false;
}

export default CustomModal;