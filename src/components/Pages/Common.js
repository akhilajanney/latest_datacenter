import React from "react";
import $ from "jquery";
import Lottie from 'react-lottie';
import * as animationData from '../animations/sessionout.json';

export function SessionOut() {
    const sessionTimeout = () => {
        $("#displayModal").css("display", "none");
        sessionStorage.removeItem('isLogged')
        window.location.pathname = '/login'
    };
    return (
        <div id="displayModal" className="modal">
            <div className="modal-content" >
                <div className='modalheader'>
                    <span style={{
                        color: 'white', fontWeight: 600,
                        paddingTop: '5px', fontSize: '20px'
                    }}>Session Expired</span>
                </div>
                <div style={{ display: 'flex' }}>
                    <div id='login' style={{ marginTop: "-16px", marginLeft: "-32px" }} >
                        <Lottie
                            options={{
                                loop: true,
                                autoplay: true,
                                animationData: animationData,
                                rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice'
                                }
                            }}
                            height={170}
                            width={170}
                        />
                    </div>
                    <div className='modaltext'>
                        <p style={{ margin: '0px', padding: '0px', marginTop: "19px", fontWeight: 500 }}>Please re-login to renew </p>
                        <p style={{ margin: '0px', padding: '0px', paddingLeft: '35px', paddingTop: '3px', fontWeight: 500 }}>your session</p>

                        <button style={{ textAlign: "center", marginTop: '18px', marginLeft: '-3px' }}
                            id="ok"
                            className="btn-center btn success-btn"
                            onClick={() => sessionTimeout()}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function getPagination(this_key, table) {
    var lastPage = 1;
    var self = this_key;
    $("#maxRows").on("change", function () {
        lastPage = 1;
        $("#prev").css({ background: "#686868", color: "#FFF" });
        $("#prev1").css({ background: "#686868", color: "#FFF" });
        var trnum = 0;
        var maxRows = parseInt($(this).val());
        if (maxRows === 5000) {
            $(".pagination").hide();
        } else {
            $(".pagination").show();
        }
        $(table + " tr:gt(0)").each(function () {
            trnum++;
            if (trnum > maxRows) {
                $(this).hide();
            }
            if (trnum <= maxRows) {
                $(this).show();
            }
        });
        var tableCount = $(table + " tbody tr").length;
        if (tableCount > maxRows) {
            $("#prev").css({ background: "#006287", color: "#FFF" });
        } else {
            $(".pagination").hide();
        }
        $('.pagination [data-page="1"]').addClass("active");
        $(".pagination .moving").on("click", function (evt) {
            clearInterval(self.interval);
            clearTimeout(self.timeout);
            clearInterval(self.interval1);
            self.timeout = setTimeout(() => {
                self.getTableDetails();
                self.interval1 = setInterval(() => {
                    self.getTableDetails();
                }, 15 * 1000)

            }, 15 * 1000);
            evt.stopImmediatePropagation();
            evt.preventDefault();
            var pageNum = $(this).attr("data-page");
            var maxRows = parseInt($("#maxRows").val());
            var rowCount = $(table + " tbody tr").length;
            if (pageNum === "prev") {
                if (lastPage === 1) {
                    return;
                }
                pageNum = --lastPage;
            }

            let nxtCheck = 0;
            if (rowCount % maxRows === 0) {
                nxtCheck = parseInt(rowCount / maxRows);
            } else {
                nxtCheck = parseInt(rowCount / maxRows) + 1;
            }
            if (pageNum === "next") {

                if (lastPage === nxtCheck) {
                    return;
                }
                pageNum = lastPage + 1;
            }
            lastPage = pageNum;
            if (lastPage === nxtCheck) {
                $("#prev1").css({ background: "#006287", color: "#FFF" });
                $("#prev").css({ background: "#686868", color: "#FFF" });
            } else if (lastPage === 1) {
                $("#prev").css({ background: "#006287", color: "#FFF" });
                $("#prev1").css({ background: "#686868", color: "#FFF" });
            } else {
                $("#prev").css({ background: "#006287", color: "#FFF" });
                $("#prev1").css({ background: "#006287", color: "#FFF" });
            }
            var trIndex = 0;
            $(".pagination .moving").removeClass("active");
            $('.pagination [data-page="' + lastPage + '"]').addClass("active");
            $(table + " tr:gt(0)").each(function () {
                trIndex++;
                if (
                    trIndex > maxRows * pageNum ||
                    trIndex <= maxRows * pageNum - maxRows
                ) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        });
    })
        .val(25)
        .change();
}


export function TableDetails() {
    return (
        <div style={{ paddingBottom: "100px" }}>
            <div className="table_det">
                <div
                    id="rangeDropdown"
                    style={{
                        float: "right",
                        position: "relative",
                        right: "6%",
                        marginBottom: "20px",
                        marginTop: "-3%",
                    }}>
                    <select name="state" style={{ width: "120px" }} id="maxRows">
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <table style={{ width: "95%", position: "relative" }} id="table_det">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    id="prev1"
                    className="moving"
                    data-page="prev"
                    style={{ marginRight: "30px" }}>
                    Prev
                </button>
                <button className="moving" data-page="next" id="prev">
                    Next
                </button>
            </div>
        </div>
    )
}