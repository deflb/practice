import React, { Component } from 'react';
import { createForm } from 'rc-form';
import routerBase from '../../router/routerBase';
import { List, InputItem, TextareaItem, Toast } from 'antd-mobile';
import CustomModal from '../../component/customModal';
import EnabledIosScrollView from '../../component/enabledIosScrollView';
import { request } from '../../request';
import api from '../../request/api';
import { regExp } from '../../utlis';
import styles from './reportBusiness.less';
import PcdPicker from '../../component/customPicker/pcdPicker';
import GuidePicker from './guidePicker';
import wxConfig from '../../utlis/wxConfig';
import wx from 'weixin-js-sdk';
const { alert } = CustomModal;

export default createForm()(class reportBusiness extends Component {
    state = {
        // 所在区域
        area: [],
        // 报备人奖励
        reporterReward: {},
        // phone
        phone: null,
        // 客户信息
        customerInfo: {},
        // 导购员信息
        guideInfo: {},
    }
    onCancel = () => {
        this.setState({ visible: false })
    }

    componentDidMount() {
        this.getReporterReward();
        wxConfig({ wx, jsApiList: ['chooseImage'] })
    }

    wxupload = () => {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                console.log(res)
            }
        })
    }

    getReporterReward = () => {
        request({ url: api.getReporterReward }).then(res => {
            this.setState({ reporterReward: res })
        })
    }

    submit = () => {
        if (false) {
            alert({
                message: '对不起，该客户目前已存在商机',
                actions: [
                    { text: '知道了' }
                ]
            })
            return
        }
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const { phone, area } = this.state;
                if (!phone) { Toast.info('请输入手机号', 0.7); return };
                const formatPhone = phone.replace(regExp.removeEmpty, '');
                if (!regExp.phone.test(formatPhone)) { Toast.info('请正确输入手机号', 0.7); return };
                if (!area.length) { Toast.info('请选择区域', 0.7); return };
                alert({
                    message: '确认提交吗？',
                    actions: [
                        { text: '取消' },
                        {
                            text: '提交', onPress: () => {
                                const formatArea = area.map(item => item.id), [provinceId, cityId, districtId] = formatArea;
                                request({ url: api.saveBusiness, data: { ...values, phone: formatPhone, provinceId, cityId, districtId } }).then(res => {
                                    Toast.success('报备成功', 0.7)
                                })
                            }
                        }]
                })
            }
        })
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        let { area, reporterReward, phone, customerInfo, guideInfo } = this.state, { history, form } = this.props,
            { getFieldProps } = form;
        return (<div className={styles.wrapper}>
            <ul className={styles.wrapper_header}>
                <li><span className='redColor'>报备</span>  >  确认  > 奖励</li>
                <li onClick={() => {
                    history.push(routerBase + '/personalCenter/myBusinessReport')
                }}>查看我的报备记录></li>
            </ul>
            <EnabledIosScrollView>
                <div className={styles.wrapper_content}>
                    <p style={{ marginBottom: 15 }}>客户信息</p>
                    <List style={{ marginBottom: 7 }}>
                        <InputItem
                            value={phone}
                            onChange={phone => { // 手机获取客户信息
                                this.setState({ phone });
                                clearTimeout(this.timer);
                                this.timer = setTimeout(() => {
                                    const _phone = phone.replace(regExp.removeEmpty, '');
                                    if (regExp.phone.test(_phone))
                                        request({ url: api.getCustomerInfo, data: { phone: _phone } }).then(res => {
                                            this.setState({ customerInfo: res || {} })
                                        })
                                }, 300)
                            }}
                            placeholder='手机号码'
                            type='phone'
                            labelNumber={1}>
                            <i className='iconfont icon-phone' />
                        </InputItem>
                    </List>
                    <List style={{ marginBottom: 7 }}>
                        <InputItem
                            {...getFieldProps('name')}
                            placeholder='称呼'
                            type='text'
                            labelNumber={1}
                            disabled={customerInfo.isOld}
                        >
                            <i className='iconfont icon-user' />
                        </InputItem>
                    </List>
                    <List style={{ marginBottom: 7 }}>
                        <PcdPicker
                            value={area}
                            onChange={area => { this.setState({ area }) }}
                            disabled={customerInfo.isOld}
                        >
                            <List.Item disabled={customerInfo.isOld} thumb={<i className='iconfont icon-user' />} arrow="horizontal">
                                {area.length ? area.map(item => item.name).join(',') : <span style={{ color: '#bbb' }}>所在区域</span>}
                            </List.Item>
                        </PcdPicker>
                    </List>
                    <List>
                        <TextareaItem
                            {...getFieldProps('demand')}
                            rows={4}
                            title={<i className='iconfont icon-user' />}
                            placeholder='客户需求'
                            labelNumber={1}
                        />
                    </List>
                    <p style={{ margin: '15px 0' }} onClick={this.wxupload}>指定导购员</p>
                    <List>
                        <GuidePicker
                            value={guideInfo}
                            onChange={guideInfo => { this.setState({ guideInfo }) }}
                            disabled={customerInfo.isOld}
                        >
                            <List.Item thumb={<i className='iconfont icon-user' />} arrow="horizontal">
                                {guideInfo.guideName || ''}{guideInfo.guideAvatar ? <img src={guideInfo.guideAvatar} alt='' /> : null}
                            </List.Item>
                        </GuidePicker>
                    </List>
                    <div className={styles.wrapper_content_reward}>商机奖励<span>{reporterReward.reward}元</span><span>标准: {reporterReward.standardReward}元</span></div>
                    <p className={styles.wrapper_content_extra}>确认商机后，您可获得最高{reporterReward.reward}元、{reporterReward.rewardScore}积分；客户成交后将获得提成：成交额x3%</p>
                </div>
            </EnabledIosScrollView>
            <div className={styles.wrapper_footer} role='button' onClick={this.submit}>提交</div>
        </div>)
    }
})