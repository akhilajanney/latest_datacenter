import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { master_register, slave_register, assettag_det } from "../urls/api";
import { linkClicked } from "../sidebar/Leftsidebar";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export function pagination() {
  //  window.reload();
  $(".numbers").empty();
  // $(".numbers li a").empty();


  const rowsPerPage = 10;
  const rows = $(".mytable tbody tr");
  const rowsCount = rows.length;
  const pageCount = Math.ceil(rowsCount / rowsPerPage); // avoid decimals
  const numbers = $(".numbers");

  for (var i = 0; i < pageCount; i++) {
    numbers.append('<li><a href="#">' + (i + 1) + "</a></li>");
  }
  $(".numbers li:first-child a").addClass("active");
  displayRows(1);

  $(".numbers li a").click(function (e) {
    var $this = $(this);

    e.preventDefault();
    $(".numbers li a").removeClass("active");

    $this.addClass("active");
    displayRows($this.text());
  });

  function displayRows(index) {
    var start = (index - 1) * rowsPerPage;
    var end = start + rowsPerPage;
    rows.hide();
    rows.slice(start, end).show();

  }

}


export default class Health extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      error: false,
      success: true,

    };
  }
  componentDidMount() {
    linkClicked(3);
    this.healthType();
    this.interval = setInterval(this.healthType, 5000);
  }

  healthType = () => {
    let value = $("#healthtype").val();
    console.log(value);
    // this.setState({ datas: [] });
    if ($("#healthtype").val() === 'Asset') {

      $("#mastertable").hide();
      $("#slavetable").hide();
      $("#assethealth").show();

      axios({ method: "GET", url: assettag_det })
        .then((response) => {
          const data = response.data;
          if (data.length > 11) {
            $('#divheight').css('height', 'fit-content')
          } else {
            $('#divheight').css('height', '100vh')
          }
          console.log('=====>', response);
          if (data.length !== 0 && response.status === 200) {
            $("#asset_health").empty();
            for (let i = 0; i < data.length; i++) {
              let status = 'red';
              if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                status = "green";
              }
              $("#asset_health ").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].tagid + "</td>" +
                "<td>" + data[i].battery + "</td>" +
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td > " +
                "</tr>"
              )
            }
            // pagination();
            // displayRows(1);
          } else {
            this.setState({
              error: true,
              message: "No Health Data Found For Assets.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
        .catch((error) => {
          console.log('Health assests tag gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          } else {
            this.setState({ error: true, message: "Request Failed." },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
    }
    else if ($("#healthtype").val() === "Master") {
      $("#mastertable").show();
      $("#slavetable").hide();
      $("#assethealth").hide();
      axios({ method: "GET", url: master_register })
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (data.length !== 0 && response.status === 200) {
            $("#master_table").empty();
            if (data.length > 11) {
              $('#divheight').css('height', 'fit-content')
            } else {
              $('#divheight').css('height', '100vh')
            }
            for (let i = 0; i < data.length; i++) {
              let status = 'red';
              if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                status = "green";
              }

              $("#master_table").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].gatewayid + "</td>" +
                "<td>" + data[i].floor.name + "</td>" +
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td > " +
                "</tr>"
              )
            }
            // pagination();



          } else {
            this.setState({
              error: true,
              message: "No data found for Master Gateway.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })

        .catch((error) => {
          if (error.response.status === 404) {
            this.setState({ error: true, message: 'No Health Data Found For Master' })
          } else if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          }
        })
    }
    else if ($("#healthtype").val() === "Slave") {
      $("#mastertable").hide();
      $("#slavetable").show();
      $("#assethealth").hide();

      axios({ method: "GET", url: slave_register })
        .then((response) => {
          const data = response.data;
          console.log('=====>slave', data);
          if (data.length > 11) {
            $('#divheight').css('height', 'fit-content')
          } else {
            $('#divheight').css('height', '100vh')
          }
          if (data.length !== 0 && response.status === 200) {
            $("#slave_table").empty();
            for (let i = 0; i < data.length; i++) {
              let status = 'red';
              if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                status = "green";
              }
              $("#slave_table").append(
                "<tr>" +
                "<td>" + (i + 1) + "</td>" +
                "<td>" + data[i].gatewayid + "</td>" +
                "<td>" + data[i].master.floor.name + "</td>" +
                "<td>" + data[i].master.gatewayid + "</td>" +
                "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td > " +
                "</tr>"
              )
            }
            // pagination();
          } else {
            this.setState({
              error: true,
              message: "No Health Data found for Slave Gateway.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
        .catch((error) => {
          console.log('Health Slave gate Error====', error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
            $("#content").text("User Session has timed out. Please Login again");
          } else {
            this.setState({ error: true, message: "Request Failed." }
              ,
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname = '/login'
  };

  render() {
    const { error, message, success, datas } = this.state;
    // console.log("----->", datas);
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
          <span className="main_header">SYSTEM HEALTH</span>

          <div className="underline"></div>

          {error && (
            <div
              style={{ color: "red", marginBottom: "20px", marginTop: "30px" }}
            >
              <strong>{message}</strong>
            </div>
          )}

          {success && (
            <div
              style={{
                color: "green",
                marginBottom: "20px",
                marginTop: "30px",
              }}
            >
              <strong>{message}</strong>
            </div>
          )}

          <div className="inputdiv" style={{ marginTop: "20px" }}>
            <span className="label">Health:</span>
            <select
              name="healthtype"
              id="healthtype"
              required="required"
              onChange={this.healthType}
            >
              <option>Master</option>
              <option>Slave</option>
              <option>Asset</option>
            </select>
          </div>

          <div id='mastertable'>
            <table className="mytable">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>MASTER ID</th>
                  <th>FLOOR NAME</th>
                  <th>LAST SEEN</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody id="master_table" >

              </tbody>
            </table>

            {/*<div className="pagination" >
              <ol className="numbers"></ol>
            </div>*/}
          </div>


          <div id='slavetable'>
            <table className="mytable">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>SLAVE ID</th>
                  <th>FLOOR NAME</th>
                  <th>MASTER GATEWAY ID</th>
                  <th>LAST SEEN</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody id="slave_table" ></tbody>

            </table>

            {/* <div className="pagination" >
              <ol className="numbers"></ol>
            </div>*/}
          </div>


          <div id='assethealth'>
            <table className="mytable">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>ASSET MAC ID</th>
                  <th>BATTERY STATUS(%)</th>
                  <th>LAST SEEN</th>
                  <th>STATUS</th>

                </tr>
              </thead>
              <tbody id="asset_health" ></tbody>
            </table>
            {/*<div className="pagination" >
              <ol className="numbers"></ol>
            </div>*/}
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
