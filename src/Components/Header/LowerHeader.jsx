import React from 'react'
import { RiMenuFill } from "react-icons/ri";
import classes from "./Header.module.css";
function LowerHeader() {
  return (
    <div className={classes.lower__container}>  
    
        <ul>
            <li>
                <RiMenuFill/>
                <p>All</p>
            </li>
            <li>Today's Deals</li>
            <li>Costumer Service</li>
            <li>Registry</li>
            <li>Gift Cards</li>
            <li>Sell</li>
        </ul>
    </div>
  )
}

export default LowerHeader