import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import { getDisplayName } from '../../../utlis';
import styles from './fullC.less';

export default flag => WrappedComponent => class extends Component {

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    goToAppointment = () => {
        const { match, history, location, userInfo } = this.props,
            { state = {} } = location;
        if (userInfo.customerId)
            history.push({
                pathname: match.path + '/measureRoom',
                state: { ...state, flag }
            })
        else
            Toast.info('请前往个人中心进行验证后再进行操作!')
    }

    render() {
        return <div className={styles.wrapper}>
            <WrappedComponent {...this.props} />
            <div className={styles.wrapper_footer}>
                <Button type='warning' onClick={this.goToAppointment}>预约量房</Button>
            </div>
        </div>
    }
}