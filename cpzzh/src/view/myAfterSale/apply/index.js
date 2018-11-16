import React, { Component } from 'react';
import { TextareaItem ,Toast
    ,Picker,ActivityIndicator, List,DatePicker, Button } from 'antd-mobile';
import styles  from './apply.less';
import CustomImageUpload from '../../../component/customImageUpload';
import { connect } from 'react-redux';
import { request } from '../../../request';
import api from '../../../request/api';
// const FormTaskApply = Form.create()(taskApply);
export default connect(state => ({
    userInfo: state.userInfo
}))(class apply extends Component {
    state = {
        files:[],
        multiple:true,
        BaseDataList:[],
        PickerValue:'',
        orderId:'',
        textareaValue:'',
        orderNoList:[]
    }
    componentDidMount(){
        this.initOrderNoList()
        this.init();
        
    }
    initOrderNoList=()=>{
        let {location={}} = this.props,{state={}}=location;
        const {userInfo} =this.props;
        request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 10,fcstid:userInfo.customerId } }).then(res => {
                const { list=[] } = res;
                let arr =[];
                list.forEach(item=>{
                    // if(item.recerveStatusDesc!=="未接收")
                    arr.push( arr.push({
                        label:item.orderNo,
                        value:item.orderId
                    }))
                })
                console.log(state)
                this.setState({
                     orderNoList: arr,
                    orderId:state.orderId,
                    // orderNo:state.orderNo,
                    isLoading:false})
            }).catch(err => { 
                this.setState({
                    isLoading:false
                })
            })
      
    }
    init=()=>{
          //获取下拉
          request({ url: api.getBaseDataList,
                    data: { type:'CRM140_fClmTypeID' }
             }).then(res => {
            let arr =[];
            res.forEach(item=>{
                arr.push({
                    label:item.fdesc,
                    value:item.fcode
                })
            })
            this.setState({ BaseDataList: arr })
        }).catch(err => { console.log(err) })
    }
    onChange = (files,) => {
        this.setState({
          files,
        });
      }
      sqOk =(val)=>{
       
        this.setState({PickerValue:val})
      }
      orderOk =(val)=>{
        this.setState({orderId:val})
      }
      commit =()=>{
        let url ="/storejps/claim/save",
            {orderId,PickerValue,datePickerValue,textareaValue,files} =this.state;
        let imgList = [];
        files.forEach(item=>{
            imgList.push(item.fileUrl)
        })
         let data={
                custproblem:textareaValue,
                fasksettledate:this.getDate(datePickerValue),
                fclmtypeid:PickerValue[0],
                fordid:Number(orderId),
                imgList:imgList
            };
        request({url,data}).then(res=>{
            Toast.success(res.msg);
            this.toStart()

        })
      }
      toStart=()=>{
        const { history } = this.props;
        history.push({
            pathname: '/myAfterSale',
            state: {}
        })
    }
      getDate=(datePickerValue)=>{
        if(!datePickerValue||datePickerValue<1500000){
            return datePickerValue
        }
       return datePickerValue.toLocaleString().replace(/\//g,'-').slice(0,-10)
      }
    render() {
        let {files,orderId,datePickerValue,textareaValue,isLoading=true,orderNoList=[]} = this.state;
        return (
            <div className={styles.apply}>   
                <div className={styles.item}>
                <Picker data={orderNoList}
                 onOk={this.orderOk}
                 cols ={1} 
                 value={orderId} >
                    <List.Item arrow="horizontal">
                        订单号
                    </List.Item>
                </Picker>
                </div>
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
                <ActivityIndicator animating={isLoading} size="large" toast/>
            </div>
        );
    }
})