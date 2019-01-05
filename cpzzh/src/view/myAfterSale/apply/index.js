import React, { Component } from 'react';
import { TextareaItem ,Toast
    ,Picker, List,DatePicker, Button } from 'antd-mobile';
import styles  from './apply.less';
import CustomUpload from '../../../component/customUpload';
import { connect } from 'react-redux';
import { request } from '../../../request';
import api from '../../../request/api';
import { formatDate } from '../../../utlis';
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
        orderNoList:[],
    }
    componentDidMount(){
        this.initOrderNoList()
        this.init();
      
    }
    initOrderNoList=()=>{
        let {location={}} = this.props,{state={}}=location;
        const {userInfo} =this.props;
        request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 10,fcstid:userInfo.customerId,fordtype:1 } }).then(res => {
                const { list=[] } = res;
                let arr =[];
                list.forEach(item=>{
                     arr.push({
                        label:item.orderNo,
                        value:item.orderId
                    })
                })
                this.setState({
                     orderNoList: arr,
                    orderId:state.orderId,
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
        if(Array.isArray(orderId)){
            orderId =orderId[0].toString()
        }
         let data={
                custproblem:textareaValue,
                fasksettledate:this.getDate(datePickerValue),
                fclmtypeid:PickerValue[0],
                fordid:orderId,
                imgList:imgList
            };
        request({url,data}).then(res=>{
            Toast.success(res.msg);
            this.toStart()

        })
      }
      toStart=()=>{
        this.props.history.goBack()
    }
      getDate=(datePickerValue)=>{
        if(!datePickerValue||datePickerValue<1500000){
            return datePickerValue
        }
        return formatDate(new Date(datePickerValue),"YYYY-MM-DD")
      }
      getHeight=()=>{
        return document.documentElement.clientHeight-150
    }
    render() {
        let {files,orderId,datePickerValue,textareaValue,orderNoList=[]} = this.state;
        return (<div className={styles.apply}>   
                <div className={styles.item+" "+styles.header}>
                <Picker data={orderNoList}
                 onOk={this.orderOk}
                 cols ={1} 
                 value={orderId} >
                    <List.Item arrow="horizontal">
                    {(<span className="normalFontSizeC">订单号</span>)}
                    </List.Item>
                </Picker>
                </div>
                <div className={styles.body}  >
                <div className={styles.item+" normalFontSizeC"}>
                        <Picker data={this.state.BaseDataList} 
                        value = {this.state.PickerValue}
                        onOk={this.sqOk}
                        cols ={1} >
                            <List.Item arrow="horizontal">
                            {(<span className="normalFontSizeC">诉求</span>)}
                            </List.Item>
                        </Picker>
                    </div>
                <div className={styles.item +" normalFontSizeC"+styles.mb8}>
                        <DatePicker data={this.state.BaseDataList} 
                        value={datePickerValue}
                        mode="date"
                        onChange={(e)=>{
                            this.setState({datePickerValue:e})
                        }}>
                            <List.Item arrow="horizontal">
                            {(<span className="normalFontSizeC">要求完成日期</span>)}
                            </List.Item>
                        </DatePicker></div>
                <div className={styles.item+" normalFontSizeC"}>
                    <List.Item >{(<span className="normalFontSizeC">问题描述</span>)}
                    <TextareaItem
                        placeholder="请输入问题描述"
                        data-seed="logId"
                        value={textareaValue}
                        onChange = {(e)=>{
                            this.setState({textareaValue:e})
                        }}
                        ref={el => this.autoFocusInst = el}
                        rows={4}
                    />
                    </List.Item>
                </div>
                <div className={styles.item+" normalFontSizeC"}>
                <List.Item >
                <span className="normalFontSizeC">拍照上传<span className="greyColor">({files.length}/10)</span></span>
                
                    <CustomUpload
                            useCrmUpload={true}
                            maxLength={10}
                            onChange={(val) => {
                                this.setState({
                                    files: val
                                })
                            }}
                            accept="image/*"
                            getLength={length => { this.setState({ length }) }}
                            value={files}
                        />

                    </List.Item>
                </div>
                </div>
                <div className={styles.paddingbox}><Button type="primary" onClick={this.commit}>提交</Button></div>
                {/* <div className={"normalFontSizeC "+styles.nameless}><Checkbox defaultChecked className="mr-8"/>匿名提交</div> */}
            </div>
        );
    }
})