import "../css/navbar.css"

export default function Navbar(){

    return(
        <nav className="nav">
            <a href="" className="site-title">
                Fault Alarm Visualization System
            </a>
            <ul>
            <li className="">
                    <a href="/map">Node Map</a>
                </li> 
                <li className="">
                    <a href="/faultalarm">Node Status</a>
                </li> 
                <li>
                    <a href="/newfault">Add New Fault</a>
                </li>
               <li>
                    <a href="/fault">Faults</a>
                </li>
                <li>
                    <a href="/inventory">Inventory</a>
                </li>
            </ul>

        </nav>
    )
}