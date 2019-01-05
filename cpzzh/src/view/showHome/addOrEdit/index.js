import React, { Component } from 'react';
import { Route } from 'react-router';
import { createForm } from 'rc-form';
import { List, InputItem, Button, Toast, TextareaItem, WingBlank } from 'antd-mobile';
import fullScreen from '../../../component/fullScreen';
import CustomUpload from '../../../component/customUpload';
import asyncC from '../../../component/asyncC';
import { request } from '../../../request';
import api from '../../../request/api';
import whichImgLink from '../../../utlis/whichImgLink';
import styles from './index.less';
const SelectHouses = asyncC(() => import('./selectHouses'));

export default createForm()(fullScreen(class add extends Component {
    state = {
        building: '楼盘',
        buildingId: '',

        content: '',
        imgList: []
    }
    componentWillMount() {
        let { location } = this.props,
            { state } = location;
        if (state) {
            state.building && this.setState({ building: state.building });
            state.buildingId && this.setState({ buildingId: state.buildingId });
            if (state.content) {
                let matchAllSrcReg = /src=['"]?([^'"]*)['"]?/gi,
                    matchSrcReg = /src=['"]?([^'"]*)['"]?/i,
                    srcArr = state.content.match(matchAllSrcReg) || [],
                    imgList = srcArr.map(item => ({ url: item.match(matchSrcReg)[1] }));
                imgList && this.setState({ imgList });
                this.setState({ content: state.content.split('<div data-flag>')[0] })
            }
        }
    }

    selectHouses = () => {
        const { match, history } = this.props;
        history.push(match.path + '/selectHouses')
    }
    onPublish = () => {
        const { form, location, onComplete = function () { } } = this.props,
            { state = {} } = location;
        form.validateFields((error, values) => {
            if (!error) {
                let imgArr = values.imgList.map(item => `<img src='${whichImgLink(item.fileUrl || item.url)}' alt='' />`);
                values.content = values.content + '<div data-flag>' + imgArr.join('') + '</div>';
                values.buildingId = this.state.buildingId;
                delete values.imgList;
                if (state.id) values.id = state.id;
                request({ url: api.saveHouseShow, data: values }).then(res => {
                    Toast.success('发布成功,请等待审核!', 1);
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = null;
                        onComplete();
                    }, 1000)
                })
            }
        })
    }
    whichHouses = data => {
        this.setState({
            building: data.name,
            buildingId: data.id
        })
    }
    render() {
        let { building, buildingId, content, imgList } = this.state,
            { form, match, location } = this.props,
            { state = {} } = location,
            { getFieldProps } = form;
        return (<div className={styles.wrapper}>
            <List>
                <InputItem
                    {...getFieldProps('title', {
                        initialValue: state.title,
                        rules: [
                            { required: true, message: '请输入标题' },
                        ],
                    })}
                    placeholder='标题'
                />
                <List.Item arrow="horizontal" onClick={this.selectHouses}>
                    <span className={buildingId ? null : 'shallowGreyColor'}>{building}</span>
                </List.Item>
                <TextareaItem
                    className={styles.wrapper_content}
                    {...getFieldProps('content', {
                        initialValue: content,
                        rules: [
                            { required: true, message: '请详细描述一下你的家呗' },
                        ],
                    })}
                    rows={6}
                    placeholder='请详细描述一下你的家呗...'
                />
            </List>
            <CustomUpload
                {...getFieldProps('imgList', {
                    initialValue: imgList,
                    rules: [
                        { required: false }
                    ],
                })}
                useCrmUpload={false}
                accept='image/*'
            />
            <WingBlank><Button type='primary' onClick={this.onPublish}>发布</Button></WingBlank>
            <Route path={match.path + '/selectHouses'} render={props => <SelectHouses {...props} whichHouses={this.whichHouses} />} />
        </div>)
    }
}))