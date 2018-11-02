import React, { Component } from 'react';
import { ImagePicker,TextareaItem ,Form
    ,Picker,InputItem, List,DatePicker, Button } from 'antd-mobile';
import styles  from './apply.less';
import CustomImageUpload from '../../../component/customImageUpload';
// import { connect } from 'react-redux';
import { request } from '../../../request';
import api from '../../../request/api';
// const FormTaskApply = Form.create()(taskApply);
export default class apply extends Component {
    state = {
        files:[],
        multiple:true,
        BaseDataList:[],
        PickerValue:'',
        storeId:'',
        textareaValue:''
    }
    componentDidMount(){
        this.init()
    }
    init=()=>{
          //获取下拉
          request({ url: api.getBaseDataList,
                    data: { type:'CRM140_fClmTypeID' }
             }).then(res => {
            let arr =[];
            res.forEach((item,index)=>{
                arr.push({
                    label:item.fdesc,
                    value:item.fcode
                })
            })
            this.setState({ BaseDataList: arr })
        }).catch(err => { console.log(err) })
    }
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
          files,
        });
      }
      sqOk =(val)=>{
       
        this.setState({PickerValue:val})
      }
      commit =()=>{
        let url ="/storejps/claim/save",
            {storeId,PickerValue,datePickerValue,textareaValue,files} =this.state;
        let imgList = [];
        files.forEach(item=>{
            imgList.push(item.fileUrl)
        })
         let data={
                custproblem:textareaValue,
                fasksettledate:String(datePickerValue.getTime()),
                fclmtypeid:PickerValue,
                fordid:storeId,
                imgList:imgList
            };
        request({url,data}).then(res=>{
            
        })
      }
    render() {
        let {files,storeId,datePickerValue,textareaValue} = this.state;
        
        return (
            <div className={styles.apply}>   
                <div className={styles.item}><InputItem value={storeId} onChange={(e)=>{
                    this.setState({
                        storeId:e
                    })                }}>订单号</InputItem></div>
                <div className={styles.item}>
                        <Picker data={this.state.BaseDataList} 
                        value = {this.state.PickerValue}
                        onOk={this.sqOk}
                        cols ={1} >
                            <List.Item arrow="horizontal">
                                诉求
                            </List.Item>
                        </Picker>
                    </div>
                <div className={styles.item +" "+styles.mb8}>
                        <DatePicker data={this.state.BaseDataList} 
                        value={datePickerValue}
                        onChange={(e)=>{
                            this.setState({datePickerValue:e})
                        }}>
                            <List.Item arrow="horizontal">
                                要求完成日期
                            </List.Item>
                        </DatePicker></div>
                <div className={styles.item}>
                    <List.Item >问题描述
                    <TextareaItem
                        placeholder="请输入问题描述"
                        data-seed="logId"
                        value={textareaValue}
                        onChange = {(e)=>{
                            this.setState({textareaValue:e})
                        }}
                        ref={el => this.autoFocusInst = el}
                        autoHeight
                    />
                    </List.Item>
                </div>
                <div className={styles.item}>
                <List.Item >
                拍照上传<span>({files.length}/10)</span>
                
                    <CustomImageUpload
                            maxLength={10}
                            changeHandle={(val) => {
                                this.setState({
                                    files: val
                                })
                            }}
                            selectable={files.length < 10}
                            files={files}
                        />

                    </List.Item>
                </div>
                <div className={styles.paddingbox}><Button type="primary" onClick={this.commit}>提交</Button></div>
            </div>
        );
    }
}