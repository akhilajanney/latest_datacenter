import React, { Component } from 'react'
import sidebar from'./sidebar.css'
import { Link } from 'react-router-dom';

const Background = { backgroundColor: "#00629B" ,color:'black' };
export function linkClicked(id) {
  let element = document.getElementsByClassName("sidebarmenu");
  element[0].style.backgroundColor = "";
  element[0].firstChild.style.color = "";
  element[1].style.backgroundColor = "";
  element[1].firstChild.style.color = "";
  element[2].style.backgroundColor = "";
  element[2].firstChild.style.color = "";
  element[3].style.backgroundColor = "";
  element[3].firstChild.style.color = "";
  element[4].style.backgroundColor = "";
  element[4].firstChild.style.color = "";
  element[5].style.backgroundColor = "";
  element[5].firstChild.style.color = "";
  element[id].style.backgroundColor = "#00629B";
  element[id].firstChild.style.color = "white";
}

export default class Leftsidebar extends Component {

  componentDidMount(){
    linkClicked(0);
  }
  logout=()=>{
       console.log('logout----');
        sessionStorage.removeItem('isLogged')
            window.location.pathname='/login'
}



homeRedirect=()=>{
  window.location.pathname='/home'
}
  render() {
    return (
      <div>
          <div className='sidebar'>
                <img src="/images/vacuslogo.png" alt="" style={{width:'45px',marginTop:'15px',cursor:'pointer'}} onClick={this.homeRedirect}/>

                <Link to='/home'>
                <div className={'sidebarmenu'} title="Home" style={Background}
                  onClick={() => linkClicked(0)}
                >
                <i style={{fontSize:'22px',color:'#000',paddingTop:'9px'}} className="fas fa-home-alt"></i>
                </div>
                </Link>

                <Link to='/config'>
                <div className={'sidebarmenu'} title="Configuration"  onClick={() => linkClicked(1)} style={Background}>
                <i style={{fontSize:'22px',color:'#000',paddingTop:'9px'}} className="fas fa-cog" id='icon'></i>    
                </div>
                </Link>
                
                <Link to='/realtime'>
                <div className={'sidebarmenu'} title="Real-time Tracking"  onClick={() => linkClicked(2)} style={Background}>
                <i style={{fontSize:'22px',color:'#000',paddingTop:'9px'}} className="fas fa-map-marker-alt" id='icon'></i>
                </div>
                </Link>

                <Link to='/health'>
                <div className={'sidebarmenu'} title="Health"  onClick={() => linkClicked(3)} style={Background}>
                    <i style={{fontSize:'22px',color:'#000',paddingTop:'10px'}} className="fas fa-heartbeat" id='icon'></i>
                </div>
                </Link>


                <Link to='/alerts'>
                <div className={'sidebarmenu'} title="Alerts"  onClick={() => linkClicked(4)} style={Background}>
                <i style={{fontSize:'22px',color:'#000',paddingTop:'8px',paddingLeft:'5px',transform:'rotate(30deg)'}} className="fas fa-bell"></i>
                </div>
                </Link>

                <Link to='/assetdetails'>
                <div className={'sidebarmenu'} title="Asset Details"  onClick={() => linkClicked(5)} style={Background}>
                <i style={{fontSize:'22px',color:'#000',paddingTop:'9px'}} className="fas fa-server"></i>
                </div>
                </Link>

                <div className='sidebarmenu'style={{marginTop:'55px'}} title="Logout"  onClick={this.logout}>
                <i style={{fontSize:'22px',color:'#FF5454',paddingTop:'9px',marginLeft:'-3px',transform:'rotate(180deg)',marginTop:'8px'}} className="fas fa-sign-out-alt"></i>
                </div>
          </div>
      </div>
    )
  }
}
