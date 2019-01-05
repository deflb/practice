import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid,Badge, Button,Toast} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less';
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import { formatDate } from '../../../../../utlis';
import whichImgLink from '../../../../../utlis/whichImgLink';
export default class Design extends Component {
    constructor(props) {
        super(props)
        this.state={
            designInfo:{}
        }
    }
    componentDidMount(){
       
        this.init()
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'design'}}).then(res => {
            this.setState({
                designInfo:res.designInfo||{}
            })
        })
    }
    getDate=(date,isLong)=>{
        if(!date||date<150000000){
            return date
        }
        if(isLong){
            return new Date(date).toLocaleString().replace(/\//g,'-') 
        }
        return formatDate(new Date(date),"YYYY-MM-DD hh:mm")
    }
    getPhoto =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        return Array.from(ImgList).map((_val, i) => ({
            icon: whichImgLink(_val),
          }));  
    }
    toOverall=(url)=>{
        if(!url){
            Toast.fail('暂无全景图', 1);
            return
        }
        const { history } = this.props;
        history.push({
            pathname: url,
            state: {}
        })
    }
    toShare=(content)=>{
        if(!content){
            Toast.fail('暂无可分享的全景图', 1);
            return
        }
    }
    render(){
        let {designInfo={}} = this.state,{projectList=[]}=designInfo;
        let{state} = this.props;
        return(
            <div className={styles.serveDetails}>
              <List>
                <List.Item className={styles.historyTop}>
                    方案信息
                </List.Item>

              </List>
           
              <div className={styles.body}>
                    <div className={styles.desc}>
                        <div><span className="mr-8">{state.execRoleName} :</span> 
                        <span className={styles.people}>
                        <span className="mr-8">{state.execUserName}</span>
                        <span className="mr-8">{state.mobilePhone}</span>
                        <span className="mr-8" style={{display:state.mobilePhone?null:'none'}}><Tel tel={state.mobilePhone}/></span>
                        </span>
                    </div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"预约上门时间"} :</span> {this.getDate(state.appointDate)}</div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"完成时间"} :</span> {this.getDate(state.finishDate)}</div>
                    </div>
                </div>
                {projectList.length===0?(<div className="greyColor tc mt-16">
                    <WhiteSpace />
                     还没有做好的方案~
                
                </div>):null}
                {projectList.map((item,index)=>{
                    return <WingBlank key={item.number} className={styles.mt_16}>
                    <Card full  >
                    <Badge size="large"
                     text={designInfo.status.slice(-3)} corner>
                  <Card.Body>
                     <div >
                          <div>{item.name}</div>
                          <WhiteSpace/>
                          <div className="textFontSize greyColor overflow">
                              <span className="fl">{item.number}</span>
                              <span className="fr">上传时间:  {this.getDate(designInfo.designTime,true)}</span>
                          </div>
                     </div>
                     <div className={styles.mt_16} style={{borderBottom:'1px dashed #999'}}></div>
                     <div >
                          <Grid data={this.getPhoto(item.renders)} 
                          columnNum={3}
                          itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                          renderItem={(el,index)=>{
                              return <img width="100%"  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                          }} 
                          hasLine={false}/>
                           <WhiteSpace/>
                     </div>
                    <div className={styles.cardFoo}>
                     <div className={"fl "+styles.overallView} onClick={this.toOverall.bind(this,item.overallView)} >
                         前往查看720°全景图
                      </div>
                      <div className=" fl textFontSize" style={{width:'36%',padding:'0 8px'}}> 
                       <Button type="ghost" size="small" onClick={this.toShare.bind(this,item.overallView)}><i className='iconfont icon-share' />分享效果图</Button></div>
                     
                   </div>
                  </Card.Body>
                  </Badge>
                  </Card>
                  </WingBlank>
                })}
            </div>
    )
    }
}
