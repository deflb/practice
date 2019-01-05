import React, {Component} from 'react';


export default class Star extends Component {
    constructor(props) {
        super(props)
        this.state={
             //接到页面传过来的值    
            //因为当前页面显示五颗星，而分数是十分所以要去平均值，
            num:this.props.name/2,
            //根据页面当中的星星的数量来设置默认值
            arr:[1,2,3,4,5]
        }
    }
    starChange =(index)=>{
        if(this.props.disable){
            return 
        }
        this.setState(
            {
                num:index+1
            }
        )
        this.props.onChange(index+1)
    }
    render(){
        return(

            <span>
                {
                    this.state.arr.map((ele,index)=>{
                        return(
                            <span key={index}>
                                <span onClick={this.starChange.bind(this,index)}>{ele>this.state.num?
                                <span style={{color:"#c1c1c1",fontSize:"32px"}}>
                                 <i className='iconfont icon-collect greyColor' />
                                </span>:<span style={{color:"#e93536",fontSize:"32px"}}>
                                <i className='iconfont icon-star-fill redColor' />
                                </span>}</span>
                            </span>
                        )
                    })
                }
            </span>
    )
    }
}
