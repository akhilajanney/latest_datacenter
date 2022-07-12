import axios from "axios";
import React, { Component } from "react";
import { upload_floormap, master_register } from "../urls/api";
import $ from "jquery";
import { SessionOut } from "./Common";

export default class Master extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: false,
      success: false,
    };
  }
  componentDidMount() {
    axios({
      method: "GET",
      url: upload_floormap,
    })
      .then((response) => {
        console.log(response);
        let data = response.data;
        if (data.length !== 0 && response.status === 200) {
          for (let i = 0; i < data.length; i++) {
            $("#fname").append(
              "<option  value=" + data[i].id + " >" + data[i].name + "</option>"
            );
          }
        } else {
          this.setState({
            error: true,
            message:
              "No floor map uploaded. Please upload a floor map to begin",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          $("#displayModal").css("display", "block");
        }
      });
  }

  registerMaster = () => {
    this.setState({ error: false, success: false, message: "" });
    let data = {
      floorid: $("#fname").val(),
      macaddress: $("#masterregid").val(),
    };
    console.log(data);
    if ($("#masterregid").val().length === 0) {
      this.setState({ error: true, message: "Required Master Gateway ID" });
      this.timeout = setTimeout(() =>
        this.setState({
          error: false, success: "", message: ''
        }), 5000)
    } else if (
      $("#masterregid").val().length !== 17 ||
      $("#masterregid").val().match("^5a-c2-15-08-[a-x0-9]{2}-[a-x0-9]{2}") === null
    ) {
      this.setState({
        error: true,
        message: "Invalid ID Entered. Please follow the pattern 5a-c2-15-08-00-00",
      });
      this.timeout = setTimeout(() =>
        this.setState({
          error: false, success: "", message: ''
        }), 5000)
    } else {
      axios({ method: "POST", url: master_register, data: data })
        .then(
          (response) => {
            console.log("Response ====> ", response);
            if (response.status === 200 || response.status === 201) {
              $("#masterregid").val("");
              this.setState({
                success: true,
                message: "Master Gateway Registered Successfully.",
              });
              this.timeout = setTimeout(() =>
                this.setState({
                  error: false, success: "", message: ''
                }), 5000)
            } else {
              this.setState({
                success: false,
                error: true,
                message: "Master Gateway not Registered",
              });
              this.timeout = setTimeout(() =>
                this.setState({
                  error: false, success: "", message: ''
                }), 5000)
            }
          }
        )
        .catch((error) => {
          console.log("error ====> ", error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          } else if (error.response.status === 400) {
            this.setState({
              error: true,
              message: "Master Gateway Already Exist",
            });
            this.timeout = setTimeout(() =>
              this.setState({
                error: false, success: "", message: ''
              }), 5000)
          }
        })
    }
  };

  removeMaster = () => {
    this.setState({ error: false, success: false, message: "" });
    let data = {
      macaddress: $("#masterregid").val(),
    };
    if ($("#masterregid").val().length === 0) {
      this.setState({ error: true, message: "Required Master Gateway ID" });
      this.timeout = setTimeout(() =>
        this.setState({
          error: false, success: "", message: ''
        }), 5000)
    } else {
      axios({
        method: "DELETE",
        url: master_register,
        data: data,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            $("#masterregid").val("");
            this.setState({
              success: true,
              message: "Master Gateway Removed Successfully.",
            });
            this.timeout = setTimeout(() =>
              this.setState({
                error: false, success: "", message: ''
              }), 5000)
          } else {
            this.setState({
              error: true,
              message: "Master Gateway not Removed.",
            });
            this.timeout = setTimeout(() =>
              this.setState({
                error: false, success: "", message: ''
              }), 5000)
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 403) {
            $("#displayModal").css("display", "block");
          } else {
            this.setState({
              error: true,
              message: "Error Occurred. Please try again.",
            });
            this.timeout = setTimeout(() =>
              this.setState({
                error: false, success: "", message: ''
              }), 5000)
          }
        });
    }
  };


  render() {
    const { message, success, error } = this.state;
    return (
      <div style={{
        marginLeft: "0px",
        marginTop: '20px',
        width: "100%",
        height: "68.5vh"
      }}>
        <div style={{ justifyContent: "space-between" }}>
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
              <span className="label">Floor Name :</span>
              <select name="fname" id="fname" required="required" />
            </div>

            <div className="inputdiv">
              <span className="label">Master Gateway ID :</span>
              <input
                type="text"
                name="id"
                id="masterregid"
                required="required"
                placeholder="5a-c2-15-08-00-00"
              />
            </div>

            <div style={{ display: "flex", width: "85%", marginLeft: "100px" }}>
              <div
                onClick={() => this.removeMaster()}
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
                onClick={() => this.registerMaster()}
                className="register reg"
                style={{ width: "150px", marginLeft: "60px" }}>
                <div
                  style={{
                    marginLeft: "25px",
                    marginTop: "5px",
                    cursor: "pointer",
                    fontFamily: "Poppins-Regular",
                  }}>
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
