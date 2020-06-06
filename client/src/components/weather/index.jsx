import React, { Component } from 'react'
import { reqWeather } from '../../api'
import { withRouter } from 'react-router-dom'
import sessionUtils from '../../utils/sessionUtils'
import './index.less'
class Weather extends Component {
    state = {
        dayPictureUrl: '',
        weather: '',
    }
    componentDidMount() {
        //获取当前天气
        this.getWeather()
    }
    getWeather = async () => {
        let weatherList = sessionUtils.get("weatherList")
        if (weatherList) {
        } else {
            weatherList = await reqWeather('changsha')
            sessionUtils.save("weatherList", weatherList)
        }
        const { dayPictureUrl, weather } = weatherList.results[0].weather_data[0]
        this.setState({ dayPictureUrl, weather })
    }
    onClick =() =>{
        if(this.props.location.pathname==='/admin/weather/detail'){

        }else if(this.props.location.pathname.indexOf('admin')!==-1){
            this.props.history.push("/admin/weather/detail")
        }else{
            this.props.history.push("/main/weather/detail")
        }
    }
    render() {
        const { dayPictureUrl, weather } = this.state;
        return (<span onClick={this.onClick} className="weather">
            <img src={dayPictureUrl}></img>
            <span>{weather}</span>
        </span>)
    }
}

export default withRouter(Weather)