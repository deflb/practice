import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class infoList extends React.Component {

    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.object)
    }

    static defaultProps = {
        data: [] // [{label, value, span: 同antd 栅格}]
    }
    render() {
        const { data, className = null, style = null } = this.props;
        return (<ul className={className ? `${styles.infoList} ${className}` : styles.infoList} style={style}>
            {data.map(item => <li
                style={{ width: item.span ? `${item.span / 24 * 100}%` : null }}
                key={item.label}
            >
                <div className={styles.item}>
                    <span className={styles.label}>{item.label}</span><span className={styles.value}>{item.value}</span>
                </div>
            </li>
            )}
        </ul>)
    }
}