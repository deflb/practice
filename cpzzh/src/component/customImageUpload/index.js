import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import { fileaddress } from '../../request/baseURL';

export default class customImageUpload extends Component {

    static propTypes = {
        maxLength: PropTypes.number,
        changeHandle: PropTypes.func,
    }

    static defaultProps = {
        maxLength: 10,
        changeHandle: function () { }
    }

    onChange = (fileList, type, index) => {
        let { files, maxLength, changeHandle } = this.props,
            len = fileList.length;
        if (len > maxLength) return
        if (type === 'add') {
            let uploadRow = fileList[len - 1], formData = new FormData();
            formData.append('file', uploadRow.file)
            request({
                url: api.fileUpload, data: formData,
                config: {
                    baseURL: fileaddress
                }
            }).then(res => {
                changeHandle([
                    ...this.props.files, // 获取已更新的 (onChange 的循环执行在同步执行栈 ajax,setState为异步任务在事件队列)
                    { ...res, url: uploadRow.url, fileUrl: res.url }
                ])
            }).catch(err => { })
        }
        if (type === 'remove')
            request({
                url: api.fileDelete, data: { url: files[index].fileUrl },
                config: {
                    baseURL: fileaddress
                }
            }).then(res => {
                let _files = [...this.props.files];  // 同上
                _files.splice(index, 1);
                changeHandle(_files)
            }).catch(err => { })
    }
    render() {
        return <ImagePicker
            multiple
            accept="image/*,video/*"
            {...this.props}
            onChange={this.onChange}
        />
    }
}