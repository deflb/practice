import React, { Component } from 'react';
import {Icon ,Tabs,Grid,List,ActivityIndicator,WhiteSpace} from 'antd-mobile';
import styles  from './detail.less';
import { request } from '../../../../request';
import { imgAddress } from '../../../../request/baseURL';
import api from '../../../../request/api';
export default class myAfterSale extends Component {
    state = {
      Handle:'已处理',
      classifyList:[],
      data:{}
    }
    componentDidMount(){
        this.init();
    }
    init(){
        let {location={}}=this.props,{state={}} =location;
        let fclaimid = state.orderId;
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
    toAdd=()=>{
        const { history } = this.props;
        let {data} = this.state;
        history.push({
            pathname:'/wx/myAfterSale/apply',
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
        return new Date(date).toLocaleString().replace(/\//g,'-').slice(0,-10)
    }
    render() {
        let {data,isLoading=true} = this.state,{beforeImgList=[],afterImgList=[]}=data;
        const photoData  = Array.from(beforeImgList).map((_val, i) => ({
            icon:imgAddress+ _val.fimgpath,
          }));
          const photoData2  = Array.from(afterImgList).map((_val, i) => ({
            icon: imgAddress+ _val.fimgpath,
          }));  
        return (
            <div className={styles.myAfterSaleDetail}>   
                {/* <div className ={styles.nothing}>暂无售后记录</div> */}
                <div className={styles.historyList}>
                    <List.Item className={styles.mb_8+' '+styles.historyTop}> 
                    <div><span className={`greenColor ${styles.mr_8}`}>{data.factclmtypedesc||<span className="origanColor">未处理</span>}</span>
                    当前售后单 : {data.fclaimno} 
                    <Icon size ="lg" className={"fr "+styles.icon}
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
                    >
                        <div className={styles.tabBody}>
                            <div className={styles.item}> 
                            <List.Item >
                            <label>销货单号</label><span>{data.fordno}</span>
                            </List.Item>
                            </div>
                            <div className={styles.item}>
                            <List.Item >
                            <label>诉求</label><span>{data.fclmtypedesc}</span>
                            </List.Item>
                            </div>
                            <div className={styles.item}>
                            <List.Item >
                            <label>受理日期</label><span>{this.getDate(data.facceptdate)}</span>
                            </List.Item></div>
                            <div className={styles.item}>
                            <List.Item >
                            <label>要求完成</label><span>{this.getDate(data.fasksettledate)}</span><br/>
                            <label>日期</label>
                            
                            </List.Item></div>
                            <div className={styles.item}>
                            <List.Item >
                                <div className={styles.fl}>
                                <label>问题描述</label>
                                </div>
                                <div className={styles.fl} style={{whiteSpace:'normal'}}>
                                    <span>{data.fcustproblem}</span>
                                </div>
                            </List.Item></div>
                            <div className={styles.item}>
                            <List.Item >
                                <label>照片</label>
                                <div className={styles.before}>
                                    <Grid columnNum={3} data={photoData} itemStyle={{marginRight:'8px'}} renderItem={(el,index)=>{
                                        return <img className={styles.iconImg} key={index+'iconImg'} src={el.icon} alt=""/>
                                    }} hasLine={false}/>
                                </div>
                            </List.Item>
                            </div>

                        </div>
                        <div className={styles.tabBody}>
                            <div className={styles.item}>
                            <List.Item>
                                <label>处理方式</label>
                                <span>{data.factclmtypedesc||<span className="origanColor">未处理</span>}</span>
                                </List.Item></div>
                            <div className={styles.item}>
                            <List.Item>
                                <label>处理说明</label>
                                <span>{data.fdealdesc||'无'}</span>
                                </List.Item></div>
                            <div className={styles.item}><List.Item>
                                <label>客户满意度</label>
                                <span>{data.fstsdegreedesc||'无'}</span>
                                </List.Item></div>
                            <div className={styles.item}>
                            <List.Item>
                                <div style={{minHeight:'100px'}}>
                                    <label>现场照片</label>
                                    <br/>
                                    <div className={`${styles.before} ${styles.border}`}>
                                    <div><span>处理前</span></div>
                                    <WhiteSpace/>
                                    <Grid data={photoData} columnNum={3}
                                    itemStyle={{marginRight:'8px'}} renderItem={(el,index)=>{
                                        return <img className={styles.iconImg} alt="" key={index+'iconImg2'} src={el.icon}/>
                                    }}  hasLine={false}/>
                                    </div>
                                    <div className={styles.before}>
                                    <div><span>处理后</span></div>
                                    <WhiteSpace/>
                                    <Grid data={photoData2} columnNum={3} itemStyle={{marginRight:'8px'}}
                                        renderItem={(el,index)=>{
                                            return <img  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                                        }} 
                                    hasLine={false}/>
                                    </div>
                                 </div>
                                </List.Item></div>
                        </div>
                    </Tabs>
                </div>
                <ActivityIndicator animating={isLoading} size="large" toast/>
                <div className={styles.plusBtn}><Icon type="plus" onClick={this.toAdd}/></div>
            </div>
        );
    }
}