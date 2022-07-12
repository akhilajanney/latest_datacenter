import React, { Component } from "react";
import { alert_asset, alert_humi, alert_temp, alert_freefall } from "../urls/api";
import axios from "axios";
import $ from "jquery";
import { linkClicked } from "../sidebar/Leftsidebar";
import { getPagination, TableDetails, SessionOut } from "./Common";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Alerts extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      error: false,
    };
  }
  componentDidMount() {
    linkClicked(4);
    this.getTableDetails();
    this.interval = setInterval(this.getTableDetails, 15 * 1000)
  }
  getTableDetails = () => {
    this.setState({ message: "", error: false });
    if ($("#alerttype").val() === 'Asset') {
      axios({ method: "GET", url: alert_asset })
        .then((response) => {
          const data = response.data;
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          console.log("Asset Response====>", data);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>ASSET ID</th>" +
              "<th>ALERT TYPE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                "Asset" +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              $('#divheight').css('height', 'fit-content')
              getPagination(this, "#table_det");
            } else {
              $('#divheight').css('height', '100vh')
            }
            if (data.length > 10) {
              $('#divheight').css('height', 'fit-content')
            }
          } else {
            $('#divheight').css('height', '100vh')
            this.setState({ message: "No Asset Alert data found!", error: true });
          }
        })
        .catch((error) => {
          console.log("ERROR====>", error);
          if (error.response.status === 404) {
            this.setState({ message: "No Asset Alert data found!", error: true });
          } else if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
    else if ($("#alerttype").val() === 'Temperature') {
      axios({ method: "GET", url: alert_temp })
        .then((response) => {
          const data = response.data;
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          console.log('Temperature=====>', data);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det tbody").empty();
            $("#table_det thead").empty();

            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>MAC ID</th>" +
              "<th>TEMPERATURE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                data[i].temperature +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              $('#divheight').css('height', 'fit-content')
              getPagination(this, "#table_det");
            } else {
              $('#divheight').css('height', '100vh')
            }
            if (data.length > 10) {
              $('#divheight').css('height', 'fit-content')
            }
          } else {
            this.setState({ message: "No Temperature Alert data found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Health Slave gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    } else if ($("#alerttype").val() === 'Humidity') {
      axios({ method: "GET", url: alert_humi })
        .then((response) => {
          const data = response.data;
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          console.log('=====>', response);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det tbody").empty();
            $("#table_det thead").empty();

            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>MAC ID</th>" +
              "<th>HUMIDITY</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                data[i].humidity +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              $('#divheight').css('height', 'fit-content')
              getPagination(this, "#table_det");
            } else {
              $('#divheight').css('height', '100vh')
            }
            if (data.length > 10) {
              $('#divheight').css('height', 'fit-content')
            }
          } else {
            this.setState({ message: "No Humidity Alert data found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Health assests tag gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    } else if ($("#alerttype").val() === 'Free Fall') {
      axios({ method: "GET", url: alert_freefall })
        .then((response) => {
          const data = response.data;
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          console.log('FreeFall=====>', data);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det tbody").empty();
            $("#table_det thead").empty();
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>MAC ID</th>" +
              "<th>ALERT TYPE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td><td>" +
                data[i].macid.tagid +
                "</td><td>" +
                "Free Fall" +
                "</td><td>" +
                data[i].lastseen.replace("T", " ").substr(0, 19) +
                "</td></tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              $('#divheight').css('height', 'fit-content')
              getPagination(this, "#table_det");
            } else {
              $('#divheight').css('height', '100vh')
            }
            if (data.length > 10) {
              $('#divheight').css('height', 'fit-content')
            }
          } else {
            this.setState({ message: "No Freefall Alert data found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Health Slave gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
  };


  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  render() {
    const { error, message } = this.state;
    return (
      <div id='divheight'
        style={{
          float: "right",
          width: "95%",
          background: "#E5EEF0",
          height: "100vh",
          marginLeft: "60px",
        }}
      >
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">ALERTS</span>
          <div className="underline"></div>

          <div style={{ marginTop: "30px" }}>
            <span className="label">Alert:</span>
            <select style={{ marginBottom: '30px' }}
              name="alerttype"
              id="alerttype"
              required="required"
              onChange={this.getTableDetails}
            >
              <option>Asset</option>
              <option>Temperature</option>
              <option>Humidity</option>
              <option>Free Fall</option>
            </select>
            {error && (
              <div
                style={{ color: "red" }}>
                <strong>{message}</strong>
              </div>
            )}
          </div>
          <TableDetails />
        </div>

        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
