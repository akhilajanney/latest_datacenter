import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import { upload_floormap } from "../urls/api";
import { SessionOut } from "./Common";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class Uploadmap extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      message: "",
      success: false,
      error: false,
    };
  }

  handleImage = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: file,
      });
    };
    reader.readAsDataURL(file);
  };
  uploadmap = () => {
    let form_data = new FormData();
    form_data.append("name", $("#fname").val());
    form_data.append("image", this.state.image);
    form_data.append("width", parseFloat($("#width").val()));
    form_data.append("height", parseFloat($("#height").val()));
    this.setState({ error: false, message: "" });
    if (
      $("#uploadimage").val() &&
      $("#width").val() &&
      $("#height").val() &&
      $("#fname").val() !== ""
    ) {
      axios({
        method: "POST",
        url: upload_floormap,
        data: form_data,
        headers: { "content-type": "multipart/formdata" },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 201 || response.status === 200) {
            this.setState({
              success: true,
              error: false,
              message: "Floor Map Uploaded Successfully.",
            });
            this.timeout = setTimeout(() =>
              this.setState({
                error: false, message: ''
              }), 5000)
            $("#uploadimage").val("");
            $("#width").val("");
            $("#height").val("");
            $("#fname").val("");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403) {
            $("#displayModal").css("display", "block");
          }
          else if (err.response.status === 404) {
            this.setState({ error: true, message: 'No Data Found' })
          }
        });
    } else {
      this.setState({ error: true, message: "Please Fill Out All The Fields" });
      this.timeout = setTimeout(() =>
        this.setState({
          error: false, message: ''
        }), 5000)
    }
  };
  sessionTimeout = () => {
    $("#displayModal").css("display", "none");
    sessionStorage.removeItem('isLogged')
    window.location.pathname = '/login'
  };

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const { message, error, success } = this.state;
    return (
      <div>
        <div style={{
          marginLeft: "0px",
          marginTop: '20px',
          width: "100%",
          height: "68.5vh"
        }}>
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
          <div className="inputdiv">
            <span className="label">Floor Name :</span>
            <input type="text" name="fname" id="fname" required="required" />
          </div>

          <div className="inputdiv">
            <span className="label">Width(in m) :</span>
            <input type="number" name="width" id="width" required="required" />
          </div>

          <div className="inputdiv">
            <span className="label">Height(in m) :</span>
            <input
              type="number"
              name="height"
              id="height"
              required="required"
            />
          </div>
          <div className="inputdiv">
            <span className="label">Floor Image:</span>
            <input
              type="file"
              accept="image/*"
              name="image"
              id="uploadimage"
              required="required"
              onChange={this.handleImage}
            />
          </div>

          <div className="register reg"
            onClick={this.uploadmap}>
            <div
              style={{
                marginLeft: "30px",
                marginTop: "5px",
                // color: "white",
                cursor: "pointer",
                fontFamily: "Poppins-Regular",
              }}
            >
              Upload
            </div>
            <div className="icon">
              <i
                style={{
                  fontSize: "20px",
                  marginLeft: "10px",
                  marginTop: "5px",
                  // color: "white",
                }}
                className="fas fa-cloud-upload"
              ></i>
            </div>
          </div>
        </div>

        {/* SessionOut Component used here!  */}
        <SessionOut />
      </div>
    );
  }
}
