import React, { Component } from 'react';
import {Icon ,Tabs,Grid,List,WhiteSpace,TextareaItem,Toast} from 'antd-mobile';
import styles  from './detail.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
import { formatDate } from '../../../../utlis';
import  whichImgLink  from '../../../../utlis/whichImgLink';
import double_arrowSrc from '../../../../assets/icon/double_arrow_rigth@3x.png'
import addIcon from '../../../../assets/icon/add@3x.png'
import CustomModal from '../../../../component/customModal';
const { preview } = CustomModal;
export default class myAfterSale extends Component {
    state = {
      Handle:'已处理',
      classifyList:[],
      data:{}
    }
    componentDidMount(){
        this.init();
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    init(){
        let {location={}}=this.props,{state={}} =location;
        let fclaimid = state.orderId;
        if(fclaimid)
        request({ url: api.getStoreDetail, data: { fclaimid} }).then(res => {
            this.setState({ data: res,isLoading:false })
         
        }).catch(err => { console.log(err)
            this.setState({
                isLoading:false
            })
        })
      
    }


 
    back=()=>{
        this.props.history.goBack()
    }
    toAdd=(e)=>{
        e.stopPropagation();
        const { history,match } = this.props;
        let {data} = this.state;
        history.push({
            pathname:match.path.slice(0,-7)+'/apply',
            state: {orderId:data.fclaimid,orderNo:data.fclaimno}
        })
    }
    getDate=(date)=>{
        if(!date){
            return ""
        }
        if(Number(date)<15000000){
            return date
        }
        return formatDate(new Date(date),"YYYY-MM-DD")
    }
    toOrdDetail=(ord)=>{
        const { history, match } = this.props;
       if(!ord){
           Toast.fail("没有销货单")
           return
       }
        history.push({
            pathname: match.path.slice(0,-19) + '/myOrder/detail',
            state: {id:ord,offical:true}
        })
    }
    statusIcon =(text)=>{
        if(text){
            return <span className={` ${styles.statusIcon}`}>已处理</span>
        }else{
            return<span className={` ${styles.statusIcon} ${styles.orange}`}>待处理</span>
        }
     
    }
    getHeight=()=>{
        return document.documentElement.clientHeight-100
    }
    render() {
        let {data} = this.state,{beforeImgList=[],afterImgList=[]}=data;
        const photoData  = Array.from(beforeImgList).map((_val, i) => ({
            icon:whichImgLink(_val.fimgpath),
          }));
          const photoData2  = Array.from(afterImgList).map((_val, i) => ({
            icon: whichImgLink(_val.fimgpath),
          }));  
        return (
            <div className={styles.myAfterSaleDetail}>   
               
                <div className={styles.historyList}>
                    <List.Item className={styles.mb_8+' '+styles.historyTop}> 
                    <div className="normalFontSizeC">
                    {this.statusIcon(data.factclmtypedesc)}
                    <span>当前售后单 : {data.fclaimno} </span>
                    <Icon size ="lg" className={styles.icon}
                    type="down" theme="outlined" 
                    onClick={this.back} />
                    </div></List.Item>
                   
                    <Tabs
                        tabs={[
                            { title: '诉求详情' },
                            { title: '处理结果' },
                        ]}
                        tabBarTextStyle={{ color: '#6b6b6b' }}
                        tabBarActiveTextColor='#3399ff'
                        tabBarUnderlineStyle={{ borderColor: '#3399ff',width:'30%',margin:'0 10%'}}
                        destroyInactiveTab={false}
                    >
                        <div className={styles.tabBody} style={{maxHeight:this.getHeight()+'px'}}>
                            <div className={styles.item}> 
                            <List.Item >
                            <label className="normalFontSizeC fl">销货单号</label>
                            <div className={"normalFontSizeC fl"} style={{display:'flex',width:'65%'}}>
                                <div className=" fl mr-8" style={{flex:'1'}}>{data.fordno}</div>
                                <div className="blueColor fl" onClick={this.toOrdDetail.bind(this,data.fordno)}>查看详情
                                <img src={double_arrowSrc} className="ml-8" style={{height:'8px',width:'12px'}} alt=""/></div>
                            </div>
                            </List.Item>
                            </div>
                            <div className={styles.item}>
                            <List.Item >
                            <label className="normalFontSizeC">诉求</label><span className="normalFontSizeC">{data.fclmtypedesc}</span>
                            </List.Item>
                            </div>
                            <div className={styles.item}>
                            <List.Item >
                            <label className="normalFontSizeC">受理日期</label><span className="normalFontSizeC ">{this.getDate(data.facceptdate)}</span>
                            </List.Item></div>
                            <div className={styles.item}>
                            <List.Item >
                            <label className="normalFontSizeC">要求完成日期</label><span className="normalFontSizeC">{this.getDate(data.fasksettledate)}</span>
                            </List.Item></div>
                            <div className={styles.item}>
                            <List.Item >
                                
                                <label className="normalFontSizeC nomargin">问题描述</label>
                                <div className={styles.descItem}>
                                    <TextareaItem disabled value={data.fcustproblem||''}  autoHeight/>
                                </div>
                            </List.Item></div>
                            <div className={styles.item}>
                            <List.Item >
                                <label className="normalFontSizeC">照片</label>
                                <div className={styles.before}>
                                    <Grid columnNum={3} data={photoData} itemStyle={{marginRight:'8px'}} renderItem={(el,index)=>{
                                        return <img width="100%" className={styles.iconImg} key={index+'iconImg'} src={el.icon} alt=""  onClick={()=>{
                                            preview([{url:el.icon}])
                                        }}/>
                                    }} hasLine={false}/>
                                </div>
                            </List.Item>
                            </div>

                        </div>
                        <div className={styles.tabBody} style={{maxHeight:this.getHeight()+'px'}}>
                            <div className={styles.item}>
                            <List.Item>
                                <label className="normalFontSizeC">处理方式</label>
                                <span className="normalFontSizeC ">{data.factclmtypedesc}</span>
                                </List.Item></div>
                            <div className={styles.item}>
                            <List.Item>
                                <label className="normalFontSizeC nomargin">处理说明</label>
                                {/* <span className="normalFontSizeC">{data.fdealdesc||'无'}</span> */}
                                <div className={styles.descItem}>
                                    <TextareaItem disabled value={data.fdealdesc||''}  rows={data.fdealdesc?(Math.floor(data.fdealdesc.length/13)+1):1}/>
                                </div>
                                </List.Item></div>
                            <div className={styles.item}><List.Item>
                                <label className="normalFontSizeC">客户满意度</label>
                                <span className="normalFontSizeC">{data.fstsdegreedesc||''}</span>
                                </List.Item></div>
                            <div className={styles.item}>
                            <List.Item>
                                <div style={{minHeight:'100px'}}>
                                    <label className="normalFontSizeC">现场照片</label>
                                    <br/>
                                    <div className={`${styles.before} `}>
                                    <div><span>处理前</span></div>
                                    <WhiteSpace/>
                                    <Grid data={photoData} columnNum={3}
                                    itemStyle={{marginRight:'12px'}} renderItem={(el,index)=>{
                                        return <img  onClick={()=>{
                                            preview([{url:el.icon}])
                                        }} width="100%" className={styles.iconImg} alt="" key={index+'iconImg2'} src={el.icon}/>
                                    }}  hasLine={false}/>
                                    </div>
                                    
                                    <div className={styles.before}>
                                    <div><span>处理后</span></div>
                                    <WhiteSpace/>
                                    <Grid data={photoData2} columnNum={3} itemStyle={{marginRight:'12px'}}
                                        renderItem={(el,index)=>{
                                            return <img  onClick={()=>{
                                                preview([{url:el.icon}])
                                            }} width="100%"  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                                        }} 
                                    hasLine={false}/>
                                    </div>
                                 </div>
                                </List.Item></div>
                        </div>
                    </Tabs>
                </div>
                <div className={styles.plusBtn+' highFontSizeC'} onClick={this.toAdd}><img src={addIcon} width="100%" alt=""/></div>
            </div>
        );
    }
}