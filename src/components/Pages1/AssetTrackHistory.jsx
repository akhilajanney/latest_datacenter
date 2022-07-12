import React, { Component } from "react";
import { linkClicked } from "../sidebar/Leftsidebar";
import { getPagination, TableDetails, SessionOut } from "./Common";
import $ from "jquery";
import "./styles.css";
import moment from "moment";
import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export default class AssetTrackHistory extends Component {
    constructor() {
        super();
        this.state = {
            message: "",
            error: false,
            flag: false,
        };
    }
    componentDidMount() {
        linkClicked(5)
        let data = sessionStorage.getItem("assethistory")
        let jsonData = JSON.parse(data)
        this.getTableDetails(jsonData);
        // this.interval = setInterval(() => {
        //     this.getTableDetails(jsonData);
        // }, 15 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getTableDetails = (data) => {
        console.log("showAssetHistory====", data);
        $(".pagination").hide();
        $("#rangeDropdown").hide();
        $("#table_det tbody").empty();
        $("#table_det thead").empty();
        $("#table_det thead").append(
            "<tr>" +
            "<th>SNO</th>" +
            "<th>RACK NAME</th>" +
            "<th>ASSET NAME</th>" +
            "<th>START TIME</th>" +
            "<th>END TIME</th>" +
            "<th>DURATION</th>" +
            "</tr>"
        );
        for (let i = 0; i < data.length; i++) {
            let rack = data[i].rack === null ? "Outside" : data[i].rack.name;
            let startTime = data[i].starttime.replace("T", " ").substr(0, 19);
            let endTime = data[i].endtime.replace("T", " ").substr(0, 19)
            let diff = (new Date(endTime) - new Date(startTime)) / 1000;
            let hh = Math.floor(diff / 3600);
            if (hh < 10) hh = "0" + hh;
            let mm = Math.floor((diff % 3600) / 60);
            if (mm < 10) mm = "0" + mm;
            let ss = Math.floor((diff % 3600) % 60);
            if (ss < 10) ss = "0" + ss;
            let duration = hh + ":" + mm + ":" + ss;
            $("#table_det tbody").append(
                "<tr class=row_" + (i + 1) + ">" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + rack + "</td>" +
                "<td>" + data[i].tagid.name + "</td>" +
                "<td>" + startTime + "</td>" +
                "<td>" + endTime + "</td>" +
                "<td>" + duration + "</td> " +
                "</tr>"
            )
        }
        if (data.length > 25) {
            $(".pagination").show();
            $("#rangeDropdown").show();
            getPagination(this, "#table_det");
        }
    };

    render() {
        const { message, error } = this.state;
        return (
            <div
                id='divheight'
                style={{
                    float: "right",
                    width: "95%",
                    background: "#E5EEF0",
                    height: "100vh",
                    marginLeft: "60px",
                }}>
                <div style={{ marginTop: "30px", marginLeft: "60px" }}>
                    <span className="main_header">ASSET TRACKING HISTORY</span>
                    <div className="underline"></div>
                    {error && (
                        <div style={{ color: "red", marginTop: "20px" }}>
                            <strong>{message}</strong>
                        </div>
                    )}
                    <TableDetails />
                </div>

                {/* SessionOut Component used here!  */}
                <SessionOut />
            </div>
        );
    }
}
