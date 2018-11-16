import React, {Component} from 'react';
import styles from './css.less'
import{Accordion,Grid} from 'antd-mobile'
import api from '../../../../../request/api';
import { crmFileAddress } from '../../../../../request/baseURL';
export default class Row extends Component {
    constructor(props) {
        super(props)
        this.state={
          
        }
    }
    getPhoto =(ImgList=[])=>{
        return Array.from(ImgList).map((_val, i) => ({
            icon: crmFileAddress + api.crmFileUrl(_val)
          }));  
    }
    render(){
        let {prop,name,components=[],fixPictures=[],livePictures=[]} = this.props.state;
        return(
          <Accordion className={styles.row}>
          <Accordion.Panel className={styles.row} header={ 
               <div className={' normalFontSize'}>
                <div className={styles.left}>
                    {name}
                </div>
                <div className={styles.right}>
                    { 
                        Object.keys(prop).map(key=>{
                            return <span className="ml-8"> {`${key} ${prop[key]}mm`}</span>
                        })
                    }
                   
                </div>
                </div>} >
               
                        { 
                           components.map((child,idx)=>{
                               return  <div key={child.name+''+idx} className={styles.floatBox+' normalFontSize xBottom1pxd'}>
                                            <div className={styles.left}>
                                                <label>{child.name}</label>
                                            </div>
                                            <div className={styles.right+' mt-8'}>
                                            { 
                                                Object.keys(child.sizes).map(key=>{
                                                    return <span className="ml-8 mb-8"> {`${key} ${child.sizes[key]}mm`}</span>
                                                })
                                            }
                                            </div>
                                    </div>

                           })
                        }
                        
                        <div  className={styles.floatBox+' normalFontSize xBottom1pxd'}>
                            <div className={styles.left}>
                                <label>量尺照片</label>
                            </div>
                            <div className={styles.right}>
                            <Grid data={this.getPhoto(livePictures)} 
                                itemStyle={{margin:'0 8px  8px 0',height:'75px'}}
                                renderItem={(el,index)=>{
                                    return <img  className={styles.iconImg} key={index+'iconImg3'} alt="" src={el.icon}/>
                                }} 
                                hasLine={false}/>
                            </div>
                        </div>
                        <div  className={styles.floatBox+' normalFontSize xBottom1pxd'}>
                            <div className={styles.left}>
                                <label>整改照片</label>
                            </div>
                            <div className={styles.right}>
                            <Grid data={this.getPhoto(fixPictures)} 
                                itemStyle={{margin:'0 8px  8px 0',height:'75px'}}
                                renderItem={(el,index)=>{
                                    return <img  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                                }} 
                                hasLine={false}/>
                            </div>
                        </div>
                    
                   
          </Accordion.Panel>
           
          </Accordion>
    )
    }
}
