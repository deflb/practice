import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'antd-mobile';
import { request } from '../../request';
import api from '../../request/api';
import { fileaddress } from '../../request/baseURL';

export default class customUpload extends Component { // 可受控
    state = {
        count: 0
    }
    static propTypes = {
        accept: PropTypes.string,
        maxLength: PropTypes.number,
        getLength: PropTypes.func, // 获取个数
        onChange: PropTypes.func,
    }

    static defaultProps = {
        accept: 'image/*,video/*',
        maxLength: 10,
        getLength: function () { },
        onChange: function () { }
    }

    onChange = (fileList, type, index) => {
        let { maxLength, getLength, onChange } = this.props,
            { count } = this.state,
            len = fileList.length;
        if (type === 'add') {
            let _count = count + 1;
            if (_count > maxLength) return
            this.setState({ count: _count })
            let uploadRow = fileList[len - 1], formData = new FormData();
            formData.append('file', uploadRow.file)
            request({
                url: api.fileUpload, data: formData,
                config: {
                    baseURL: fileaddress
                }
            }).then(res => {
                const { value } = this.props,
                    _value = value ? [
                        ...value, // 获取已更新的 (onChange 的循环执行在同步执行栈 ajax,setState为异步任务在事件队列)
                        { ...res, url: uploadRow.url, fileUrl: res.url }
                    ] : [{ ...res, url: uploadRow.url, fileUrl: res.url }];
                getLength(_value.length)
                onChange(_value)
            }).catch(err => { })
        }
        if (type === 'remove') {
            request({
                url: api.fileDelete, data: { url: this.props.value[index].fileUrl },
                config: {
                    baseURL: fileaddress
                }
            }).then(res => {
                let _files = [...this.props.value];  // 同上
                _files.splice(index, 1);
                getLength(_files.length)
                onChange(_files)
                this.setState({ count: count - 1 })
            }).catch(err => { })
        }
    }
    render() {
        const { count } = this.state,
            { value, maxLength, accept } = this.props;
        return <ImagePicker
            multiple
            accept={accept}
            selectable={count < maxLength}
            files={value}
            onChange={this.onChange}
        />
    }
}