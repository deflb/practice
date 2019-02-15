import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'antd-mobile';
import { crm3_upload, request } from '../../request';
import api from '../../request/api';
import { fileaddress } from '../../request/baseURL';
import CustomModal from '../customModal';
const { preview } = CustomModal;

export default class customUpload extends Component { // 可受控
    state = {
        count: 0,
        newUrl:''
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
    dataURLtoFile (dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {type: mime})
      }
    changeImage =(files)=>{
        let that = this,formData = new FormData();
        // 选择的文件对象(file里只包含图片的体积，不包含图片的尺寸)
        var file = files.file;
        let {  getLength, onChange } = this.props;
      
        // 选择的文件是图片
        if(file.type.indexOf("image") === 0) {
            // 压缩图片需要的一些元素和对象
            var reader = new FileReader(),
                //创建一个img对象
                img = new Image();
            function updateData(value, res) { // value需为已更新的 (onChange 的循环执行在同步执行栈 ajax,setState为异步任务在事件队列)
                let _value = value ? [
                    ...value,
                    { ...res, url: files.url, fileUrl: res.url }
                ] : [{ ...res, url: files.url, fileUrl: res.url }];
                getLength(_value.length)
                onChange(_value)
            }
            reader.readAsDataURL(file);
            // 文件base64化，以便获知图片原始尺寸
            reader.onload = function(e) {
                img.src = e.target.result;
            };
    
            // base64地址图片加载完毕后执行
            img.onload = function () {
                // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
    
                // 图片原始尺寸
                var originWidth = this.width;
                var originHeight = this.height;
    
                // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
                var maxWidth = 300,
                    maxHeight = 300;
                // 目标尺寸
                var targetWidth = originWidth,
                    targetHeight = originHeight;
                // 图片尺寸超过300x300的限制
                if(originWidth > maxWidth || originHeight > maxHeight) {
                    if(originWidth / originHeight > maxWidth / maxHeight) {
                        // 更宽，按照宽度限定尺寸
                        targetWidth = maxWidth;
                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    }
                }
                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
    
                //压缩后的图片转base64 url
                /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
                 * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
                var newUrl = canvas.toDataURL('image/jpeg', 0.92);//base64 格式
                let newfile = that.dataURLtoFile(newUrl);
              
                formData.append('imgFile', newfile);
                crm3_upload.post(api.crmUploadFile, formData).then(res => {
                    updateData(that.props.value, res)
                }).catch(err => { })
                //也可以把压缩后的图片转blob格式用于上传
                // canvas.toBlob((blob)=>{
                //     console.log(blob)
                //     //把blob作为参数传给后端
                // }, 'image/jpeg', 0.92)
            };
        } else {
            alert('请上传图片格式');
        }
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
                this.changeImage(fileList[len - 1])
                // formData.append('imgFile', uploadRow.file);
                // crm3_upload.post(api.crmUploadFile, formData).then(res => {
                //     updateData(this.props.value, res)
                // }).catch(err => { })
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
    componentWillUnmount() {
        CustomModal.unmountFnDialog()
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
            onImageClick={(index, source) => { preview(source) }}
        />
    }
}