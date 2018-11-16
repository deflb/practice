import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd-mobile';
import { imgAddress, crmFileAddress } from '../../request/baseURL';
import api from '../../request/api';
import styles from './index.less';
const dotStyle = {
    width: '24px', height: '4px', borderRadius: 'unset'
}

export default class customCarousel extends Component {
    static propTypes = {
        isCrm: PropTypes.bool,
        source: PropTypes.array,
    }
    static defaultProps = {
        isCrm: false,
        source: []
    }
    render() {
        const { source, isCrm } = this.props;
        return <Carousel
            autoplay={false}
            infinite
            dotStyle={dotStyle}
            dotActiveStyle={dotStyle}
            className={styles.wrapper}
        >
            {source.map((item, index) => (
                <div
                    key={index}
                    className={styles.wrapper_item}
                >
                    {item ? <img
                        src={isCrm ? crmFileAddress + api.crmFileUrl(item.fimgpath) : imgAddress + item}
                        alt=""
                        onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                        }}
                    /> : null}
                </div>
            ))}
        </Carousel>
    }
}