import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import Chart from "react-apexcharts";
import ApexCharts from "react-apexcharts";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const graphBtn = {
  width: "150px",
  height: "35px",
  border: "none",
  marginLeft: "15px",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
  color: "Black",
  fontWeight: "bold",
  boxShadow: "3px 3px 5px 3px rgba(0, 0, 0, 0.25)",
};

export default class Tracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: false,
      loading: false,
      rackID: "",
      assetMacId: "",
      detailsKey: "asset",
      details: [0, 0, 0],
      series: [],
      series1: [],
      options: {
        chart: {
          id: "area-datetime",
          // type: 'line',
          height: 450,
          foreColor: "#004d99", // labels colors
          curve: "smooth",
          zoom: {
            autoScaleYaxis: true,
          },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1500,
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
          // colors: ['#008FFB']
        },
        xaxis: {
          type: "datetime",
          // tickAmount: 1,
          labels: {
            datetimeUTC: false,
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            },
          },
        },
        tooltip: {
          x: {
            format: "yyyy-MM-dd HH:mm:ss",
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
        // colors: ['#F44336'],
      },
      series3: [],
      options1: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: true,
          },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1500,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 1],
          curve: "smooth",
        },
        title: {
          text: "Page Statistics",
          align: "left",
        },
        legend: {
          tooltipHoverFormatter: function (val, opts) {
            return (
              val +
              " - " +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              ""
            );
          },
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6,
          },
        },
        xaxis: {
          categories: [],
          // categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
          //     '10 Jan', '11 Jan', '12 Jan'
          // ],
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val) {
                  return val;
                },
              },
            },
            {
              title: {
                formatter: function (val) {
                  return val;
                },
              },
            },
          ],
        },
        grid: {
          borderColor: "#f1f1f1",
        },
      },
    };
  }

  componentDidMount() {
    // linkClicked("option7");
    axios({
      method: "GET",
      url: "/api/uploadmap",
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("=======>", response);
        if (response.status === 201 || response.status === 200) {
          this.fdata = response.data;
          if (this.fdata.length !== 0) {
            $("#floorBlock").css("display", "block");
            for (let i = 0; i < this.fdata.length; i++) {
              $("#fname").append(
                "<option value=" + i + ">" + this.fdata[i].name + "</option>"
              );
            }
            this.floorData = response.data;
            this.plotFloorMap();
          } else {
            this.setState({
              error: true,
              message: "Please upload a floormap.",
            });
          }
        } else {
          this.setState({ error: true, message: "Unable to get Floor Map." });
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#sessionModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 400) {
          this.setState({ error: true, message: "Bad Request!" });
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: "No data Found!" });
        }
      });
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  plotFloorMap = () => {
    this.setState({ error: false, message: "" });
    let floorID = $("#fname").val();
    this.fimage = this.floorData[floorID];
    this.fWidth = this.fimage.width;
    this.fHeight = this.fimage.height;
    $("#tempimg").attr("src", "../images/Rack_Sensing.png");
    $("#tempimg").attr("style", "width:" + "auto;" + "height:" + "auto;");
    $("#lastupdated").css("display", "none");
    $("#temp").children("div").remove();
    $("#tempChart").remove();
    $("#temp .sensors").remove();
    $("#graphBlock").css("display", "none");
    $("input[type=text]").val("");
    this.timeout = setTimeout(() => {
      this.rackMonitor();
    }, 2 * 1000);
  };

  rackMonitor = () => {
    let floorID = $("#fname").val();
    this.setState({ error: false, message: "" });
    this.wp = document.getElementById("temp").clientWidth;
    this.hp = document.getElementById("temp").clientHeight;
    this.setState({ rackID: "" });
    axios({
      method: "GET",
      url: "/api/rack/monitor?floorid=" + this.floorData[floorID].id,
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let wpx = this.wp / this.fWidth;
          let hpx = this.hp / this.fHeight;
          console.log("response=====>", response);
          if (response.data.length !== 0) {
            let data = response.data.asset;
            $("#tempimg").attr(
              "style",
              "width:" + this.wp + "px;" + "height:" + this.hp + "px;"
            );
            for (let i = 0; i < data.length; i++) {
              let xaxis = 0,
                yaxis = 0;
              xaxis = parseInt(wpx * parseFloat(data[i].x));
              yaxis = parseInt(hpx * parseFloat(data[i].y));
              let width = Math.ceil((data[i].x1 - data[i].x) * wpx);
              let height = Math.ceil((data[i].y1 - data[i].y) * hpx);
              let childDiv1 = document.createElement("div");
              $(childDiv1).attr("id", data[i].rack);
              $(childDiv1).attr("class", "rack");
              $(childDiv1).attr(
                "title",
                "RackID: " +
                  data[i].rack +
                  "\nCapacity : " +
                  data[i].capacity +
                  "\nNo.of Assets : " +
                  data[i].count +
                  "\nAvailable U's: " +
                  data[i].available +
                  "\nUtilization : " +
                  data[i].usage +
                  "%"
              );
              $(childDiv1).attr(
                "style",
                "border:0.4px solid black;background:rgba(5,247, 35, 0.5);" +
                  "position: absolute; cursor: pointer; left:" +
                  xaxis +
                  "px; top:" +
                  yaxis +
                  "px;" +
                  "width:" +
                  width +
                  "px;" +
                  "height:" +
                  height +
                  "px;"
              );
              $(childDiv1).on("click", () =>
                this.assetView(data[i].rack, "assetBtn")
              );
              $("#temp").append(childDiv1);
            }
          }
        }
      })
      .catch((error) => {
        console.log("error===>", error);
        if (error.response.status === 403) {
          $("#sessionModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 400) {
          this.setState({ error: true, message: "Bad Request!" });
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: "No data Found!" });
        }
      });
  };

  assetView = (rackId, optId) => {
    console.log("assetView==========", rackId);
    this.setState({
      rackID: rackId,
      error: false,
      message: "",
      assetMacId: "",
      details: [0, 0, 0],
    });
    $("#popup").css("display", "block");
    $("#asset_graphBlock").css("display", "none");
    $("#asset_det").css("display", "block");
    $("#thermal_det").css("display", "none");
    $("#energy_det").css("display", "none");
    $("#graphBlock").css("display", "none");
    this.optionChange(optId);
    $("#asset_rackId").css({
      "font-weight": "bold",
      margin: "20px",
      "margin-bottom": "0px",
    });
    $("#asset_rackId").text("RackID : " + rackId);
    $("#asset_block").css("left", "325px");
    $("#popup_img").attr("src", "../images/assets_tracking.svg");
    $("#popup_img").css({ width: "200px", height: "522px" });
    $("#asset_block .assets").remove();
    let incValue = 0;
    for (let i = 42; i >= 1; i--) {
      let assetDiv = document.createElement("div");
      $(assetDiv).attr("id", "asset_" + i);
      $(assetDiv).attr("class", "assets");
      $(assetDiv).css({
        width: "175px",
        height: "9px",
        position: "absolute",
        background: "rgba(16,255,0,0.6)",
        left: "12px",
        top: (13 + incValue).toString() + "px",
      });
      $("#asset_block").append(assetDiv);
      incValue += 12;
    }

    axios({ method: "GET", url: "/api/asset/racktracking?rackid=" + rackId })
      .then((response) => {
        console.log("assetView =====>", response);
        if (response.status === 200 || response.status === 201) {
          let data = response.data.asset;
          let detAsset = response.data;
          if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              $("#asset_" + data[i].location).css({
                background: "rgba(255,35,0,0.6)",
                cursor: "pointer",
              });
              $("#asset_" + data[i].location).attr(
                "title",
                "AssetID : " +
                  data[i].tagid +
                  "\nLocation : " +
                  data[i].location +
                  "\nLastSeen : " +
                  data[i].lastseen.substring(0, 19).replace("T", " ")
              );
              $("#asset_" + data[i].location).on("click", () => {
                $("#asset_graphBlock").css("display", "block");
                this.imgMoveLeft();
                this.assetServerDetails(data[i].tagid);
              });
            }
            this.setState({
              detailsKey: "assets",
              details: [
                detAsset.assetcount,
                detAsset.rackcapacity,
                detAsset.available,
              ],
            });
          }
        }
      })
      .catch((error) => {
        console.log("assetView ERROR===>", error);
        if (error.response.status === 403) {
          $("#sessionModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 400) {
          this.setState({ error: true, message: "Bad Request!" });
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: "No data Found!" });
        }
      });
  };

  assetServerDetails = (tagid) => {
    this.setState({ series: [], series1: [], error: false, message: "" });
    axios({ method: "GET", url: "/api/track?id=" + tagid })
      .then((response) => {
        console.log("Response====>", response);
        let data = response.data;
        if (response.status === 200 || response.status === 201) {
          if (data.length !== 0) {
            let utilisation = [],
              tempf = [],
              tempb = [],
              humidityf = [],
              humidityb = [],
              energy = [],
              power = [],
              cate = [];
            for (let i = 0; i < data.length; i++) {
              let utiData = [],
                tempfData = [],
                tempbData = [],
                humifData = [],
                humibData = [],
                energyData = [],
                powerData = [];
              cate.push(data[i].lastseen.substring(11, 19));
              let time = data[i].lastseen.substring(0, 19).replace("T", " ");
              var date = new Date(time);
              var milliseconds = date.getTime();
              utiData.push(milliseconds);
              utiData.push(data[i].utilisation);
              utilisation.push(utiData);

              tempfData.push(milliseconds);
              tempfData.push(data[i].tempf);
              tempf.push(tempfData);

              tempbData.push(milliseconds);
              tempbData.push(data[i].tempb);
              tempb.push(tempbData);

              humifData.push(milliseconds);
              humifData.push(data[i].humidityf);
              humidityf.push(humifData);

              humibData.push(milliseconds);
              humibData.push(data[i].humidityb);
              humidityb.push(humibData);

              // energyData.push(milliseconds);
              // energyData.push(data[i].energy);
              // energy.push(energyData);
              energy.push(data[i].energy);

              // powerData.push(milliseconds);
              // powerData.push(data[i].power);
              // power.push(powerData);
              power.push(data[i].power);
            }
            this.setState({
              series: [
                { name: "Utilization (%)", data: utilisation },
                { name: "Temp (F)", data: tempf },
                { name: "Temp (B)", data: tempb },
                { name: "Humidity (F)", data: humidityf },
                { name: "Humidity (B)", data: humidityb },
              ],
              series1: [
                { name: "Power (Actual)", data: power },
                { name: "Power* (Ideal)", data: energy },
              ],
            });

            let val = {
              chart: {
                height: 350,
                type: "line",
                zoom: {
                  enabled: true,
                },
                animations: {
                  enabled: true,
                  easing: "easeinout",
                  speed: 1500,
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                width: [2, 2, 2],
                curve: "smooth",
                dashArray: [0, 0, 0],
              },
              title: {
                text: "Server Energy Statistics",
                align: "Center",
              },
              markers: {
                size: 0,
                hover: {
                  sizeOffset: 6,
                },
              },
              xaxis: {
                // type: '',
                categories: cate,
              },
              tooltip: {
                y: [
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      },
                    },
                  },
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      },
                    },
                  },
                ],
              },
              grid: {
                borderColor: "#f1f1f1",
              },
            };
            this.setState({ options1: val });
          }
        } else {
          this.setState({ error: true, message: "No Data Found" });
        }
      })
      .catch((error) => {
        console.log("Error===>", error);
        if (error.response.status === 403) {
          $("#sessionModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 400) {
          this.setState({ error: true, message: "Bad Request!" });
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: "No data Found!" });
        }
      });
  };

  thermalView = (rackId, optId) => {
    console.log("thermalView==========", rackId);
    this.setState({
      rackID: rackId,
      series: [],
      series1: [],
      assetMacId: "",
      details: [0, 0, 0],
    });
    $("#popup").css("display", "block");
    $("#asset_graphBlock").css("display", "none");
    $("#asset_det").css("display", "none");
    $("#thermal_det").css("display", "block");
    $("#energy_det").css("display", "none");
    this.optionChange(optId);
    $("#asset_block .assets").remove();
    $("#asset_block").css({ left: "200px" });
    $("#popup_img").attr("src", "../images/thermal_tracking.svg");
    $("#popup_img").css({ width: "390px", height: "548px" });
    let incValue = 0;

    for (let i = 42; i >= 1; i--) {
      let assetFront = document.createElement("div");
      $(assetFront).attr("id", "asset_front" + i);
      $(assetFront).attr("class", "assets");
      $(assetFront).css({
        width: "175px",
        height: "9px",
        position: "absolute",
        left: "12px",
        top: (39 + incValue).toString() + "px",
      });
      $("#asset_block").append(assetFront);

      let assetBack = document.createElement("div");
      $(assetBack).attr("id", "asset_back" + i);
      $(assetBack).attr("class", "assets");
      $(assetBack).css({
        width: "175px",
        height: "9px",
        position: "absolute",
        left: "202px",
        top: (39 + incValue).toString() + "px",
      });
      $("#asset_block").append(assetBack);
      incValue += 12;
    }

    axios({ method: "GET", url: "/api/thermal/racktracking?rackid=" + rackId })
      .then((response) => {
        console.log("thermal =====>", response);
        if (response.status === 200 || response.status === 201) {
          let data = response.data.thermal;
          let detThermal = response.data;
          if (data.length !== 0) {
            this.setState({
              detailsKey: "thermal",
              details: [
                detThermal.maxtemp,
                detThermal.mintemp,
                detThermal.avgtemp,
              ],
            });
            for (let i = 0; i < data.length; i++) {
              let temp_front = data[i].tempf;
              let temp_back = data[i].tempb;
              let frontClr = "",
                backClr = "";
              if (temp_front <= 20) frontClr = "rgba(16,255,0,0.6)";
              else if (temp_front >= 21 && temp_front <= 25)
                frontClr = "rgba(128,204,0,0.6)";
              else if (temp_front >= 26 && temp_front <= 30)
                frontClr = "rgba(255,194,0,0.6)";
              else if (temp_front >= 31 && temp_front <= 35)
                frontClr = "rgba(255,125,0,0.6)";
              else if (temp_front > 35) frontClr = "rgba(255,35,0,0.6)";

              if (temp_back <= 20) backClr = "rgba(16,255,0,0.6)";
              else if (temp_back >= 21 && temp_back <= 25)
                backClr = "rgba(128,204,0,0.6)";
              else if (temp_back >= 26 && temp_back <= 30)
                backClr = "rgba(255,194,0,0.6)";
              else if (temp_back >= 31 && temp_back <= 35)
                backClr = "rgba(255,125,0,0.6)";
              else if (temp_back > 35) backClr = "rgba(255,35,0,0.6)";

              $("#asset_front" + data[i].location).css({
                background: frontClr,
                cursor: "pointer",
              });
              $("#asset_front" + data[i].location).attr(
                "title",
                "AssetID : " +
                  data[i].tagid +
                  "\nTemperature : " +
                  data[i].tempf +
                  "\nLastSeen : " +
                  data[i].lastseen.substring(0, 19).replace("T", " ")
              );
              $("#asset_front" + data[i].location).on("click", () => {
                this.assetHistoryMap("front", data[i].tagid);
              });

              $("#asset_back" + data[i].location).css({
                background: backClr,
                cursor: "pointer",
              });
              $("#asset_back" + data[i].location).attr(
                "title",
                "AssetID : " +
                  data[i].tagid +
                  "\nTemperature : " +
                  data[i].tempb +
                  "\nLastSeen : " +
                  data[i].lastseen.substring(0, 19).replace("T", " ")
              );
              $("#asset_back" + data[i].location).on("click", () => {
                this.assetHistoryMap("back", data[i].tagid);
              });
            }
          }
        }
      })
      .catch((error) => {
        console.log("assetView ERROR===>", error);
        if (error.response.status === 403) {
          $("#sessionModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 400) {
          this.setState({ error: true, message: "Bad Request!" });
        } else if (error.response.status === 404) {
          this.setState({ error: true, message: "No data Found!" });
        }
      });
  };

  energyView = (rackId, optId) => {
    console.log("energyView==========", rackId);
    this.setState({ rackID: rackId });
    $("#popup").css("display", "block");
    $("#asset_graphBlock").css("display", "none");
    $("#asset_det").css("display", "none");
    $("#thermal_det").css("display", "none");
    $("#energy_det").css("display", "block");
    $("#graphBlock").css("display", "none");
    this.optionChange(optId);
    $("#asset_rackId").css({
      "font-weight": "bold",
      margin: "20px",
      "margin-bottom": "0px",
    });
    $("#asset_rackId").text("RackID : " + rackId);
    $("#asset_block").css("left", "325px");
    $("#popup_img").attr("src", "../images/assets_tracking.svg");
    $("#popup_img").css({ width: "200px", height: "522px" });
    $("#asset_block .assets").remove();
    let incValue = 0;
    for (let i = 42; i >= 1; i--) {
      let assetDiv = document.createElement("div");
      $(assetDiv).attr("id", "asset_" + i);
      $(assetDiv).attr("class", "assets");
      $(assetDiv).css({
        width: "175px",
        height: "9px",
        position: "absolute",
        // "background": "rgba(16,255,0,0.6)",
        left: "12px",
        top: (13 + incValue).toString() + "px",
      });
      $("#asset_block").append(assetDiv);
      incValue += 12;
    }

    axios({ method: "GET", url: "/api/energy/racktracking?rackid=" + rackId })
      .then((response) => {
        console.log("assetView =====>", response);
        if (response.status === 200 || response.status === 201) {
          let data = response.data.energy;
          let detEnergy = response.data;
          if (data.length !== 0) {
            this.setState({
              detailsKey: "energy",
              details: [detEnergy.net, detEnergy.max, detEnergy.min],
            });
            for (let i = 0; i < data.length; i++) {
              let clr = "";
              let energy = data[i].voltage;
              if (energy <= 3) clr = "rgba(16,255,0,0.6)";
              else if (energy >= 4 && energy <= 7) clr = "rgba(128,204,0,0.6)";
              else if (energy >= 8 && energy <= 10) clr = "rgba(255,194,0,0.6)";
              else if (energy >= 11 && energy <= 15)
                clr = "rgba(255,125,0,0.6)";
              else if (energy > 15) clr = "rgba(255,35,0,0.6)";
              $("#asset_" + data[i].location).css({
                background: clr,
                cursor: "pointer",
              });
              $("#asset_" + data[i].location).attr(
                "title",
                "AssetID : " +
                  data[i].tagid +
                  "\nEnergy : " +
                  data[i].voltage +
                  " kWh" +
                  "\nLastSeen : " +
                  data[i].lastseen.substring(0, 19).replace("T", " ")
              );
            }
          }
        }
      })
      .catch((error) => {
        console.log("assetView ERROR===>", error);
        if (error.response.status === 403) {
          $("#tracking_displayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else {
          $("#track-error").text(
            "Request Failed with status code (" + error.response.status + ")."
          );
        }
      });
  };

  /** Terminate the session on forbidden (403) error */
  sessionTimeout = () => {
    $("#sessionModal").css("display", "none");
    sessionStorage.setItem("isLogged", "failed");
    window.location.pathname = "/login";
  };

  assetHistoryMap = (assetSide, assetTagId) => {
    window.scrollTo(0, 650);
    this.setState({ assetMacId: assetTagId, series: [], series1: [] });
    console.log(assetSide, "assetHistoryMap------>", assetTagId);
    axios({
      method: "POST",
      url: "/api/asset/history",
      data: { id: assetTagId, value: assetSide },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("AssetHistory Data======>", response);
          if (response.data.length !== 0) {
            $("#graphBlock").css("display", "block");
            let value1 = [],
              value2 = [];
            var ct = 1;
            if (response.data.length > 100) {
              ct = Math.ceil(response.data.length / 100);
            }
            let data = response.data;
            if (assetSide === "front") {
              for (let i = 0; i < data.length; i = i + ct) {
                let tempData = [],
                  humiData = [];
                let time = data[i].lastseen.substring(0, 19).replace("T", " ");
                let date = new Date(time);
                let milliseconds = date.getTime();
                tempData.push(milliseconds);
                tempData.push(data[i].tempf);
                value1.push(tempData);

                humiData.push(milliseconds);
                humiData.push(data[i].humidityf);
                value2.push(humiData);
              }
            } else {
              for (let i = 0; i < data.length; i = i + ct) {
                let tempData = [],
                  humiData = [];
                let time = data[i].lastseen.substring(0, 19).replace("T", " ");
                var date = new Date(time);
                var milliseconds = date.getTime();
                tempData.push(milliseconds);
                tempData.push(data[i].tempb);
                value1.push(tempData);

                humiData.push(milliseconds);
                humiData.push(data[i].humidityb);
                value2.push(humiData);
              }
            }
            if ($("#chartCanvas").children().length !== 0)
              $("#tempChart").remove();
            var cnvs = document.createElement("canvas");
            $(cnvs).attr("id", "tempChart");
            $(cnvs).attr("width", "50px");
            $(cnvs).attr("height", "20px");
            $("#chartCanvas").append(cnvs);

            // chart displaying code
            this.setState({
              series: [
                { name: "Temperature", data: value1 },
                { name: "Humidity", data: value2 },
              ],
            });
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#thermalDisplayModal").css("display", "block");
          $("#content").text("User Session has timed out. Please Login again");
        } else if (error.response.status === 404) {
          $("#temp-error").text("No Daily data found.");
          window.scrollTo(0, 0);
        } else {
          $("#temp-error").text(
            "Request Failed with status code (" + error.response.status + ")."
          );
        }
      });
  };

  optionChange = (btnId) => {
    $("#assetBtn").css({ background: "none", color: "#000" });
    $("#thermalBtn").css({ background: "none", color: "#000" });
    $("#energyBtn").css({ background: "none", color: "#000" });
    $("#" + btnId).css({ background: "rgb(0, 98, 135)", color: "#FFF" });
  };

  imgMoveLeft = () => {
    $("#asset_block").animate({ left: "30px" }, "fast");
  };
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname='/login'
  };
  
  render() {
    const {
      error,
      message,
      rackID,
      assetMacId,
      series,
      series1,
      detailsKey,
      details,
      options1,
    } = this.state;
    return (
      <div
        style={{
          float: "right",
          width: "95%",
          background: "#E5EEF0",
          height: "100vh",
          marginLeft: "60px",
        }}
      >
        <div style={{ marginTop: "30px", marginLeft: "60px" }}>
          <span className="main_header">REAL-TIME TRACKING</span>

          <div className="underline"></div>

          <div className="inputdiv" style={{ marginTop: "20px" }}>
            <select
              // style={{ width: "30%" }}
              id="fname"
              onChange={() => {
                this.plotFloorMap();
              }}
            ></select>
          </div>

          {error && (
            <div style={{ marginTop: "10px", color: "red" }}>
              <strong>{message}</strong>
            </div>
          )}

          <div>
            <div
              id="temp"
              style={{
                display: "block",
                position: "relative",
                width: "fit-content",
              }}
            >
              <img id="tempimg" alt=""></img>
            </div>

            <div
              id="popup"
              style={{
                display: "none",
                width: "65%",
                top: "68px",
                right: "100px",
                paddingBottom: "20px",
                height: "fit-content",
                position: "absolute",
                borderRadius: "10px",
                background: "#FFF",
                boxShadow: "rgb(0, 0, 0) 10px 18px 50px -10px",
              }}
            >
              <div>
                <i
                  style={{
                    margin: "-5px",
                    marginRight: "10px",
                    float: "right",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    $("#popup").css("display", "none");
                  }}
                  className="far fa-times-circle"
                ></i>
                <>
                  <p id="asset_rackId" />
                  {/* Button Options */}
                  <div
                    style={{
                      marginLeft: "15px",
                      marginTop: "10px",
                      display: "flex",
                    }}
                  >
                    <button
                      id="assetBtn"
                      className="heading"
                      style={graphBtn}
                      onClick={() => this.assetView(rackID, "assetBtn")}
                    >
                      Asset View
                    </button>
                    <br />
                    <br />
                    <button
                      id="thermalBtn"
                      className="heading"
                      style={graphBtn}
                      onClick={() => this.thermalView(rackID, "thermalBtn")}
                    >
                      Thermal View
                    </button>
                    <br />
                    <br />
                    <button
                      id="energyBtn"
                      className="heading"
                      style={graphBtn}
                      onClick={() => this.energyView(rackID, "energyBtn")}
                    >
                      Energy View
                    </button>
                    <label class="toggle">
                  <input type="checkbox" />
                  <span class="slider"></span>
                  <span class="labels" data-on="Asset" data-off="Comparision"></span>
                </label>
                  </div>
                </>

                <div
                  id="asset_block"
                  style={{
                    position: "relative",
                    width: "390px",
                    height: "550px",
                  }}
                >
                  <img
                    id="popup_img"
                    style={{
                      position: "absolute",
                    }}
                    alt=""
                  />
                  
                </div>
              </div>

              <div
                id="asset_det"
                style={{
                  position: "absolute",
                  // display: "none",
                  top: "120px",
                  right: "165px",
                  display: "flex",
                }}
              >
                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(16,255,0,0.9)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>Available</p>
                </div>

                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(255,0,10,0.9)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>Occupied</p>
                </div>
              </div>

              <div
                id="thermal_det"
                style={{
                  position: "absolute",
                  display: "none",
                  top: "150px",
                  right: "70px",
                }}
              >
                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(16,255,0,0.9)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>Cold (20&lt;&deg;C)</p>
                </div>

                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(255,194,0,0.6)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>
                    Optimum (21&deg;C - 34&deg;C)
                  </p>
                </div>

                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(255,0,10,0.9)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>Warm ( &gt;35&deg;C )</p>
                </div>
              </div>

              <div
                id="energy_det"
                style={{
                  position: "absolute",
                  display: "none",
                  top: "150px",
                  right: "112px",
                }}
              >
                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(16,255,0,0.9)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>Cold (20&lt;&deg;C)</p>
                </div>

                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(255,194,0,0.6)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>
                    Optimum (21&deg;C - 34&deg;C)
                  </p>
                </div>

                <div style={{ display: "flex", margin: "10px 20px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      marginTop: "6px",
                      marginRight: "5px",
                      background: "rgba(255,0,10,0.9)",
                    }}
                  ></div>
                  <p style={{ marginBottom: "0px" }}>Warm ( &gt;35&deg;C )</p>
                </div>
              </div>

              {/* AssetView Graph */}
              <div
                id="asset_graphBlock"
                style={{
                  margin: "25px",
                  marginTop: "5px",
                  width: "600px",
                  position: "absolute",
                  top: "130px",
                  right: "12px",
                  display: "none",
                }}
              >
                <h5 style={{ marginLeft: "20px" }}>
                  AssetID : 5a-c2-15-00-00-01
                </h5>
                {series.length ? (
                  <div>
                    <div>
                      <div id="chart">
                        <div id="chart-timeline">
                          <ApexCharts
                            options={this.state.options}
                            series={series}
                            type="area"
                            height={350}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p />
                )}
            
              </div>

              {/* ThermalView Graph */}
              <div id="graphBlock" style={{ margin: "25px", marginTop: "5px" }}>
                {series.length ? (
                  <div>
                    <div>
                      <div id="chart">
                        <div id="chart-timeline">
                          <ApexCharts
                            options={this.state.options}
                            series={series}
                            type="area"
                            height={350}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p />
                )}
              </div>
              <div>
                {series1.length ? (
                  <div>
                    <div>
                      <div id="chart">
                        <div id="chart-timeline">
                          <ApexCharts
                            options={this.state.options1}
                            series={series1}
                            type="area"
                            height={350}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p />
                )}
              </div>
            </div>
          </div>
        </div>
        <div id="displayModal" className="modal">
        <div className="modal-content">
            <p id="content" style={{ textAlign: "center" }}></p>
              <button style={{ textAlign: "center" }}
                 id="ok"
                className="btn-center btn success-btn"
            onClick={this.sessionTimeout}
           >
        OK
      </button>
    </div>
  </div>
      </div>
    );
  }
}
