import React, { Component } from 'react';
// import { createForm } from 'rc-form';
import { List, TextareaItem, Button, WingBlank, Toast ,Icon,WhiteSpace} from 'antd-mobile';
import CustomWhiteSpace from '../../../../../component/customWhiteSpace';
import CustomImageUpload from '../../../../../component/customImageUpload';
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
    }
    componentDidMount(){
        let {location} =this.props,{state}=location;
       
        this.setState({
            fservicePrjId:state.fservicePrjId,
        })
        request({url:api.getEvaluateTemp,data:{id:state.fservicePrjId}}).then(res=>{
            this.setState({data:res||{}})
        }).catch(err=>{Toast.fail("获取模板失败")
            this.setState({btnStatus:true})
    })
    }
    saveFeedback = () => {
        let {allHighAppraiseResult,textValue,imgList,data={}} = this.state;
        let numStr = ['one','two','three','four','five']
        let arr =[];
            imgList.forEach((item)=>{
                arr.push({
                    attachDesc:item.fileName,
                    attachUrl:item.url
                })
            });
            
        let appResSortItemDtos = [];
            if(data.tempItemDtos){
               data.tempItemDtos.forEach((item,index)=>{
                    console.log(item)
                    appResSortItemDtos.push({
                        fpoint:item[numStr[this.state['starNum'+index]-1]+'value'],
                        fsortstardesc:item[numStr[this.state['starNum'+index]-1]+'desc'],
                        fsortstartitle:item[numStr[this.state['starNum'+index]-1]+'title'],
                        fsorttitle:item.title
                    })
                })    
            }
             
        let param = Object.assign({ 
            allHighAppraiseResult,
            appResSortItemDtos,
            appraiseContent:textValue,
            attachDtos:arr,
            type:0
        },data.tempMstDto||{})
        request({
            url: api.saveEvaluate, data: param}).then(res => {
            Toast.success('提交成功!', 1)
            let timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                this.props.history.goBack()
            }, 1000)
        }).catch(err => { })
    }
    changeCheck=(num)=>{
        this.setState({
            allhighappraiseresult:num
        })
    }
    render() {
        const { imgList, maxLength ,data={},allhighappraiseresult} = this.state,
            {tempItemDtos=[],tempMstDto={}} = data,
            len = imgList.length;
            let numStr = ['one','two','three','four','five']
            let color = ['greyColor','blueColor','origanColor','greenColor','redColor']
        return (
            <div className={styles.wrapper}>
                <div style={{minHeight:'400px'}}>
                 <List>
                   {!tempMstDto||!tempMstDto.ifallhighappraise?null:
                   <List.Item >
                   <WhiteSpace size="lg"/>
                       整体评价
                       <div style={{width:'75%'}} className="fr">
                            <span onClick={this.changeCheck.bind(this,1)} className={styles.checkIcon}>{allhighappraiseresult===1?<Icon type="check-circle" size="xs"/>:null} </span>好评
                            <span onClick={this.changeCheck.bind(this,2)} className={styles.checkIcon}>{allhighappraiseresult===2?<Icon type="check-circle" size="xs"/>:null} </span>中评
                            <span onClick={this.changeCheck.bind(this,3)} className={styles.checkIcon}>{allhighappraiseresult===3?<Icon type="check-circle" size="xs"/>:null} </span>差评
                       </div>
                       <WhiteSpace size="lg"/>
                   </List.Item>
                   }  
                   {!tempMstDto||!tempMstDto.ifstarlvappraise?null:
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
                                            <div className="origanColor"><label/>
                                            {item[numStr[this.state['starNum'+index]-1]+'desc']}</div>
                                         </div>
                                })
                            }
                       </div>
                   </List.Item>
                   }
                </List>
                <WhiteSpace size="lg"/>
                {!tempMstDto||!tempMstDto.ifsetappraisecontent?null:
                <List>
                    <TextareaItem
                        rows={5}
                        count={100}
                        onChange={(e)=>{
                            this.setState({textValue:e})
                        }}
                        placeholder='请输入评价内容'
                    />
                </List>}
                {!tempMstDto||tempMstDto.ifuploadimg?null:
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
                }
                </div>
                <CustomWhiteSpace />
                <WingBlank><Button type='primary'
                disabled={this.state.btnStatus}
                onClick={e => {
                    this.saveFeedback()
                }}>提交</Button></WingBlank>
            </div>
        );
    }
}