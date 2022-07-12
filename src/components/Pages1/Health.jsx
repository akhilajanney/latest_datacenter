import React, { Component } from "react";
import { master_register, slave_register, assettag_det } from "../urls/api";
import { linkClicked } from "../sidebar/Leftsidebar";
import { getPagination, TableDetails, SessionOut } from "./Common";
import $ from "jquery";
import "./styles.css";
import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
export default class Health extends Component {
   constructor() {
      super();
      this.state = {
         message: "",
         error: false,
         flag: false,
      };
   }
   componentDidMount() {
      linkClicked(3);
      this.getTableDetails();
      this.interval = setInterval(() => {
         this.getTableDetails();
      }, 15 * 1000);
   }

   componentWillUnmount() {
      clearInterval(this.interval);
   }

   getTableDetails = () => {
      this.setState({ error: false, message: "" });
      if ($("#healthtype").val() === "Master") {
         axios({ method: "GET", url: master_register })
            .then((response) => {
               const data = response.data;
               console.log("Master Response====>", data);
               $(".pagination").hide();
               $("#rangeDropdown").hide();
               $("#table_det tbody").empty();
               $("#table_det thead").empty();
               if (data.length !== 0 && response.status === 200) {
                  $("#table_det thead").append(
                     "<tr>" +
                     "<th>SNO</th>" +
                     "<th>MASTER ID</th>" +
                     "<th>FLOOR NAME</th>" +
                     "<th>LAST SEEN</th>" +
                     " <th>STATUS</th>" +
                     "</tr>"
                  );
                  for (let i = 0; i < data.length; i++) {
                     let status = 'red';
                     if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                        status = "green";
                     }
                     $("#table_det tbody").append(
                        "<tr class=row_" + (i + 1) + ">" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + data[i].gatewayid + "</td>" +
                        "<td>" + data[i].floor.name + "</td>" +
                        "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                        "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td> " +
                        "</tr>"
                     )
                  }
                  if (data.length > 25) {
                     $(".pagination").show();
                     $("#rangeDropdown").show();
                     getPagination(this, "#table_det");
                  }
               } else {
                  this.setState({ message: "No Master data found!", error: true });
               }
            })

            .catch((error) => {
               console.log("ERROR====>", error);
               if (error.response.status === 404) {
                  this.setState({ error: true, message: 'No Health Data Found For Master' })
               } else if (error.response.status === 403) {
                  $("#displayModal").css("display", "block");
               }
            })
      }
      else if ($("#healthtype").val() === "Slave") {
         axios({ method: "GET", url: slave_register })
            .then((response) => {
               const data = response.data;
               console.log('=====>slave', data);
               $(".pagination").hide();
               $("#rangeDropdown").hide();
               $("#table_det tbody").empty();
               $("#table_det thead").empty();
               if (data.length !== 0 && response.status === 200) {
                  $("#table_det thead").append(
                     "<tr>" +
                     "<th>SNO</th>" +
                     "<th>SLAVE ID</th>" +
                     "<th>MASTER ID</th>" +
                     "<th>FLOOR NAME</th>" +
                     "<th>LAST SEEN</th>" +
                     " <th>STATUS</th>" +
                     "</tr>"
                  );
                  for (let i = 0; i < data.length; i++) {
                     let status = 'red';
                     if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                        status = "green";
                     }
                     $("#table_det tbody").append(
                        "<tr class=row_" + (i + 1) + ">" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + data[i].gatewayid + "</td>" +
                        "<td>" + data[i].master.gatewayid + "</td>" +
                        "<td>" + data[i].master.floor.name + "</td>" +
                        "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                        "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td> " +
                        "</tr>"
                     )
                  }
                  if (data.length > 25) {
                     $(".pagination").show();
                     $("#rangeDropdown").show();
                     getPagination(this, "#table_det");
                  }
               } else {
                  this.setState({ message: "No Slave Data found!", error: true });
               }
            })
            .catch((error) => {
               console.log('Health Slave gate Error====', error);
               if (error.response.status === 403) {
                  $("#displayModal").css("display", "block");
               }
            })
      } else if ($("#healthtype").val() === 'Asset') {
         axios({ method: "GET", url: assettag_det })
            .then((response) => {
               const data = response.data;
               console.log('=====>', response);
               $(".pagination").hide();
               $("#rangeDropdown").hide();
               $("#table_det tbody").empty();
               $("#table_det thead").empty();
               if (data.length !== 0 && response.status === 200) {
                  $("#table_det thead").append(
                     "<tr>" +
                     "<th>SNO</th>" +
                     "<th>ASSET ID</th>" +
                     "<th>ASSET NAME</th>" +
                     "<th>BATTERY STATUS(%)</th>" +
                     "<th>LAST SEEN</th>" +
                     " <th>STATUS</th>" +
                     "</tr>"
                  );
                  for (let i = 0; i < data.length; i++) {
                     let status = 'red';
                     if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                        status = "green";
                     }
                     $("#table_det tbody").append(
                        "<tr class=row_" + (i + 1) + ">" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + data[i].tagid + "</td>" +
                        "<td class='tname'>" + data[i].name + "</td>" +
                        "<td>" + data[i].battery + "</td>" +
                        "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                        "<td><div id='outer_" + status + "'><div id='inner_" + status + "'></div></div></td> " +
                        "</tr>"
                     )
                  }
                  if (data.length > 25) {
                     $(".pagination").show();
                     $("#rangeDropdown").show();
                     getPagination(this, "#table_det");
                  }
               } else {
                  this.setState({ message: "No Asset data found!", error: true });
               }
            })
            .catch((error) => {
               console.log('Health asset tag gate Error====', error);
               if (error.response.status === 403) {
                  $("#displayModal").css("display", "block");
               }
            })
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
               <span className="main_header">SYSTEM HEALTH</span>
               <div className="underline"></div>
               <div className="inputdiv" style={{ marginTop: "20px" }}>
                  <span className="label">Health:</span>
                  <select
                     name="healthtype"
                     id="healthtype"
                     required="required"
                     onChange={() => this.getTableDetails()}>
                     <option>Master</option>
                     <option>Slave</option>
                     <option>Asset</option>
                  </select>
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
