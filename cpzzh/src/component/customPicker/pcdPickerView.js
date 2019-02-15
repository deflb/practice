import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { request } from '../../request';
import api from '../../request/api';
import styles from './pcdPickerView.less';

export default class pcdPickerView extends Component {
    state = {
        province: [],
        city: [],
        district: [],
        provinceMove: 0,
        cityMove: 0,
        districtMove: 0,
    }
    static propTypes = {
        height: PropTypes.number,
        itemHeight: PropTypes.number,
        value: PropTypes.array, // [{省id},{市id},{区县id}]
        onChange: PropTypes.func, // 参数为选择的省市区县信息
    }
    static defaultProps = {
        height: 200,
        itemHeight: 40,
        value: [],
        onChange: () => { }
    }
    componentDidMount() {
        const { value } = this.props;
        this.result = value;
        this.init();
    }
    getCity = provinceId => request({ url: api.getCity, data: { provinceId } })
    getDistrict = cityId => request({ url: api.getDistrict, data: { cityId } })
    init = () => {
        request({ url: api.getProvince }).then(province => {
            this.setState({ province });
            const { value, onChange, itemHeight } = this.props;
            if (value[0] && (value[0].id || value[0].id === 0)) { // 有初始值 省id
                const currentProvinceIndex = province.findIndex(item => item.id === value[0].id);
                this.setState({ provinceMove: currentProvinceIndex * -itemHeight });
                this.getCity(value[0].id).then(city => {
                    const firstProvince = province[currentProvinceIndex];
                    this.setState({ city });
                    if (value[1] && (value[1].id || value[1].id === 0)) { // 有初始值 市id
                        const currentCityIndex = city.findIndex(item => item.id === value[1].id);
                        this.setState({ cityMove: currentCityIndex * -itemHeight });
                        this.getDistrict(value[1].id).then(district => {
                            this.setState({ district });
                            let currentDistrictIndex = 0;
                            if (value[2] && (value[2].id || value[2].id === 0)) { // 有初始值 区县id
                                currentDistrictIndex = district.findIndex(item => item.id === value[2].id);
                                this.setState({ districtMove: currentDistrictIndex * -itemHeight })
                            }
                            this.result = [firstProvince, city[currentCityIndex], district[currentDistrictIndex]];
                            onChange([firstProvince, city[currentCityIndex], district[currentDistrictIndex]]);
                        })
                    } else {
                        const firstCity = city[0];
                        this.getDistrict(firstCity.id).then(district => {
                            const firstDistrict = district[0];
                            this.result = [firstProvince, firstCity, firstDistrict];
                            onChange([firstProvince, firstCity, firstDistrict]);
                            this.setState({ district });
                        })
                    }
                })
            } else {
                const firstProvince = province[0];
                this.getCity(firstProvince.id).then(city => {
                    const firstCity = city[0];
                    this.setState({ city });
                    this.getDistrict(firstCity.id).then(district => {
                        const firstDistrict = district[0];
                        this.setState({ district });
                        this.result = [firstProvince, firstCity, firstDistrict];
                        onChange([firstProvince, firstCity, firstDistrict])
                    })
                })
            }
        })
    }

