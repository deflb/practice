import React, {Component} from 'react';
import styles from'./css.less'

export default class Title extends Component {
    constructor(props) {
        super(props)
        this.state={
          
        }
    }
  
    render(){
        let {text} = this.props;
        return(
          <div className={styles.title}>
                {text}
          </div>
    )
    }
}
