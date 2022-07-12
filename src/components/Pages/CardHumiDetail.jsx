import React, { Component } from 'react';
import $ from "jquery";
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import TableScrollbar from 'react-table-scrollbar';
import './styles1.css';
import { SessionOut } from "./Common";
import { racktemp, assettemp } from '../urls/api';

export default class CardHumiDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      message: "",
      rackid: '',
      assetid: '',
      series: [],
      series1: [],
    };
  }

  componentDidMount() {
    this.humidDetails();
    this.interval = setInterval(() => this.humidDetails(), 20 * 1000);
  }
  humidDetails = () => {
    this.setState({ error: false, message: "" });
    $("#temp_details").hide();
    // $("#chart_name").hide();
    if ($("#filter").val() === "Rack") {
      axios({ method: "GET", url: racktemp })
        .then((response) => {
          const data = response.data;
          console.log(new Date(), "Rack Response====>", response);
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#temp_details").show();
            $("#table_det thead").append(
              "<tr>" +
              "<th>S.No</th>" +
              "<th>Rack Name</th>" +
              "<th colspan='2'>Humidity(RH)</th>" +
              "<th>Chart</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              if (i === 0) {
                $("#chart_name").text("Rack Name : " + data[i].name);
                this.rackChartData(data[i].macid);
              }
              let humiddiffer = data[i].humiditydiff.toFixed(0);
              if (data[i].humiditydiff === null) {
                humiddiffer = 0;
              } else {
                humiddiffer = data[i].humiditydiff.toFixed(0);
              }
              let humid = data[i].humidity;
              if (data[i].humidity === null) {
                humid = 0;
              } else {
                humid = data[i].humidity;
              }
              let valNum = null, humidnum = null;
              if (humiddiffer > 0) {
                valNum = "<td style='color: #26df2c;'>+" + humiddiffer +
                  "  <span><i class='far fa-angle-up'></i></span></td>"
              } else if (humiddiffer < 0) {
                valNum = "<td style='color: #f00;'>" + humiddiffer +
                  "  <span><i class='far fa-angle-down'></i></span></td>";
              } else {
                valNum = "<td>--</td>";
              }

              humidnum =
                humiddiffer >= 0
                  ? "<td style='color: #26df2c;font-weight: 500'>" + humid + "</td>"
                  : "<td style='color: #f00;font-weight: 500;'>" + humid + "</td>";
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td>" +
                "<td>" +
                data[i].name +
                "</td>" +
                valNum +
                humidnum +
                "<td id=" +
                data[i].macid +
                " style='font-size: 18px;cursor:pointer;color:#00629B'><span>" +
                "<i class='fas fa-info-circle'></i></span></td></tr>"
              );
              $("#" + data[i].macid).on("click", () => {
                $("#chart_name").text("Rack Name : " + data[i].name);
                this.getChartData("rack", data[i].macid)
              });
            }
          }
          else {
            this.setState({ message: "No Rack data found!", error: true });
          }
        })
        .catch((error) => {
          console.log("ERROR====>", error);
          if (error.response.status === 404) {
            this.setState({ error: true, message: 'No Rack data found!' })
          } else if (error.response.status === 403) {
            $("#displayModal").css("display", "block");

          }
        })
    } else if ($("#filter").val() === "Asset") {
      axios({ method: "GET", url: assettemp })
        .then((response) => {
          const data = response.data;
          console.log(new Date(), "Asset Response====>", data);
          $("#table_det tbody").empty();
          $("#table_det thead").empty();
          if (data.length !== 0 && response.status === 200) {
            $("#temp_details").show();
            $("#table_det thead").append(
              "<tr>" +
              "<th>S.No</th>" +
              "<th>Asset Name</th>" +
              "<th colspan='2'>Humidity(RH)</th>" +
              "<th>Chart</th>" +
              "</tr>"
            );
            for (let i = 0; i < data.length; i++) {
              if (i === 0) {
                $("#chart_name").text("Asset Name : " + data[i].name);
                this.assetChartData(data[i].tagid);
              }
              let humiddiffer = data[i].humidityDiff;
              if (data[i].humidityDiff === null) {
                humiddiffer = 0;
              } else {
                humiddiffer = data[i].humidityDiff;
              }
              let humid = data[i].humidity;
              if (data[i].humidity === null) {
                humid = 0;
              } else {
                humid = data[i].humidity;
              }
              let valNum = null, humidnum = null;
              if (humiddiffer > 0) {
                valNum = "<td style='color: #26df2c;'>+" + humiddiffer +
                  "  <span><i class='far fa-angle-up'></i></span></td>"
              } else if (humiddiffer < 0) {
                valNum = "<td style='color: #f00;'>" + humiddiffer +
                  "  <span><i class='far fa-angle-down'></i></span></td>";
              } else {
                valNum = "<td>--</td>";
              }

              humidnum =
                humiddiffer >= 0
                  ? "<td style='color: #26df2c;font-weight: 500'>" + humid + "</td>"
                  : "<td style='color: #f00;font-weight: 500;'>" + humid + "</td>";
              $("#table_det tbody").append(
                "<tr><td>" +
                (i + 1) +
                "</td>" +
                "<td>" +
                data[i].name +
                "</td>" +
                valNum +
                humidnum +
                "<td id=" +
                data[i].tagid +
                " style='font-size: 18px;cursor:pointer;color:#00629B'><span>" +
                "<i class='fas fa-info-circle'></i></span></td></tr>"
              );
              $("#" + data[i].tagid).on("click", () => {
                $("#chart_name").text("Asset Name : " + data[i].name);
                this.getChartData("asset", data[i].tagid)
              });
            }

          } else {
            this.setState({ message: "No Asset Data Found!", error: true });
          }
        })
        .catch((error) => {
          console.log("ERROR====>", error);
          if (error.response.status === 404) {
            this.setState({ error: true, message: 'No Asset Data Found!' })
          } else if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
        })
    }
  }
  getChartData = (key, macid) => {
    clearInterval(this.interval);
    if (key === "rack") {
      this.rackChartData(macid);
      this.timeout = setTimeout(() => {
        this.componentDidMount();
      }, 2 * 60 * 1000);
    } else {
      this.assetChartData(macid);
      this.timeout = setTimeout(() => {
        this.componentDidMount();
      }, 2 * 60 * 1000);
    }
  }
  rackChartData = (macid) => {
    this.setState({
      error: false, message: '',
      message1: '', series: [], macId: macid
    })
    var date1 = new Date();
    var milliseconds1 = date1.getTime();
    let value = [];
    axios({ method: 'GET', url: '/api/rack/average?id=' + macid })
      .then((response) => {
        console.log("RackChartData response=====>", response)
        let data = response.data
        if (data.length !== 0 && response.status === 200) {
          for (let i = 0; i < data.length; i++) {
            let temp = data[i].avgHumidity;
            let chartDet = [];
            let time = data[i].lastseen;
            var date = new Date(time);
            var milliseconds = date.getTime();
            chartDet.push(milliseconds);
            chartDet.push(temp);
            value.push(chartDet);
          }
          this.setState({ series: [{ name: "Humidity", data: value }] });
        }
        else {
          this.setState({
            macId: macid, message1: "No Humidity Data Found",
            error: true, series: [{ name: "Humidity", data: [[milliseconds1]] }]
          });
        }
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        } else if (error.response.status === 404) {
          this.setState({
            macId: macid, message1: "No Humidity Data Found",
            error: true, series: [{ name: "Humidity", data: [[milliseconds1]] }]
          });
        }
        else if (error.response.status === 400) {
          this.setState({
            error: true,
            message: "Request Failed.",
          });
        } else {
          this.setState({
            error: true,
            message: "Error Occurred. Please try again.",
          });
        }
      })
  };
  assetChartData = (tagid) => {
    this.setState({
      macId: tagid, message: "", message1: '',
      error: false, series: []
    });
    let value = [];
    var date1 = new Date();
    var milliseconds1 = date1.getTime();
    axios({ method: "GET", url: "/api/track?id=" + tagid })
      .then((response) => {
        console.log(response)
        let data = response.data
        if (data.length !== 0 && response.status === 200) {
          for (let i = 0; i < data.length; i++) {
            let temp = data[i].humidityf;
            let chartDet = [];
            let time = data[i].lastseen;
            var date = new Date(time);
            var milliseconds = date.getTime();
            chartDet.push(milliseconds);
            chartDet.push(temp);
            value.push(chartDet);
          }
          this.setState({ series: [{ name: "Humidity", data: value }] });
        }
        else {
          this.setState({
            macId: tagid, message1: "No Humidity Data Found", error: true,
            series: [{ name: "Humidity", data: [[milliseconds1]] }]
          });
        }
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        } else if (error.response.status === 404) {
          this.setState({
            error: true,
            message: "No Humidity Data Found.",
          });
        }
        else if (error.response.status === 400) {
          this.setState({
            error: true,
            message: "Request Failed.",
          });
        } else {
          this.setState({
            error: true,
            message: "Error Occurred. Please try again.",
          });
        }
      })
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  };

  render() {
    const { series, message1, macId, error, message } = this.state;
    return (
      <div style={{
        float: "right", width: "95%",
        height: "100vh",
        marginRight: '0px', background: '#E5EEF0',
        paddingBottom: "20px"
      }}>

        <div style={
          { marginTop: '30px', marginLeft: '60px', }}>
          <span className='main_header'>HUMIDITY</span>
          <div className='underline'></div>

          <div style={{ display: "flex", marginTop: "30px" }}>
            <div className="inputdiv"
              style={{ marginLeft: "10px" }}>
              <select
                name="filter"
                id="filter"
                style={{ width: "175px", border: "1px solid #99d1dd" }}
                onChange={() => {
                  clearInterval(this.interval);
                  clearTimeout(this.timeout);
                  this.componentDidMount()
                }}>
                <option >Rack</option>
                <option>Asset</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ color: 'red', margin: '20px 20px' }}>
              <strong>{message}</strong>
            </div>
          )}

          <div style={{ display: "flex" }} id="temp_details">
            <div className="box" style={{ height: "70vh", marginTop: '20px' }}>
              <TableScrollbar>
                <table style={{ width: "95%" }} id="table_det">
                  <thead></thead>
                  <tbody></tbody>
                </table>
              </TableScrollbar>
            </div>

            <div
              style={{
                marginLeft: "30px",
                width: "44%", marginTop: "30px"
              }}>
              <div>
                <div
                  id="chart"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#FFF",
                    height: "70vh",
                  }}>
                  <div
                    id="chart_name"
                    style={{
                      padding: "15px",
                      fontSize: "17px",
                      color: "#00629b",
                      fontWeight: "600",
                    }}>
                  </div>
                  <div
                    style={{
                      paddingLeft: "15px",
                      fontSize: "17px",
                      color: "#00629b",
                    }}>
                    <span style={{ fontWeight: 500, color: 'red' }}>{message1}</span>
                  </div>
                  {series.length ? (
                    <div id="chart-timeline">
                      <ApexCharts
                        options={{
                          chart: {
                            id: "area-datetime",
                            type: "area",
                            height: 380,
                            curve: "smooth",
                            zoom: {
                              autoScaleYaxis: true,
                            },
                            animations: {
                              enabled: true,
                              easing: "easeinout",
                              speed: 1500,
                              animateGradually: {
                                enabled: true,
                                delay: 1500,
                              },
                              dynamicAnimation: {
                                enabled: true,
                                speed: 1500,
                              },
                            },
                          },
                          stroke: {
                            width: 2,
                          },
                          dataLabels: {
                            enabled: false,
                          },
                          markers: {
                            size: 0,
                          },
                          xaxis: {
                            type: "datetime",
                            tickAmount: 1,
                            labels: {
                              datetimeUTC: false,
                            },
                          },
                          yaxis: {
                            labels: {
                              formatter: function (value) {
                                return value.toFixed(0);
                              },
                            },
                          },
                          tooltip: {
                            x: {
                              format: "yyyy-MM-dd HH:mm:ss",
                            },
                            y: {
                              formatter: function (value) {
                                return value.toFixed(0) + "(RH)";
                              },
                            },
                          },
                          fill: {
                            type: "gradient",
                            gradient: {
                              shadeIntensity: 1,
                              opacityFrom: 0.2,
                              opacityTo: 0.9,
                            },
                          },
                          colors: ["#1a75ff"],
                        }}
                        series={series}
                        type="area"
                        height={380}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    )
  }
}
