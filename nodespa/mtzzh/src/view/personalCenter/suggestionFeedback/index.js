import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { List, TextareaItem, Button, WingBlank, Toast } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomImageUpload from '../../../component/customImageUpload';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';

export default createForm()(class suggestionFeedback extends Component {
    state = {
        imgList: [],
        maxLength: 10,
    }

    saveFeedback = () => {
        this.props.form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                request({
                    url: api.saveFeedback, data: { ...values, imgList: this.state.imgList.map(item => item.fileName) }
                }).then(res => {
                    Toast.success('提交成功!', 1)
                    let timer = setTimeout(() => {
                        clearTimeout(timer)
                        timer = null
                        this.props.history.goBack()
                    }, 1000)
                }).catch(err => { })
            }
        })
    }

    render() {
        const { imgList, maxLength } = this.state,
            len = imgList.length,
            { getFieldProps } = this.props.form;
        return (
            <div className={styles.wrapper}>
                <List>
                    <TextareaItem
                        {...getFieldProps('ffeedtext', {
                            // initialValue: this.state.dpValue,
                            rules: [
                                { required: true, message: '请填写反馈内容' },
                                // { validator: this.validateDatePicker },
                            ],
                        })}
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
})