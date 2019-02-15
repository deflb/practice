import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid,Pagination,Icon} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from '../gauge/title'
import Col from './col'
import styles from '../index.less'
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import whichImgLink from '../../../../../utlis/whichImgLink';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class PutSample extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{},
           current:1,
           markInfos:[{}],
           loading:true
        }
    }
    componentDidMount(){
        let {title } = this.props;
        document.title = title;
        this.init()
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'mark'}}).then(res => {
            this.setState({
                markInfos:res.markInfos||[{}],
                loading:false
            })
        })
    }
    getPhoto =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        return Array.from(ImgList).map((_val, i) => ({
            icon: whichImgLink(_val.img),
            name:_val.name
          }));  
    }
    getRoomPhotos =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        return Array.from(ImgList).map((_val, i) => ({
            icon: whichImgLink(_val.url),
          }));  
    }
    render(){
        let {markInfos=[{}],current,loading} = this.state;
        let info = markInfos[current-1] ||{};
        let {rooms=[]} = info;
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
                    <div><span className="mr-8">{"预约上门时间"} :</span> {this.props.getDate(state.appointDate)}</div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"完成时间"} :</span> {this.props.getDate(state.finishDate)}</div>
                    </div>
                </div>
               

                 <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="放样照片"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div >
                    {info.markDrawing&&info.markDrawing.length>0?
                     <Grid data={this.getPhoto(info.markDrawing)} 
                      itemStyle={{margin:'8px 8px  0 0',}}
                      renderItem={(el,index)=>{
                          return <img width="100%" alt={el.name}  onClick={()=>{
                            preview([{url:el.icon}])
                          }} className={styles.iconImg} key={index+'iconImg3'} 
                          src={el.icon}/>
                      }} 
                     hasLine={false}/>:
                     <div style={{display:loading?'none':null}} className="tc greyColor textFontSize">暂无数据</div>}
                     
                </div>
                   

                </Card.Body>
                </Card>
                </WingBlank >

               
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="放样清单"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px 0'}}>
                    <div >
                    {rooms.map((item,index)=>{
                        return <div key={item.roomCode+''+index}> 
                                <Title text={`${item.roomName}${item.wallName}`}/>
                                    {item.components.map((child,index)=>{
                                        return  <Col key={child.objId+''+index} text={child.name} state={child} isPut={item.isMark}/>
                                    })}
                                    <div className="pl-16">
                                    <Grid data={this.getRoomPhotos(item.photos)} 
                                        itemStyle={{margin:'8px 8px  0 0',}}
                                        renderItem={(el,index)=>{
                                            return <img width="100%" alt={el.name} className={styles.iconImg} key={index+'iconI'} src={el.icon}/>
                                        }} 
                                    hasLine={false}/>
                                    </div>
                             </div>
                    })}
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
                <div style={{display:markInfos.length<2?'none':null}}>
                <Pagination total={markInfos.length}
                    className={styles.pagination}
                    simple={true}
                    current={current}
                    onChange={(current)=>{
                       this.setState({current})
                    }}
                    locale={{
                        prevText: (<span  className="arrow-align"><Icon type="left" /></span>),
                        nextText: (<span  className="arrow-align"><Icon type="right" /></span>),
                    }}
                    />
                    </div>
            </div>
    )
    }
}
