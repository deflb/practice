import React, { Component } from 'react';
import CustomWhiteSpace from '../../../component/customWhiteSpace';
import CustomProgress from '../../../component/customProgress';
import TitleContent from '../../../component/titleContent';
// import EnabledIosScrollView from '../../../component/enabledIosScrollView';
import whichImgLink from '../../../utlis/whichImgLink';
import inform_icon from '../../../assets/icon/inform_icon@3x.png';
import get_integral_icon from '../../../assets/icon/get_integral_icon@3x.png';
import send_integral_icon from '../../../assets/icon/send_integral_icon@3x.png';
import integral_exchange_icon from '../../../assets/icon/integral_exchange_icon@3x.png';
import vip_service_icon from '../../../assets/icon/vip_service_icon@3x.png';
import gold_vip_icon from '../../../assets/icon/gold_vip_icon@3x.png';
import styles from './index.less';

export default class grade extends Component {
    render() {
        const { location } = this.props,
            { state = {} } = location,
            { avatar, name, userLevel } = state;
        return (<React.Fragment>
            <div className={styles.grade_wrapper}>
                <img src={inform_icon} alt='' className={styles.grade_wrapper_icon} />
                <div className={styles.grade_wrapper_avator}>{avatar ? <img src={whichImgLink(avatar)} alt='' /> : null}</div>
                <p className={styles.grade_wrapper_name}>{name}</p>
                {userLevel ? <span className={styles.grade_wrapper_tip}>{userLevel}</span> : null}
                <CustomProgress />
            </div>
            <CustomWhiteSpace />
            <TitleContent title='会员尊享权益'>
                {[
                    { title: '下单获积分', icon: get_integral_icon },
                    { title: '每月送积分', icon: send_integral_icon },
                    { title: '积分兑换', icon: integral_exchange_icon },
                    { title: '专属客服', icon: vip_service_icon, extra: gold_vip_icon },
                ].map(item => <div key={item.title} className={styles.power}>
                    <div className={styles.power_item}>
                        <img className={styles.power_item_icon} src={item.icon} alt={item.title} />
                        <p>{item.title}</p>
                    </div>
                    {item.extra ? <img className={styles.power_extra} src={item.extra} alt='' /> : null}
                </div>)}
            </TitleContent>
        </React.Fragment>);
    }
}