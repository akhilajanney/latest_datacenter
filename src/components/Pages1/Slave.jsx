import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { SessionOut } from "./Common";
import { master_register, slave_register } from "../urls/api";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Slave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: false,
      success: false,
    };
  }
  componentDidMount() {
    axios({ method: "GET", url: master_register })
      .then((response) => {
        if (response.status === 200 && response.data.length !== 0) {
          for (let i = 0; i < response.data.length; i++) {
            $("#masterid").append(
              "<option value=" +
              response.data[i].id +
              ">" +
              response.data[i].gatewayid +
              "</option>"
            );
          }
        } else {
          this.setState({
            success: false,
            error: true,
            message: "No Master Gateway Found.",
          },
            () => setTimeout(() => this.setState({ error: false, message: '' }), 5000));
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        } else {
          this.setState({
            success: false,
            error: true,
            message: "Error occurred. Please try again.",
          },
            () => setTimeout(() => this.setState({ message: '' }), 5000));
        }
      });
  }


  registerSlave = () => {
    this.setState({ error: false, success: false, message: "" });
    let data = {
      masterid: $("#masterid").val(),
      macaddress: $("#slaveregid").val(),
    };
    console.log(data);
    if ($("#slaveregid").val().length === 0) {
      this.setState({ error: true, message: "Required Slave Gateway ID" },
        () => setTimeout(() => this.setState({ message: '' }), 5000));
    } else if ($("#slaveregid").val().length !== 17 ||
      data.macaddress.match("^5a-c2-15-0a-[a-x0-9]{2}-[a-x0-9]{2}") === null) {
      this.setState({ error: true, message: "Invalid ID Entered. Please follow the pattern 5a-c2-15-0a-00-00" });
    } else {
      axios({ method: "POST", url: slave_register, data: data })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            $("#slaveregid").val("");
            this.setState({
              success: true,
              error: false,
              message: "Slave Gateway Registered Successfully.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Slave Gateway not Registered",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
        .catch((error) => {
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          } else if (error.response.status === 400) {
            this.setState({
              error: true,
              message: "Master Gateway Already Exist",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Error Occurred. Please Try Again.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        });
    }
  };

  removeSlave = () => {
    this.setState({ error: false, success: false, message: "" });
    let data = {
      macaddress: $("#slaveregid").val(),
    };
    if ($("#slaveregid").val().length === 0) {
      this.setState({ error: true, message: "Required Slave Gateway ID" },
        () => setTimeout(() => this.setState({ message: '' }), 5000))
    } else {
      axios({
        method: "DELETE",
        url: slave_register,
        data: data,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            $("#slaveregid").val("");
            this.setState({
              success: true,
              error: false,
              message: "Slave Gateway Removed Successfully.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Slave Gateway not Removed.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Error occurred. Please try again.",
            },
              () => setTimeout(() => this.setState({ message: '' }), 5000));
          }
        });
    }
  };

  render() {
    const { message, error, success } = this.state;
    return (
      <div style={{
        marginLeft: "0px",
        marginTop: '20px',
        width: "100%",
        height: "67vh"
      }}>
        <div style={{ marginTop: "30px", justifyContent: "space-between" }}>
          {error && (
            <div style={{ color: "red", marginBottom: "20px" }}>
              <strong>{message}</strong>
            </div>
          )}

          {success && (
            <div style={{ color: "green", marginBottom: "20px" }}>
              <strong>{message}</strong>
            </div>
          )}

          <div>
            <div className="inputdiv">
              <span className="label">Master Gateway ID:</span>
              <select name="masterid" id="masterid" required="required" />
            </div>

            <div className="inputdiv">
              <span className="label">Slave Gateway ID :</span>
              <input
                type="text"
                name="id"
                id="slaveregid"
                required="required"
                placeholder="5a-c2-15-0a-00-00"
              />
            </div>

            <div style={{ display: "flex", width: "85%", marginLeft: "100px" }}>
              <div
                onClick={this.removeSlave}
                className="remove rmv"
                style={{ width: "150px", marginLeft: "9px" }}>
                <div
                  style={{
                    marginLeft: "25px",
                    marginTop: "5px",
                    cursor: "pointer",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Remove
                </div>
                <div className="icon">
                  <i
                    style={{
                      fontSize: "18px",
                      marginLeft: "10px",
                      marginTop: "7px",
                    }}
                    className="fas fa-file-times"
                  ></i>
                </div>
              </div>


              <div
                onClick={this.registerSlave}
                className="register reg"
                style={{ width: "150px", marginLeft: "60px" }}>
                <div
                  style={{
                    marginLeft: "25px",
                    marginTop: "5px",
                    cursor: "pointer",
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Register
                </div>
                <div className="icon">
                  <i
                    style={{
                      fontSize: "18px",
                      marginLeft: "10px",
                      marginTop: "7px",
                    }}
                    className="fas fa-file-plus"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
