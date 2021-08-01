import React, { Component } from "react";

class Footer extends Component {

    render() {
        return (
           <footer id={"footer"}>
               <div id={"foot"}>
                   <div id={"contact_l"} className={"foot"}>
                       <p>Contact with me</p>
                   </div>
                   <div id={"contact_r"} className={"foot"}>
                       <a href={"https://github.com/Gor07s"} target="_blank">Github</a>
                       <p>gorsimonyan20030707@mail.ru</p>
                       <p>033044071</p>
                   </div>
               </div>
           </footer>
        )
    }

}

export default Footer