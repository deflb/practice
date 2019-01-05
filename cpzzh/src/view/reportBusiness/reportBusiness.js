import React, { Component } from 'react';
import { createForm } from 'rc-form';
import routerBase from '../../router/routerBase';
import { List, InputItem, TextareaItem, Picker, Modal } from 'antd-mobile';
import CustomModal from '../../component/customModal';
import CustomListView from '../../component/customListView';
import EnabledIosScrollView from '../../component/enabledIosScrollView';
import { request } from '../../request';
import api from '../../request/api';
import styles from './reportBusiness.less';

export default createForm()(class reportBusiness extends Component {
    state = {
        pcd: [],
        area: [],
        guideModalShow: false,

        pageNo: 1,
        pageSize: 10,
        hasMore: true,
        dataBlobs: [],
        loading: false,
        refreshing: false,
    }
    onCancel = () => {
        this.setState({ visible: false })
    }

    formatItemData = data => data.map((item, index) => ({ label: item.name, value: item.id + '&' + index }))
    getCity = provinceId => request({ url: api.getCity, data: { provinceId } })
    getDistrict = cityId => request({ url: api.getDistrict, data: { cityId } })
    getProvice = () => {
        if (!this.state.pcd.length)
            request({ url: api.getProvince }).then(province => { // 获取省份
                this.getCity(province[0].id).then(city => { // 获取第一个省份的城市
                    this.getDistrict(city[0].id).then(district => { // 获取第一个城市的区县
                        let _province = this.formatItemData(province),
                            _city = this.formatItemData(city),
                            _district = this.formatItemData(district);
                        _city[0].children = _district;
                        _province[0].children = _city;
                        this.setState({ pcd: _province, area: [_province[0].value, _city[0].value, _district[0].value] })
                    })
                })
            })
    }
    onPickerChange = (v) => {
        this.setState({ area: v })
        let { pcd } = this.state,
            [provinceInfo, cityInfo] = v,
            [provinceId, provinceIndex] = provinceInfo.split('&');
        if (!pcd[provinceIndex].children) { // 当前省份没注入过城市
            this.getCity(provinceId).then(city => { // 获取城市
                this.getDistrict(city[0].id).then(district => { // 获取第一个城市的区县
                    let _city = this.formatItemData(city),
                        _district = this.formatItemData(district);
                    _city[0].children = _district;
                    pcd[provinceIndex].children = _city;
                    this.setState({ pcd: [...pcd], area: [provinceInfo, _city[0].value, _district[0].value] })
                })
            })
        }
        if (cityInfo) {
            let [cityId, cityIndex] = cityInfo.split('&');
            if (!pcd[provinceIndex].children[cityIndex].children) { // 当前城市没注入过区县
                this.getDistrict(cityId).then(district => { // 获取区县
                    let _district = this.formatItemData(district);
                    pcd[provinceIndex].children[cityIndex].children = _district;
                    this.setState({ pcd: [...pcd], area: [provinceInfo, cityInfo, _district[0].value] })
                })
            }
        }
    }

    onEndReached = (event) => {
        const { loading, hasMore } = this.state;
        if (loading || !hasMore)
            return;
        // this.getList()
    }

    onRefresh = () => { }

    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    render() {
        let { dataBlobs, loading, refreshing, pcd, area, guideModalShow } = this.state, { history, form } = this.props,
            { getFieldProps } = form;
        return (<div className={styles.wrapper}>
            <ul className={styles.wrapper_header}>
                <li>报备  >  确认  > 奖励</li>
                <li onClick={() => {
                    history.push(routerBase + '/personalCenter/myBusinessReport')
                }}>查看我的报备记录></li>
            </ul>
            <EnabledIosScrollView>
                <div className={styles.wrapper_content}>
                    <p className={styles.wrapper_content_title}>客户信息</p>
                    <List>
                        <InputItem
                            {...getFieldProps('phone')}
                            placeholder='手机号码'
                            type='phone'
                            labelNumber={1}>
                            <i className='iconfont icon-phone' />
                        </InputItem>
                    </List>
                    <List>
                        <InputItem
                            {...getFieldProps('nikename')}
                            placeholder='称呼'
                            type='text'
                            labelNumber={1}
                        >
                            <i className='iconfont icon-user' />
                        </InputItem>
                    </List>
                    <List>
                        <Picker
                            value={area}
                            data={pcd}
                            title='选择区域'
                            onPickerChange={this.onPickerChange}
                        >
                            <List.Item onClick={this.getProvice} thumb={<i className='iconfont icon-user' />} arrow="horizontal">区域</List.Item>
                        </Picker>
                    </List>
                    <List>
                        <TextareaItem
                            {...getFieldProps('need')}
                            rows={4}
                            title={<i className='iconfont icon-user' />}
                            placeholder='客户需求'
                            labelNumber={1}
                        />
                    </List>
                    <p className={styles.wrapper_content_title}>指定导购员</p>
                    <List>
                        <List.Item thumb={<i className='iconfont icon-user' />} arrow="horizontal" onClick={() => {
                            this.setState({ guideModalShow: true })
                        }}>
                            吴亮
                    </List.Item>
                    </List>
                    <p className={styles.wrapper_content_title}>商机奖励120元</p>
                    <div className={styles.wrapper_content_extra}>
                        确认商机后，您可获得最高120元、1000积分；客户成交后将获得提成：成交额x3%
                </div>
                </div>
            </EnabledIosScrollView>
            <div className={styles.wrapper_footer} role='button' onClick={() => {
                CustomModal.alert({
                    message: '对不起，该客户目前已存在商机',
                    actions: [
                        { text: '知道了' }
                    ]
                })
            }}>提交</div>
            <Modal
                popup
                visible={guideModalShow}
                onClose={() => { this.setState({ guideModalShow: false }) }}
                animationType="slide-up"
            >
                <div className={styles.guide}>
                    <ul className={styles.guide_header}>
                        <li>取消</li>
                        <li>选择导购员</li>
                        <li>确定</li>
                    </ul>
                    <p>以下为 “南城区” 所有导购员</p>
                    <CustomListView
                        style={{ height: 250 }}
                        sectionBodyClassName={null}
                        loading={loading}
                        data={dataBlobs}
                        onEndReached={this.onEndReached}
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                        renderRow={(rowData, sectionID, index) => (<div />)}
                    />
                </div>
            </Modal>
        </div>)
    }
})