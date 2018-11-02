import React, {Component} from 'react';

export default class Tel extends Component {
    constructor(props) {
        super(props)
     
        this.state={
           
        }
    }
    tel=(e)=>{
        let {tel} = this.props;
        e.stopPropagation();
        window.location.href ="tel://"+tel;
    }
    render(){
        return(

            <span onClick={this.tel}>
              <i className='iconfont icon-phone greenColor' />
            </span>
    )
    }
}
