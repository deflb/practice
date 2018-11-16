import React, { Component } from 'react';
import { Route } from 'react-router';
import { createForm } from 'rc-form';
import { List, InputItem, TextareaItem, Button, Toast } from 'antd-mobile';
import fullScreen from '../../../component/fullScreen';
import CustomUpload from '../../../component/customUpload';
import asyncC from '../../../component/asyncC';
import { request } from '../../../request';
import api from '../../../request/api';
const SelectHouses = asyncC(() => import('./selectHouses'));

export default createForm()(fullScreen(class add extends Component {
    state = {
        houses: {
            name: '楼盘',
            id: '',
        }
    }

    selectHouses = () => {
        const { match, history } = this.props;
        history.push(match.path + '/selectHouses')
    }
    onPublish = () => {
        const { form, history } = this.props;
        form.validateFields((error, values) => {
            if (!error) {
                console.log(values);
                request({ url: api.saveHouseShow, data: values }).then(res => {
                    Toast.success('发布成功,请等待审核!', 1);
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = null;
                        history.goBack();
                    }, 1000)
                })
            }
        })
    }
    whichHouses = data => {
        this.setState({
            houses: {
                name: data.buildName,
                id: data.cityID
            }
        })
    }
    render() {
        const { houses } = this.state,
            { form, match } = this.props,
            { getFieldProps } = form;
        return (<div>
            <List>
                <InputItem
                    {...getFieldProps('title', {
                        rules: [
                            { required: true, message: '请输入标题' },
                        ],
                    })}
                    placeholder='标题'
                />
                <List.Item arrow="horizontal" onClick={this.selectHouses}>
                    <span className={houses.id ? null : 'shallowGreyColor'}>{houses.name}</span>
                </List.Item>
                <TextareaItem
                    {...getFieldProps('content', {
                        rules: [
                            { required: true, message: '请输入描述' },
                        ],
                    })}
                    placeholder='请详细描述一下你的家呗...'
                    rows={5}
                />
                <List.Item>
                    <CustomUpload
                        {...getFieldProps('files', {
                            rules: [
                                { required: false },
                            ],
                        })}
                        maxLength={5}
                    />
                </List.Item>
            </List>
            <Button type='primary' onClick={this.onPublish}>发布</Button>
            <Route path={match.path + '/selectHouses'} render={props => <SelectHouses {...props} whichHouses={this.whichHouses} />} />
        </div>)
    }
}))