import React, {Component} from 'react';
import styles from './css.less'

export default class Row extends Component {
    constructor(props) {
        super(props)
        this.state={
          
        }
    }
  
    render(){
        let {text,long,h,w,t,a,d,noborder} = this.props;
        return(
          <div className={styles.row}>
                <div className={styles.floatBox}>
                <div className={styles.left}>
                    <label>{text}</label>
                </div>
                <div className={styles.right}>
                   <div>
                        <span>宽度 {w}mm</span>&emsp;
                        <span>高度 {h}mm</span>&emsp;
                        <span>厚度 {t}mm</span>
                    </div> 
                    <div style={{display:long?null:'none'}}>
                        <span>台面 {a}mm</span>&emsp;
                        <span>距地 {d}mm</span>
                    </div>
                   
                </div>
                </div>
                <div  style={{borderBottom:'1px dashed #999',marginRight:'2%',display:noborder?"none":null}}></div>
          </div>
    )
    }
}