    onProvinceTouchStart = (e) => { this.provinceStartPageY = e.targetTouches[0].pageY }
    onCityTouchStart = (e) => { this.cityStartPageY = e.targetTouches[0].pageY }
    onDistrictTouchStart = (e) => { this.districtStartPageY = e.targetTouches[0].pageY }
    onProvinceTouchMove = (e) => {
        const { pageY } = e.targetTouches[0];
        this.setState({ provinceMove: pageY - this.provinceStartPageY + (this.provinceCurrentPageY || 0) })
    }
    onCityTouchMove = (e) => {
        const { pageY } = e.targetTouches[0];
        this.setState({ cityMove: pageY - this.cityStartPageY + (this.cityCurrentPageY || 0) })
    }
    onDistrictTouchMove = (e) => {
        e.preventDefault();
        const { pageY } = e.targetTouches[0];
        this.setState({ districtMove: pageY - this.districtStartPageY + (this.districtCurrentPageY || 0) })
    }
    onProvinceTouchEnd = (e) => {
        const { province } = this.state, { itemHeight } = this.props;
        let { provinceMove } = this.state, ys = Math.abs(provinceMove % itemHeight), index = 0;
        if (provinceMove > 0) {
            index = 0;
        } else if (provinceMove <= (province.length - 1) * -itemHeight) {
            index = province.length - 1;
        } else if (ys !== 0) {
            const _move = parseInt(Math.abs(provinceMove) / itemHeight);
            if (ys >= itemHeight / 2) {
                index = _move + 1;
            } else {
                index = _move;
            }
        }
        const current = province[index];
        if (this.result[0].id !== current.id) {
            this.result[0] = current;
            this.getCity(current.id).then(city => {
                this.setState({ city, cityMove: 0 });
                this.result[1] = city[0];
                this.cityCurrentPageY = 0;
                this.getDistrict(city[0].id).then(district => {
                    this.setState({ district, districtMove: 0 });
                    this.result[2] = district[0];
                    this.districtCurrentPageY = 0;
                    this.props.onChange(this.result);
                })
            })
        }
        this.provinceCurrentPageY = index * -itemHeight;
        this.setState({ provinceMove: index * -itemHeight });
    }
    onCityTouchEnd = (e) => {
        const { city } = this.state, { itemHeight } = this.props;
        let { cityMove } = this.state, ys = Math.abs(cityMove % itemHeight), index = 0;
        if (cityMove > 0) {
            index = 0;
        } else if (cityMove <= (city.length - 1) * -itemHeight) {
            index = city.length - 1;
        } else if (ys !== 0) {
            const _move = parseInt(Math.abs(cityMove) / itemHeight);
            if (ys >= itemHeight / 2) {
                index = _move + 1;
            } else {
                index = _move;
            }
        }
        const current = city[index];
        if (this.result[1].id !== current.id) {
            this.result[1] = current;
            this.getDistrict(current.id).then(district => {
                this.setState({ district, districtMove: 0 });
                this.districtCurrentPageY = 0;
                this.result[2] = district[0];
                this.props.onChange(this.result);
            })
        }
        this.cityCurrentPageY = index * -itemHeight;
        this.setState({ cityMove: index * -itemHeight });
    }
    onDistrictTouchEnd = (e) => {
        const { district } = this.state, { itemHeight } = this.props;
        let { districtMove } = this.state, ys = Math.abs(districtMove % itemHeight), index = 0;
        if (districtMove > 0) {
            index = 0;
        } else if (districtMove <= (district.length - 1) * -itemHeight) {
            index = district.length - 1;
        } else if (ys !== 0) {
            const _move = parseInt(Math.abs(districtMove) / itemHeight);
            if (ys >= itemHeight / 2) {
                index = _move + 1;
            } else {
                index = _move;
            }
        }
        const current = district[index];
        if (this.result[2].id !== current.id) {
            this.result[2] = current;
            this.props.onChange(this.result);
        }
        this.districtCurrentPageY = index * -itemHeight;
        this.setState({ districtMove: index * -itemHeight });
    }
    render() {
        const { province, provinceMove, city, cityMove, district, districtMove } = this.state,
            { height, itemHeight } = this.props,
            distance = (height - itemHeight) / 2;
        return (<ul className={styles.wrapper} style={{ height }}>
            <li onTouchStart={this.onProvinceTouchStart} onTouchMove={this.onProvinceTouchMove} onTouchEnd={this.onProvinceTouchEnd}>
                <div className={styles.mask} style={{ backgroundSize: `100% ${distance}px` }} />
                <div className={styles.indicator} style={{ height: itemHeight, top: distance }} />
                <ul className={styles.content} style={{ transform: `translate3d(0px, ${provinceMove}px, 0px)`, paddingTop: distance }}>
                    {province.map(item => (<li key={item.id} style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}>{item.name}</li>))}
                </ul>
            </li>
            <li onTouchStart={this.onCityTouchStart} onTouchMove={this.onCityTouchMove} onTouchEnd={this.onCityTouchEnd}>
                <div className={styles.mask} style={{ backgroundSize: `100% ${distance}px` }} />
                <div className={styles.indicator} style={{ height: itemHeight, top: distance }} />
                <ul className={styles.content} style={{ transform: `translate3d(0px, ${cityMove}px, 0px)`, paddingTop: distance }}>
                    {city.map(item => (<li key={item.id} style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}>{item.name}</li>))}
                </ul>
            </li>
            <li onTouchStart={this.onDistrictTouchStart} onTouchMove={this.onDistrictTouchMove} onTouchEnd={this.onDistrictTouchEnd}>
                <div className={styles.mask} style={{ backgroundSize: `100% ${distance}px` }} />
                <div className={styles.indicator} style={{ height: itemHeight, top: distance }} />
                <ul className={styles.content} style={{ transform: `translate3d(0px, ${districtMove}px, 0px)`, paddingTop: distance }}>
                    {district.map(item => (<li key={item.id} style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}>{item.name}</li>))}
                </ul>
            </li>
        </ul>)
    }
}