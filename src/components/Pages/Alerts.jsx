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
      img1: [],
      img2: [],
      img3: [],
      rackid: "",
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
          console.log("Asset Response====>", response);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>RACK NAME</th>" +
              "<th>ASSET NAME</th>" +
              "<th>ASSET ID</th>" +
              // "<th>ALERT TYPE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].rack.name + "</td>" +
                "<td>" + data[i].macid.name + "</td>" +
                "<td>" + data[i].macid.tagid + "</td>" +
                // "<td>Asset</td>"+
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "</tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
          } else {
            this.setState({ message: "No Asset Alert Data Found!", error: true },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
        .catch((error) => {
          console.log("ERROR====>", error);
          if (error.response.status === 404) {
            this.setState({ message: "No Asset Alert Data Found!", error: true },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
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
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          console.log('Temperature=====>', response);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>RACK NAME</th>" +
              "<th>ASSET NAME</th>" +
              "<th>ASSET ID</th>" +
              "<th>TEMPERATURE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].rack.name + "</td>" +
                "<td>" + data[i].macid.name + "</td>" +
                "<td>" + data[i].macid.tagid + "</td>" +
                "<td>" + data[i].temperature + "</td>" +
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "</tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
          } else {
            this.setState({ message: "No Temperature Alert Data Found!", error: true });
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
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          console.log('Humidity=====>', response);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>RACK NAME</th>" +
              "<th>ASSET NAME</th>" +
              "<th>ASSET ID</th>" +
              "<th>HUMIDITY</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr><td>" + (i + 1) + "</td>" +
                "<td>" + data[i].rack.name + "</td>" +
                "<td>" + data[i].macid.name + "</td>" +
                "<td>" + data[i].macid.tagid + "</td>" +
                "<td>" + data[i].humidity + "</td>" +
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "</tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
          } else {
            this.setState({ message: "No Humidity Alert Data Found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Health assests tag gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
    else if ($("#alerttype").val() === 'Free Fall') {
      axios({ method: "GET", url: alert_freefall })
        .then((response) => {
          const data = response.data;
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          console.log('FreeFall=====>', response);
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>RACK NAME</th>" +
              "<th>ASSET NAME</th>" +
              "<th>ASSET ID</th>" +
              // "<th>ALERT TYPE</th>" +
              "<th>LAST SEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].rack.name + "</td>" +
                "<td>" + data[i].macid.name + "</td>" +
                "<td>" + data[i].macid.tagid + "</td>" +
                // "<td>" + "Free Fall" + "</td>" +
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "</tr>"
              )
            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
          } else {
            this.setState({ message: "No Freefall Alert Data Found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Health Slave gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    } else if ($("#alerttype").val() === 'Images') {
      axios({ method: "GET", url: "/api/alert/asset" })
        .then((response) => {
          const data = response.data;
          console.log('image====>', response)
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>PARENT RACK</th>" +
              "<th>ASSET NAME</th>" +
              "<th>ASSET CURRENT POSITION</th>" +
              "<th>ASSET LAST POSITION</th>" +
              "<th>LAST SEEN</th>" +
              "<th>IMAGE</th>" +
              "</tr>"
            );
            let count = 0;
            for (let i = 0; i < data.length; i++) {
              let time = data[i].lastseen.replace("T", " ").substr(0, 19);
              let currPos = data[i].placedIN === null ? "Outside" : data[i].placedIN.name;
              let lastPos = data[i].removedFrom === null ? "Outside" : data[i].removedFrom.name;
              if (currPos !== lastPos) {
                $("#table_det tbody").append(
                  "<tr>" +
                  "<td>" + (count + 1) + "</td>" +
                  "<td>" + data[i].macid.rackno.name + "</td>" +
                  "<td>" + data[i].macid.name + "</td>" +
                  "<td>" + currPos + "</td>" +
                  "<td>" + lastPos + "</td>" +
                  "<td>" + time + "</td>" +
                  "<td><div class='imgdiv' id='imgClick" + i + "'><i class='fas fa-camera-alt'></i></div></td> " +
                  "</tr>"
                )
                $("#imgClick" + i).on("click", () => {
                  this.showImage(time, data[i].macid.rackno.macid)
                })
                count += 1;
              }
            }
            if (count > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
            if (count === 0) {
              this.setState({ message: "No Image Alert Data Found!", error: true });
            }
          } else {
            this.setState({ message: "No Image Alert Data Found!", error: true });
          }
        })
        .catch((error) => {
          console.log('image Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
  };

  showImage = (time, macid) => {
    this.setState({ message: "", error: false });
    $(".img-container").css("display", "none");
    // $("#divheight").removeClass("active1")
    axios({ method: "GET", url: "/api/image?time=" + time })
      .then((response) => {
        const data = response.data;
        console.log("Image URLS=====>", response.data);
        var images = $(".img_wrap");
        var animationDuration = 500;
        $.each(images, function (index, item) {
          $(this).delay(animationDuration * index).fadeIn(animationDuration);
        })

        if (data.length !== 0) {
          this.setState({ rackid: macid })
          $(".img-container").css("display", "block");
          // $("#divheight").addClass("active1");
          for (let i = 0; i < data.length; i++) {
            if (data.length === 1) {
              $("#img1").css("width", "100%");
              $(".img-container").css("width", "49%");
            }
            if (i === 0) {
              $("#img1").attr("src", data[i].image);
              $("#img1").attr('title', "Rack id : " + macid)
              $("#img1").css("display", "block");
            } else if (i === 1) {
              $("#img2").attr("src", data[i].image);
              $("#img2").attr('title', "Rack id : " + macid)
              $("#img2").css("display", "block");
            } else if (i === 2) {
              $("#img3").attr("src", data[i].image)
              $("#img3").attr('title', "Rack id : " + macid)
              $("#img3").css("display", "block");
            }
          }
          $("html").animate({ scrollTop: 0 }, "slow");
        }
        else {
          $("html").animate({ scrollTop: 0 }, "slow");
          this.setState({ message: "No Image Alert Data Found!", error: true },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
      })
      .catch((error) => {
        console.log('image Error====', error);
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        } else if (error.response.status === "404") {
          $("html").animate({ scrollTop: 0 }, "slow");
          this.setState({ message: "No Image Alert Data Found!", error: true },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
      })
  }

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
  };

  render() {
    const { error, message, rackid } = this.state;
    return (
      <div id='divheight'
        style={{
          float: "right",
          width: "95%",
          background: "#E5EEF0",
          height: "100vh",
          marginLeft: "60px",
        }}>
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">ALERTS</span>
          <div className="underline"></div>

          <div style={{ marginTop: "30px" }}>
            <span className="label">Alert:</span>
            <select style={{ marginBottom: '30px' }}
              name="alerttype"
              id="alerttype"
              required="required"
              onChange={this.getTableDetails}>
              <option>Images</option>
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


        <div className="img-container" >
          <div className="hideimg">
            <span ><i className="far fa-times-circle"
              onClick={() => {
                $(".img-container").css("display", "none");
                // $("#divheight").removeClass("active1")
              }}>
            </i></span>
          </div>
          <div
            style={{
              padding: "15px",
              fontSize: "17px",
              color: "#00629b",
            }}>
            <b>RACK ID : {rackid}</b>
          </div>
          <div style={{ display: 'flex' }}>
            <div className="img_wrap">
              <img id="img1" src="" alt="img1" style={{ display: "none" }} className="img" />
            </div>
            <div className="img_wrap">
              <img id="img2" src="" alt="img2" style={{ display: "none" }} className="img" />
            </div>
            <div className="img_wrap">
              <img id="img3" src="" alt="img3" style={{ display: "none" }} className="img" />
            </div>
          </div>
        </div>
        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
