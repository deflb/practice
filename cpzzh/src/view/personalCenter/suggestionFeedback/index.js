import React, { Component } from 'react';
import { createForm } from 'rc-form';
import { List, TextareaItem, Button, WingBlank, Toast } from 'antd-mobile';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomUpload from '../../../component/customUpload';
import { request } from '../../../request';
import api from '../../../request/api';
import styles from './index.less';

export default createForm()(class suggestionFeedback extends Component {
    state = {
        length: 0,
        maxLength: 10,
    }

    saveFeedback = () => {
        this.props.form.validateFields({ force: true }, (error, values) => {
            if (!error) {
                const { ffeedtext, imgList } = values;
                request({
                    url: api.saveFeedback, data: { ffeedtext, imgList: imgList.map(item => item.fileName) }
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
        const { length, maxLength } = this.state,
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
                <List renderHeader={() => <div className={styles.wrapper_upload_header}>拍照上传<span className={styles.wrapper_upload_header_tip}>{`（${length}/${maxLength}）`}</span></div>}>
                    <List.Item>
                        <CustomUpload
                            {...getFieldProps('imgList', {
                                initialValue: [],
                                rules: [
                                    { required: false }
                                ],
                            })}
                            getLength={length => { this.setState({ length }) }}
                            maxLength={maxLength}
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