import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, List, InputItem, DatePicker, Toast } from 'antd-mobile';
import EnabledIosScrollView from '../../component/enabledIosScrollView';
import CustomModal from '../../component/customModal';
import { createForm } from 'rc-form';
import { request } from '../../request';
import api from '../../request/api';
import { formatDate, regExp } from '../../utlis';
import styles from './index.less';
const { alert } = CustomModal;

export default connect(state => ({
    userInfo: state.userInfo
}))(createForm()(class activity extends Component {
    state = {
        id: '',
        detail: {},
        installtime: null,
    }
    componentWillMount() {
        let search = window.location.search,
            match = search.match(/(\?|&)id=([^&]*)/),
            id = match ? match[2] : '';
        if (id) {
            this.setState({ id });
            request({ url: api.activityDetail, data: { id } }).then(res => {
                document.title = res.name || '';
                this.setState({ detail: res })
            })
        }
    }
    submit = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                alert({
                    message: '确认提交?',
                    actions: [
                        { text: '取消' },
                        {
                            text: '提交', onPress: () => {
                                let { mobile, installtime } = values;
                                values.activityId = this.state.id;
                                values.cstId = this.props.userInfo.customerId;
                                if (mobile) values.mobile = mobile.replace(regExp.removeEmpty, '')
                                if (installtime) values.installtime = formatDate(installtime);
                                request({ url: api.saveCustomerActivity, data: values }).then(res => {
                                    Toast.success('提交成功，我们会尽快与您联系', 0.8);
                                    this.props.form.resetFields();
                                })
                            }
                        },
                    ]
                })
            } else
                Toast.fail('请填写必填项', 0.7)
        })
    }
    getDay = (begin, end) => {
        let seconds = 0, minutes = 0, hours = 0, days = 0;
        if (begin && end) {
            // 处理 safari 内核兼容问题
            const bt = new Date(begin.replace(/\s/, 'T')).getTime(),
                et = new Date(end.replace(/\s/, 'T')).getTime(),
                ds = et - bt;
            if (ds > 0) {
                seconds = parseInt(ds / 1000 % 60);
                minutes = parseInt(ds / 1000 / 60 % 60);
                hours = parseInt(ds / 1000 / 60 / 60 % 24);
                days = parseInt(ds / 1000 / 60 / 60 / 24);
            }
        }
        return `${days}天${hours}时${minutes}分${seconds}秒`;
    }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        let { detail } = this.state,
            { buttonName, content, beginTime, endTime, timeStatus } = detail,
            fieldNameParam = detail.fieldNameParam || {},
            fieldMobileParam = detail.fieldMobileParam || {},
            fieldInstalltimeParam = detail.fieldInstalltimeParam || {},
            fieldHousetypeParam = detail.fieldHousetypeParam || {},
            fieldBudgetParam = detail.fieldBudgetParam || {},
            fieldAreaParam = detail.fieldAreaParam || {},
            fieldAddressParam = detail.fieldAddressParam || {},
            { getFieldProps } = this.props.form;
        return (<div className={styles.wrapper}>
            <EnabledIosScrollView className={styles.wrapper_content}>
                <div dangerouslySetInnerHTML={{ __html: content }} style={{ padding: '4px 15px' }} className='rich_text_global' />
                {timeStatus === 1 ? <div className={styles.activity_time}>活动剩余时间：{this.getDay(beginTime, endTime)}</div> : null}
            </EnabledIosScrollView>
            <div className={styles.wrapper_footer}>
                <EnabledIosScrollView className={styles.wrapper_footer_form}>
                    <List>
                        {fieldNameParam.showStatus === 1 ? <InputItem
                            {...getFieldProps('name', {
                                rules: [
                                    { required: fieldNameParam.requiredStatus === 1 ? true : false },
                                ]
                            })}
                            clear
                            placeholder={`请输入您的姓名${fieldNameParam.requiredStatus === 1 ? '(必填)' : ''}`}
                        /> : null}
                        {fieldMobileParam.showStatus === 1 ? <InputItem
                            {...getFieldProps('mobile', {
                                rules: [
                                    { required: fieldMobileParam.requiredStatus === 1 ? true : false },
                                ]
                            })}
                            type='phone'
                            clear
                            placeholder={`请输入您的手机号${fieldMobileParam.requiredStatus === 1 ? '(必填)' : ''}`}
                        /> : null}
                        {fieldHousetypeParam.showStatus === 1 ? <InputItem
                            {...getFieldProps('housetype', {
                                rules: [
                                    { required: fieldHousetypeParam.requiredStatus === 1 ? true : false },
                                ]
                            })}
                            clear
                            placeholder={`请输入户型${fieldHousetypeParam.requiredStatus === 1 ? '(必填)' : ''}`}
                        /> : null}
                        {fieldAreaParam.showStatus === 1 ? <InputItem
                            {...getFieldProps('area', {
                                rules: [
                                    { required: fieldAreaParam.requiredStatus === 1 ? true : false },
                                ]
                            })}
                            clear
                            placeholder={`请输入面积${fieldAreaParam.requiredStatus === 1 ? '(必填)' : ''}`}
                        /> : null}
                        {fieldInstalltimeParam.showStatus === 1 ? <DatePicker
                            mode='date'
                            title='预计装修日期'
                            {...getFieldProps('installtime', {
                                rules: [
                                    { required: fieldInstalltimeParam.requiredStatus === 1 ? true : false },
                                ],
                            })}
                        >
                            <List.Item arrow="horizontal">{`预计装修日期${fieldInstalltimeParam.requiredStatus === 1 ? '(必填)' : ''}`}</List.Item>
                        </DatePicker> : null}
                        {fieldAddressParam.showStatus === 1 ? <InputItem
                            {...getFieldProps('address', {
                                rules: [
                                    { required: fieldAddressParam.requiredStatus === 1 ? true : false },
                                ]
                            })}
                            clear
                            placeholder={`请输入所在地区${fieldAddressParam.requiredStatus === 1 ? '(必填)' : ''}`}
                        /> : null}
                        {fieldBudgetParam.showStatus === 1 ? <InputItem
                            {...getFieldProps('budget', {
                                rules: [
                                    { required: fieldBudgetParam.requiredStatus === 1 ? true : false },
                                ]
                            })}
                            type='digit'
                            clear
                            placeholder={`请输入购买预算${fieldBudgetParam.requiredStatus === 1 ? '(必填)' : ''}`}
                        /> : null}
                    </List>
                </EnabledIosScrollView>
                {buttonName ? <Button type='primary' onClick={this.submit}>{buttonName}</Button> : null}
            </div>
        </div>)
    }
}))