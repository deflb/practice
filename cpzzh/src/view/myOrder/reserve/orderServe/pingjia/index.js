import React, { Component } from 'react';
// import { createForm } from 'rc-form';
import { List, TextareaItem, Button, WingBlank, Toast ,Icon,WhiteSpace,Checkbox} from 'antd-mobile';
// import CustomWhiteSpace from '../../../../../component/customWhiteSpace';
import CustomUpload from '../../../../../component/customUpload';
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import Star from "./star"
import styles from '../index.less';

export default class Pingjia extends Component {
    state = {
        imgList: [],
        maxLength: 10,
        allhighappraiseresult:1,
        btnStatus:false,
        length:0,
    }
    componentDidMount(){
        let {location={}} =this.props,{state={}}=location;
       
        this.setState({
            fservicePrjId:state.fservicePrjId,
            taskId:state.taskNo,
            taskType:state.taskType,
        })
        request({url:api.getEvaluateTemp,data:{id:state.fservicePrjId}}).then(res=>{
            this.setState({
                tempItemDtos:res.tempItemDtos||[],
                tempMstDto:res.tempMstDto||{}})
        }).catch(err=>{Toast.fail("获取模板失败")
            this.setState({btnStatus:true})
    })
    }
    saveFeedback = () => {
        let {allhighappraiseresult,textValue,
            imgList,tempMstDto,tempItemDtos,taskId,taskType} = this.state;
        let numStr = ['one','two','three','four','five']
        let arr =[];
            imgList.forEach((item)=>{
                arr.push({
                    attachDesc:item.fileName,
                    attachUrl:item.fileUrl
                })
            });
            
        let appResSortItemDtos = [];
            if(tempItemDtos){
               tempItemDtos.forEach((item,index)=>{
                    appResSortItemDtos.push({
                        fpoint:item[numStr[this.state['starNum'+index]-1]+'value'],
                        fsortstardesc:item[numStr[this.state['starNum'+index]-1]+'desc'],
                        fsortstartitle:item[numStr[this.state['starNum'+index]-1]+'title'],
                        fsorttitle:item.title
                    })
                })    
            }
             
        let param = Object.assign(tempMstDto||{},{ 
            allhighappraiseresult,
            appResSortItemDtos,
            appraisecontent:textValue,
            attachDtos:arr,
            type:0,
            taskId,
            taskType:Number(taskType)
        })
   
        request({
            url: api.saveEvaluate, data: param}).then(res => {
            Toast.success('提交成功!', 1)
            let timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                this.goBack()
            }, 1000)
        }).catch(err => { })
    }
    changeCheck=(num)=>{
        this.setState({
            allhighappraiseresult:num
        })
    }
    getHeight=()=>{
        return document.documentElement.clientHeight-120
    }
    goBack=()=>{
        this.props.history.goBack()
    }
    render() {
        const {  maxLength ,length,tempItemDtos=[],tempMstDto={},allhighappraiseresult} = this.state;
            let numStr = ['one','two','three','four','five']
            let color = ['greyColor','blueColor','origanColor','greenColor','redColor']      
          return (
            <div className={styles.wrapper}>
              
                
                   {tempMstDto.ifallhighappraise===0?null:
                    <List>
                        <List.Item >
                        <WhiteSpace size="xs"/>
                            整体评价
                            <div style={{width:'75%'}} className="fr">
                                    <span onClick={this.changeCheck.bind(this,1)} className={styles.checkIcon}>{allhighappraiseresult===1?<Icon type="check-circle" size="xs"/>:null} </span>好评
                                    <span onClick={this.changeCheck.bind(this,2)} className={styles.checkIcon}>{allhighappraiseresult===2?<Icon type="check-circle" size="xs"/>:null} </span>中评
                                    <span onClick={this.changeCheck.bind(this,3)} className={styles.checkIcon}>{allhighappraiseresult===3?<Icon type="check-circle" size="xs"/>:null} </span>差评
                            </div>
                            <WhiteSpace size="xs"/>
                        </List.Item>
                   </List>
                   }  
                <div className={styles.pjBody} >
                   {tempMstDto.ifstarlvappraise===0?null:
                   <List>
                   <List.Item>
                       <div className={styles.labels+' textFontSize'}>
                       {
                                tempItemDtos.map((item,index)=>{
                                    return<div key={item.itemid+''+index}>
                                            <label >{item.title}</label><Star onChange={(num)=>{
                                                let name = 'starNum'+index;
                                                let obj={};
                                                obj[name]=num;
                                                this.setState(obj)}} name="0"/><span className={"ml-8 "+
                                                color[this.state['starNum'+index]-1]}>
                                                {Number(this.state['starNum'+index]||0)}分</span>
                                            <div className="origanColor "><label></label>
                                            {item[numStr[this.state['starNum'+index]-1]+'desc']||''}</div>
                                         </div>
                                })
                            }
                       </div>
                   </List.Item>
                  
                </List>
              
                   }
                 <WhiteSpace size="xs"/>
                {(tempMstDto.ifsetappraisecontent===0)?null:
                <List>
                    <TextareaItem
                        rows={5}
                        count={100}
                        onChange={(e)=>{
                            this.setState({textValue:e})
                        }}
                        value={this.state.textValue}
                        placeholder='请输入评价内容'
                    />
                </List>}
                {tempMstDto.ifuploadimg===0?null:
                <List renderHeader={() => <div className='titleFontSizeC'>拍照上传<span className='textFontSizeC shallowGreyColor'>{`（${length}/${maxLength}）`}</span></div>}>
                    <List.Item>
                    <CustomUpload
                            onChange={(files)=>{
                                this.setState({imgList:files})
                            }}
                            getLength={length => { this.setState({ length }) }}
                            maxLength={maxLength}
                            getLength={length => { this.setState({ length }) }}
                            value ={this.state.imgList}
                            accept='image/*'
                        />
                    </List.Item>
                </List>
                }
                </div>
                <WingBlank><Button type='primary'
                disabled={this.state.btnStatus}
                onClick={e => {
                    this.saveFeedback()
                }}>提交</Button></WingBlank>
                  <div className={"normalFontSizeC "+styles.nameless}><Checkbox defaultChecked className="mr-8"/>匿名提交</div>
            </div>
        );
    }
}