import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import { getDisplayName } from '../../../utlis';
import styles from './fullC.less';

export default flag => WrappedComponent => class extends Component {

    static displayName = `HOC${getDisplayName(WrappedComponent)}`;

    goToAppointment = () => {
        const { match, history, location } = this.props,
            { state = {} } = location;
        history.push({
            pathname: match.path + '/measureRoom',
            state: { ...state, flag }
        })
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