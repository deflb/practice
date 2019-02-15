import React, {Component} from 'react';
import {List,WhiteSpace,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less'
import whichImgLink from '../../../../../utlis/whichImgLink'
import { request } from '../../../../../request';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class Others extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{},
        }
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    componentDidMount(){
        let {servicePrj} =this.props.state;
        document.title = servicePrj;
        this.init()
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
    init=()=>{
        let {taskNo} =this.props.state;
        request({ url: "/storejps/evatask/getTaskResult", data: {taskId:taskNo}}).then(res => {
           console.log(res)
            this.setState({
                data:res||{}
            })
        })
    }
    getPhoto =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        let arr =[];
        ImgList.forEach(item=>{
            if(item.attachType==="0"){
                arr.push(item)
            }
        })
        return Array.from(arr).map((_val, i) => {
                return {
                    icon: whichImgLink(_val.attachUrl),
                  }
            
        });  
    }
    getAudio=(datas)=>{
        if(!Array.isArray(datas)||!datas){
            datas=[]
        }
        let arr =[]
        datas.forEach(item=>{
            if(item.attachType==="1"){
                arr.push(item)
            }
        })
        return Array.from(arr).map((_val, i) => {
                return {
                    url: whichImgLink(_val.attachUrl),
                  }
        });  
    }
    render(){
        let {state}=this.props;
        let {data}=this.state;
        
        return(
            <div className={styles.serveDetails} >
              <List>
                <List.Item className={styles.historyTop}>
                    服务信息
                </List.Item>

              </List>
           
              <div className={styles.body} >
                    <div className={styles.desc}>
                        <div><span className="mr-8">服务人员 :</span> 
                        <span className={styles.people}>
                        <span className="mr-8">{state.execUserName}</span>
                        <span className="mr-8">{state.mobilePhone}</span>
                        <span className="mr-8" style={{display:state.mobilePhone?null:'none'}}><Tel tel={state.mobilePhone}/></span>
                        </span>
                    {/* <WhiteSpace />
                    <div><span className="mr-8">{"预约上门时间"} :</span> {this.props.getDate(state.appointDate)}</div> */}
                    <WhiteSpace />
                    <div><span className="mr-8">{"完成时间"} :</span> {this.props.getDate(data.execDate)}</div>
                    </div>
                    <WhiteSpace />
                    <div className=" overflow mb-16">
                        <span className="mr-8 fl">服务情况 :</span><div className="fl" style={{width:'60%'}}>{data.note}</div> 
                    </div>
                    </div>
                    <div style={{padding:'16px 0 16px 20%'}}>
                    <Grid data={this.getAudio(data.attachDtos)} 
                          columnNum={2}
                          itemStyle={{margin:'8px 8px  0 0',}}
                          renderItem={(el,index)=>{
                              return <audio controls>
                                        <source src={el.url} width="100%" type="audio/mpeg" onClick={()=>{
                            preview([{url:el.url}])}} />
                                    </audio>
                          }} 
                          hasLine={false}/>
                    <Grid data={this.getPhoto(data.attachDtos)} 
                          columnNum={2}
                          itemStyle={{margin:'8px 8px  0 0',}}
                          renderItem={(el,index)=>{
                              return el.icon?<img width="100%"  alt="" className={styles.iconImg}
                               key={index+'iconImg3'} src={el.icon} onClick={()=>{
                                preview([{url:el.url}])}}/>:""
                          }} 
                          hasLine={false}/>
                    </div>
                   
                </div>

               
                 
                
           


              
            </div>
    )
    }
}
