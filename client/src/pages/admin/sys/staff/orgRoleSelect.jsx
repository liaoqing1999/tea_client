import React, { Component } from "react";
import { Select } from "antd";

class GetOrgSelect extends Component {
    componentDidMount(){
        this.getOrg()
    }
    getorg = () =>{
        
    }
    render(){
        return <Select>
            {this.getOption()}
        </Select>
    }
}
 class GetRoleSelect extends Component {
    render(){
        return <Select>
             {this.getOption()}
        </Select>
    }
}

export {GetOrgSelect, GetRoleSelect}