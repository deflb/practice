import React from 'react';
import { Button } from 'antd-mobile';
import routerBase from '../../router/routerBase';
import check_true from '../../assets/image/check_true.png';
import styles from './result.less';

export default ({ history, match }) => <div className={styles.wrapper}>
    <img src={check_true} alt='' />
    <p>恭喜您，提交成功</p>
    <p>请等待确认并留意消息通知</p>
    <div className={styles.wrapper_info}>确认商机后，您可获得最高120元、1000积分；客户成交后将获得提成：成交额x3%</div>
    <Button onClick={() => {
        history.replace({
            pathname: routerBase + '/reportBusiness/detail',
            state: {}
        })
    }} className={styles.wrapper_btn} type='primary'>查看详情</Button>
    <Button onClick={() => {
        history.replace(routerBase + '/personalCenter/myBusinessReport')
    }} type='ghost'>查看我的报备记录</Button>
</div>