import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { upload_floormap, asset_rack_det, assettag_det } from "../urls/api";
import { getPagination, TableDetails, SessionOut } from "./Common";
import { linkClicked } from "../sidebar/Leftsidebar";


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Assetdetail extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      error: false,
      flag: false,
    };
  }

  componentDidMount() {
    linkClicked(5);
    sessionStorage.removeItem("assethistory");
    axios({ method: "GET", url: upload_floormap })
      .then((response) => {
        if (response.status === 200 && response.data.length !== 0) {
          for (let i = 0; i < response.data.length; i++) {
            $("#fname").append(
              "<option value=" +
              response.data[i].id +
              ">" +
              response.data[i].name +
              "</option>"
            );
          }
          this.getTableDetails();
          this.interval = setInterval(() => {
            this.getTableDetails();
          }, 15 * 1000);
        } else {
          this.setState({
            error: true,
            message: "No floor Map Details Found.",
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        } else {
          this.setState({
            error: true,
            message: "Error occurred. Please try again.",
          });
        }
      });
  }

  getTableDetails = () => {
    this.setState({ message: "", error: false });
    let activeBtn = $('.myDIV').find('button.active').attr('id');
    if (activeBtn === "rackBtn") {
      axios({ method: "GET", url: "/api/rack/monitor?floorid=0" })
        .then((response) => {
          const data = response.data.asset;
          console.log("rackBtn=====>", response);
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>RACK NAME</th>" +
              "<th>CAPACITY</th>" +
              "<th>NO.OF ASSETS</th>" +
              "<th>AVAILABLE USE</th>" +
              "<th>UNIT USAGE</th>" +
              "<th>LASTSEEN</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              let status = "red";
              if (new Date() - new Date(data[i].timestamp) <= 2 * 60 * 1000) {
                status = "green";
              }
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].name + "</td>" +
                "<td>" + data[i].capacity + "</td>" +
                "<td>" + data[i].count + "</td>" +
                "<td>" + data[i].available + "</td>" +
                "<td>" + data[i].usage + "</td>" +
                "<td>" + data[i].timestamp.substring(0, 19).replace("T", " ") + "</td>" +
                // "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td>" +
                "</tr>"
              )

            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
          } else {
            this.setState({ message: "No Rack Details found!", error: true });
          }
        })

        .catch((error) => {
          console.log("ERROR====>", error);
          if (error.response.status === 404) {
            this.setState({ error: true, message: 'No Data Found!' })
          } else if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
    else if (activeBtn === "assetBtn") {
      axios({ method: "GET", url: assettag_det })
        .then((response) => {
          const data = response.data;
          console.log('assettag_det=====>', response);
          $(".pagination").hide();
          $("#rangeDropdown").hide();
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#table_det thead").append(
              "<tr>" +
              "<th>SNO</th>" +
              "<th>ASSET NAME</th>" +
              "<th>RACK NAME</th>" +
              "<th>UNIT USAGE</th>" +
              // "<th>LAST SEEN</th>" +
              // "<th>STATUS</th>" +
              "<th>HISTORY</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              let rackname = data[i].placedIn.name === null ? "Outside" : data[i].placedIn.name
              
              let status = "red";
              if (new Date() - new Date(data[i].lastseen) <= 2 * 60 * 1000) {
                status = "green";
              }
              $("#table_det tbody").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].name + "</td>" +
                "<td>" + rackname + "</td>" +
                "<td>" + data[i].usage + "</td>" + 
                // "<td> " +
                // data[i].lastseen.replace("T", " ").substr(0, 19) +
                // "</td>" +
                // "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td > " +
                 "<td><div class='imgdiv' id='imgClick" + i + "'><i class='fas fa-info-circle'></i></div></td> " +
                "</tr>"
              );

              $("#imgClick" + i).on("click", (e) => {
                this.showAssetHistory(e, data[i].id)
                setInterval((e) => {
                  this.showAssetHistory(e, data[i].id)
                }, 15* 1000)
              })

            }
            if (data.length > 25) {
              $(".pagination").show();
              $("#rangeDropdown").show();
              getPagination(this, "#table_det");
            }
          } else {
            this.setState({ message: "No Asset Details found!", error: true });
          }
        })
        .catch((error) => {
          console.log('Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
  };

  showAssetHistory = (e, id) => {
    e.preventDefault()
    this.setState({ error: false, message: "" })
    axios({ method: "GET", url: "/api/asset/rack/tracking?id=" + id })
      .then((response) => {
        console.log("showAssetHistory====", response);
        let data = response.data;
        if (data.length !== 0 && response.status === 200) {
          sessionStorage.setItem("assethistory", JSON.stringify(data));
          window.location.pathname = "/assettrackhistory"
        } else {
          $("html").animate({ scrollTop: 0 }, "slow");
          this.setState({ error: true, message: "No Asset History Data Found!" })
          this.timeout = setTimeout(() => {
            this.setState({ error: false, message: "" })
          }, 5 * 1000)
        }
      })
      .catch((error) => {
        console.log('Health Slave gate Error====', error);
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        } else if (error.response.status === 404) {
          $("html").animate({ scrollTop: 0 }, "slow");
          this.setState({ error: true, message: "No Asset History Data Found!" })
          this.timeout = setTimeout(() => {
            this.setState({ error: false, message: "" })
          }, 5 * 1000)
        }
      })
  }

  btnOption = (e) => {
    $(".myDIV").parent().find('button').removeClass("active");
    this.setState({ flag: true });
    $("#" + e.target.id).addClass("active");
    this.getTableDetails()
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  render() {
    const { message, error } = this.state;
    return (
      <div id='divheight'
        style={{
          float: "right",
          width: "95%",
          background: "#E5EEF0",
          marginLeft: "60px",

        }}>
        <div style={{ marginTop: "30px", marginLeft: "60px", }}>
          <span className="main_header">ASSET DETAILS</span>
          <div className="underline" style={{ marginBottom: "30px" }}></div>
          <div style={{ display: "flex" }} className="myDIV"
            onClick={this.btnOption}>
            <button id="assetBtn"
              className="fancy-button active">
              Asset Tags
            </button>
            <button id="rackBtn"
              className="fancy-button ">
              Rack Details
            </button>
          </div>

          <div style={{ marginTop: "30px", display: "none" }} id="rackmonitor">
            <div className="inputdiv">
              <span className="label">Floor Name :</span>
              <select
                name="fname"
                id="fname"
                required="required"
                onChange={this.getTableDetails}
              />
            </div>
          </div>
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
