import React, { Component } from 'react';
// import { createForm } from 'rc-form';
import { List, TextareaItem, Button, WingBlank, Toast } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomImageUpload from '../../../component/customImageUpload';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';

export default class suggestionFeedback extends Component {
    state = {
        imgList: [],
        maxLength: 10,
    }

    saveFeedback = () => {
        request({
            url: api.saveFeedback, data: { ffeedtext: '反馈一下反馈一下反馈一下反馈一下反馈一下反馈一下', imgList: this.state.imgList.map(item => item.fileName) }
        }).then(res => {
            Toast.success('提交成功!', 1)
            let timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                this.props.history.goBack()
            }, 1000)
        }).catch(err => { })
    }

    render() {
        const { imgList, maxLength } = this.state,
            len = imgList.length;
        return (
            <div className={styles.wrapper}>
                <List>
                    <TextareaItem
                        rows={5}
                        count={100}
                        placeholder='请输入反馈内容'
                    />
                </List>
                <List renderHeader={() => <div className='titleFontSizeC'>拍照上传<span className='textFontSizeC shallowGreyColor'>{`（${len}/${maxLength}）`}</span></div>}>
                    <List.Item>
                        <CustomImageUpload
                            maxLength={10}
                            changeHandle={(val) => {
                                this.setState({
                                    imgList: val
                                })
                            }}
                            selectable={len < maxLength}
                            files={imgList}
                        />
                    </List.Item>
                </List>
                <CustomWhiteSpace />
                <WingBlank><Button type='primary' onClick={e => {
                    this.saveFeedback()
                }}>提交</Button></WingBlank>
            </div>
        );
    }
}