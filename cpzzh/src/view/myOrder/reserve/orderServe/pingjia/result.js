import React, { Component } from 'react';
import {  Toast ,WhiteSpace, WingBlank, Grid} from 'antd-mobile';
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import Star from "./star"
import styles from '../index.less';
import { formatDate } from '../../../../../utlis';
import  whichImgLink  from '../../../../../utlis/whichImgLink';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class PingjiaResult extends Component {
    state = {
        imgList: [],
        maxLength: 10,
        allhighappraiseresult:1,
        btnStatus:false,
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    componentDidMount(){
        let {location} =this.props,{state}=location;
        request({url:api.getSalesEvaluateDetail,data:{id:state.fid}}).then(res=>{
            this.setState({data:res})
        }).catch(err=>{Toast.fail("获取评价信息失败")
            this.setState({btnStatus:true})
    })
    }

    getDate=(date)=>{
        if(!date||date<150000000){
            return date
        }
        return formatDate(new Date(date),"YYYY-MM-DD hh:mm")
    }
    getPhoto =(ImgList=[],type)=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        let arr =[];
        ImgList.forEach(item=>{
            if(item.attachType===type){
                arr.push(item)
            }
        })
        return Array.from(arr).map((_val, i) => ({
            icon: whichImgLink(_val.attachUrl),
          }));  
    }
   
    render() {
            const { data={}} = this.state;
           
            let allhighappraiseresult = ['默认好评',"好评",'中评','差评']
        return (
            <div style={{height:'100%',overflowY:'auto'}}>
            <WingBlank className="greyColor">
                <WhiteSpace/>
                <div className={styles.labels}>
                    <label >评价时间</label><span>{this.getDate(data.evalTime)}</span>
                </div>
                <WhiteSpace/>
                <div className={styles.labels}>
                    <label >整体评价</label><span>{allhighappraiseresult[data.allhighappraiseresult]}</span>
                </div>

                <WhiteSpace/>
               
                {
                    data.appResSortItemDtos?
                    data.appResSortItemDtos.map((item,index)=>{
                        return <div className={styles.labels} key={item.fapprresultitemid+''+index}>
                                <div >
                                    <label style={{width:'25%'}}>{item.fsorttitle}</label><Star disable={true} name ={item.fpoint*2}/><span className="ml-8">{item.fpoint}分</span>
                                </div>
                                <div className="origanColor"><label/>
                                            {item.fsortstardesc}</div>
                        </div>
                    })
                    :""
                }
                <WhiteSpace/>
                <div className={styles.labels}>
                    <label >评价内容</label><span></span>
                </div>
                <WhiteSpace/>
                <div className="xBottom1px"></div>
                <div  style={{minHeight:'60px',padding:'8px 0 8px 16px'}}>
                    {data.appraisecontent}
                </div>
                <div className="pl-16 ">
                            <Grid data={this.getPhoto(data.attachDtos,"0")} 
                            itemStyle={{margin:'8px 8px  0 0',}}
                            renderItem={(el,index)=>{
                                return <img width="100%"  alt="" className={styles.iconImg} key={index+'iconImg01'}
                                 src={el.icon} onClick={
                                    ()=>{preview([{url:el.icon}])}
                                }/>
                            }} 
                            hasLine={false}/>
                </div>
                <WhiteSpace/>
            </WingBlank>
              <div className="xBottom1px"></div>
              <WhiteSpace/>
              {/* <h4 className='pl-16'>收到的回复说明</h4>
              <div className="pl-16 greyColor"> */}
                    {/* <WhiteSpace/>
                    <div className={styles.labels}>
                            <label >回复时间</label><span>{this.getDate(data.evalTime)}</span>
                    </div>
                    <WhiteSpace/>
                    <div className={styles.labels}>
                            <label >回复说明</label>
                            <div style={{padding:'0 16px'}}>{data.reply}</div>
                            <div className="pl-16 mt-16">
                            <Grid data={this.getPhoto(data.attachDtos,"0")} 
                            itemStyle={{margin:'8px 8px  0 0'}}
                            renderItem={(el,index)=>{
                                return <img width="100%" alt="" className={styles.iconImg} key={index+'iconImg3'} 
                                        src={el.icon} onClick={
                                            ()=>{preview([{url:el.icon}])}
                                        }/>
                            }} 
                            hasLine={false}/>
                </div>
                    </div>
               </div> */}
         </div>
        );
    }
}