import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'antd-mobile';
import { crm3_upload, request } from '../../request';
import api from '../../request/api';
import { fileaddress } from '../../request/baseURL';

export default class customUpload extends Component { // 可受控
    state = {
        count: 0
    }
    static propTypes = {
        useCrmUpload: PropTypes.bool, // 使用crm3.0上传接口 (false 使用 JAVA上传接口)
        accept: PropTypes.string,
        maxLength: PropTypes.number,
        getLength: PropTypes.func, // 获取个数
        onChange: PropTypes.func,
    }

    static defaultProps = {
        useCrmUpload: true,
        accept: 'image/*,video/*',
        maxLength: 10,
        getLength: function () { },
        onChange: function () { }
    }

    onChange = (fileList, type, index) => {
        let { useCrmUpload, maxLength, getLength, onChange } = this.props,
            { count } = this.state,
            len = fileList.length;
        if (type === 'add') {
            let _count = count + 1;
            if (_count > maxLength) return
            this.setState({ count: _count })
            let uploadRow = fileList[len - 1], formData = new FormData();
            function updateData(value, res) { // value需为已更新的 (onChange 的循环执行在同步执行栈 ajax,setState为异步任务在事件队列)
                let _value = value ? [
                    ...value,
                    { ...res, url: uploadRow.url, fileUrl: res.url }
                ] : [{ ...res, url: uploadRow.url, fileUrl: res.url }];
                getLength(_value.length)
                onChange(_value)
            }
            if (useCrmUpload) {
                formData.append('imgFile', uploadRow.file);
                crm3_upload.post(api.crmUploadFile, formData).then(res => {
                    updateData(this.props.value, res)
                }).catch(err => { })
            } else {
                formData.append('file', uploadRow.file);
                request({
                    url: api.fileUpload, data: formData,
                    config: {
                        baseURL: fileaddress
                    }
                }).then(res => { updateData(this.props.value, res) }).catch(err => { })
            }
        }
        if (type === 'remove') {
            let _files = [...this.props.value];  // 同上
            _files.splice(index, 1);
            getLength(_files.length)
            onChange(_files)
            this.setState({ count: count - 1 })
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