import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,
    Grid,Badge, Button,Toast} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less';
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import { formatDate } from '../../../../../utlis';
import whichImgLink from '../../../../../utlis/whichImgLink';
import vrImg from '../../../../../assets/image/vrImg.png';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class Design extends Component {
    constructor(props) {
        super(props)
        this.state={
            designInfo:{},
            isloading:true,
            visiable:false,
            modalUrl:''
        }
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    componentDidMount(){
        let {title } = this.props;
        document.title = title;
        this.init()
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'design'}}).then(res => {
            this.setState({
                designInfo:res.designInfo||{},
                isloading:false
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
        const w=window.open('about:blank');
        w.location.href='https://'+url
    }
    toShare=(content)=>{
        if(!content){
            Toast.fail('暂无可分享的全景图', 1);
            return
        }
        const w=window.open('about:blank');
        w.location.href='https://'+content
      

    }
    viewImg=(url)=>{
        let {modalUrl} = this.state;
        if(modalUrl){
            this.setState({
                visible:true,
            })
        }else{
            setTimeout(this.viewImg,100)
        }
      
    }
    render(){
        let {designInfo={},isloading,} = this.state,{projectList=[]}=designInfo;
        let{state,title} = this.props;
        return(
            <div className={styles.serveDetails}>
              <List>
                <List.Item className={styles.historyTop}>
                    {title}
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
                {projectList.length===0&&!isloading?(<div className="greyColor tc mt-16">
                    <WhiteSpace />
                     还没有做好的方案~
                
                </div>):null}
                {projectList.map((item,index)=>{
                    return <WingBlank key={item.number} className={styles.mt_16}>
                    <Card full  >
                    <Badge size="large" 
                    style={{right:'-24px'}}
                     text={<span className="textFontSize">{designInfo.status.slice(-3)}</span>} corner>
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
                          itemStyle={{margin:'8px 8px  0 0',}}
                          renderItem={(el,index)=>{
                              return el.icon?<img width="100%"  alt="" className={styles.iconImg}
                               key={index+'iconImg3'} src={el.icon} onClick={()=>{
                               preview([{url:el.icon}])}}/>:""
                          }} 
                          hasLine={false}/>
                           <WhiteSpace/>
                     </div>
                    <div className={styles.cardFoo}>
                     <div className={"fl "+styles.overallView} style={{
                         backgroundImage:`url(${vrImg})`, backgroundRepeat:'no-repeat', backgroundSize:'100% 100%'

                     }}
                     onClick={this.toOverall.bind(this,item.overallView)}
                     >
                        {/* <img alt="" width="100%" src={vrImg}  onClick={this.toOverall.bind(this,item.overallView)} /> */}
                      </div>
                      <div className={styles.overallbtnBox+" fl textFontSize"} > 
                       <Button className="fr" type="ghost" size="small" onClick={this.toShare.bind(this,item.overallView)}><i className='iconfont icon-share' />分享效果图</Button></div>
                     
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
