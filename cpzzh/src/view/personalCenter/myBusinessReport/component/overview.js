import React from 'react';
import PropTypes from 'prop-types';
import styles from './overview.less';

const Overview = ({ source, className = '', style }) => <div className={className ? `${styles.overview} ${className}` : styles.overview} style={style}>
    <p className={styles.overview_title}>您已获得</p>
    <ul className={styles.overview_content}>
        {source.map(item => (<li key={item.des} className={styles.overview_content_item}>
            <div className={styles.overview_content_item_top}><span className={styles.overview_content_item_top_number}>{item.number}</span>{item.unit}</div>
            <div className={styles.overview_content_item_footer}>{item.des}</div>
        </li>))}
    </ul>
</div>

Overview.propTypes = {
    source: PropTypes.array,
}
Overview.defaultProps = {
    source: []
}

export default Overview;