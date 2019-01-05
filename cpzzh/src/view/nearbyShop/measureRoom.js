import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { List, InputItem, Button, Toast, Picker } from 'antd-mobile';
import { regExp } from '../../utlis';
import whichImgLink from '../../utlis/whichImgLink';
import { request } from '../../request';
import api from '../../request/api';
import hasTransformFullScreen from '../../component/fullScreen/hasTransformFullScreen';
import CustomModal from '../../component/customModal';
import GetValidCode from '../../component/getValidCode';
import { saveUserInfo } from '../../store/action';
import styles from './measureRoom.less';
const { alert } = CustomModal;

export default hasTransformFullScreen(createForm()(class measureRoom extends Component {
    state = {
        province: [],
        currentProvince: { name: '选择省', id: '' },
        city: [],
        currentCity: { name: '选择市', id: '' },
        district: [],
        currentDistrict: { name: '选择区', id: '' },
    }
    componentDidMount() {
        document.title = '预约量房';
        this.getProvince();
    }
    getProvince = () => {
        request({ url: api.getProvinceJps }).then(res => {
            this.setState({ province: res ? res.map(item => ({ label: item.name, value: item.id + '=' + item.name })) : [] })
        })
    }
    getCity = provinceId => {
        request({ url: api.getCityJps, data: { provinceId } }).then(res => {
            this.setState({ city: res ? res.map(item => ({ label: item.name, value: item.id + '=' + item.name })) : [] })
        })
    }
    getDistrict = cityId => {
        request({ url: api.getDistrictJps, data: { cityId } }).then(res => {
            this.setState({ district: res ? res.map(item => ({ label: item.name, value: item.id + '=' + item.name })) : [] })
        })
    }
    submit = () => {
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const phone = values.fmobile.replace(regExp.removeEmpty, '');
                if (!regExp.phone.test(phone)) {
                    Toast.info('请正确填写手机号', 0.7);
                    return
                }
                alert({
                    message: '确认提交预约吗？',
                    actions: [
                        { text: '取消' },
                        {
                            text: '提交', onPress: () => {
                                const { currentProvince, currentCity, currentDistrict } = this.state,
                                    param = { fcname: values.fcname, fmobile: phone },
                                    { location, dispatch } = this.props,
                                    { state = {} } = location,
                                    { flag, fsalesid, customerId, fshopid, isAuth } = state;
                                param.fcstid = customerId;
                                if (flag === '设计师')
                                    param.fdesignerid = fsalesid;
                                if (flag === '顾问')
                                    param.fnavusrid = fsalesid;
                                if (!flag)
                                    param.fshopid = fshopid;
                                param.fprovinceid = currentProvince.id;
                                param.fcityid = currentCity.id;
                                param.fdistrictid = currentDistrict.id;
                                if (isAuth !== 1) {
                                    request({ url: api.bindPhone, data: { phone, validCode: values.validCode } }).then(() => { // 绑定
                                        request({ url: api.userInfo }).then(res => { // 获取用户信息
                                            dispatch(saveUserInfo(res)); // 更新用户信息
                                            param.fcstid = res.customerId;
                                            request({ url: api.appointMeasure, data: param }).then(() => {
                                                Toast.success('提交成功', 0.7);
                                                let timer = setTimeout(() => {
                                                    this.props.history.goBack();
                                                    clearTimeout(timer)
                                                    timer = null
                                                }, 700)
                                            })
                                        })
                                    })
                                } else
                                    request({ url: api.appointMeasure, data: param }).then(res => {
                                        Toast.success('提交成功', 0.7);
                                        let timer = setTimeout(() => {
                                            this.props.history.goBack();
                                            clearTimeout(timer)
                                            timer = null
                                        }, 700)
                                    }).catch(err => { })
                            }
                        },
                    ]
                })
            } else {
                if (error.fcname) {
                    Toast.info('请输入姓名', 0.7);
                    return
                }
                if (error.fmobile) {
                    Toast.info('请输入手机号', 0.7);
                    return
                }
                if (error.validCode) Toast.info('请输入验证码', 0.7);
            }
        })
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        const { province, currentProvince, city, currentCity, district, currentDistrict } = this.state,
            { location, form } = this.props,
            { state = {} } = location,
            { getFieldProps } = form,
            { flag, fsalesname, fheadpic, isAuth, userName } = state;
        return (<div className={styles.wrapper}>
            <div className={styles.wrapper_tip}>
                {flag ? <div className={styles.wrapper_tip_container}>
                    <div className={styles.wrapper_tip_container_avator}>
                        {fheadpic ? <img src={whichImgLink(fheadpic)} alt='' /> : null}
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
                    {isAuth === 1 ? null : <InputItem
                        {...getFieldProps('validCode', {
                            rules: [
                                { required: true, message: '请输入验证码' },
                            ],
                        })}
                        clear
                        labelNumber={1}
                        type='number'
                        placeholder='请输入验证码'
                        extra={<GetValidCode className={styles.getCode} userName={userName} getPhone={() => form.getFieldValue('fmobile')} />}
                    ><i className='iconfont icon-code' /></InputItem>}
                </List>
                <div className={styles.pcd}>
                    <Picker
                        value={[currentProvince.id + '=' + currentProvince.name]}
                        data={province}
                        cols={1}
                        title='省'
                        onOk={v => {
                            if (v[0] !== (currentProvince.id + '=' + currentProvince.name)) {
                                let id = v[0].split('=')[0],
                                    name = v[0].split('=')[1];
                                this.getCity(id);
                                this.setState({
                                    currentProvince: { id, name },
                                    currentCity: { id: '', name: '选择市' },
                                    currentDistrict: { id: '', name: '选择区' },
                                })
                            }
                        }}
                    >
                        <span>{currentProvince.name}</span>
                    </Picker>
                    <Picker
                        value={[currentCity.id + '=' + currentCity.name]}
                        data={city}
                        cols={1}
                        title="市"
                        onOk={v => {
                            if (v[0] !== currentCity.id + '=' + currentCity.name) {
                                let id = v[0].split('=')[0],
                                    name = v[0].split('=')[1];
                                this.getDistrict(id);
                                this.setState({
                                    currentCity: { id, name },
                                    currentDistrict: { id: '', name: '选择区' },
                                })
                            }
                        }}
                    >
                        <span>{currentCity.name}</span>
                    </Picker>
                    <Picker
                        value={[currentDistrict.id + '=' + currentDistrict.name]}
                        data={district}
                        cols={1}
                        title="区"
                        onOk={v => {
                            if (v[0] !== currentDistrict.id + '=' + currentDistrict.name)
                                this.setState({
                                    currentDistrict: {
                                        id: v[0].split('=')[0],
                                        name: v[0].split('=')[1]
                                    }
                                })
                        }}
                    >
                        <span>{currentDistrict.name}</span>
                    </Picker>
                </div>
                <Button className={styles.wrapper_content_button} type='warning' onClick={this.submit}>预约量房</Button>
                <p className={styles.wrapper_content_extra}>在您提交您的信息后，{flag ? `${fsalesname}${flag}将会及时跟进您的预约。并根据您的时间安排合适人员上门测量!` : '我们会尽快安排人员跟进您的预约。并根据您的时间安排合适人员上门测量'}</p>
            </div>
        </div>)
    }
}))