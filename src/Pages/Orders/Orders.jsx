import React, { useContext, useState, useEffect } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import classes from "./Orders.module.css";
import { db } from "../../Utility/firebase"; // Ensure this is the correct path
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";

// Import Firestore functions
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      // Reference to the user's orders collection
      const userOrdersRef = collection(db, `users/${user.uid}/orders`);
      const ordersQuery = query(userOrdersRef, orderBy("created", "desc"));

      // Real-time updates using onSnapshot
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        console.log(snapshot);
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>
          {orders?.length === 0 && (
            <div style={{ padding: "20px" }}>You don't have orders yet.</div>
          )}
          {/* Render ordered items */}
          <div>
            {orders?.map((eachOrder, i) => (
              <div key={i}>
                <hr />
                <p>Order ID: {eachOrder?.id} </p>
                {eachOrder?.data?.basket?.map((order) => (
                  <ProductCard flex={true} product={order} key={order.id} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;

// import React, {useContext,useState,useEffect} from 'react';
// import LayOut from '../../Components/LayOut/LayOut';
// import classes from "./Orders.module.css"
//  import {db} from "../../Utility/firebase" ;
//  import { DataContext } from "../../Components/DataProvider/DataProvider";
// import ProductCard from '../../Components/Product/ProductCard';

// function Orders() {
//   const [{user}, dispatch] = useContext(DataContext);
//   const [orders,setOrders] = useState([]);

// useEffect(() => {
// if(user){
// db.collection("users").doc(user.uid).collection("orders").orderBy("created","desc").onSnapshot((snapshot)=>{
//   console.log(snapshot);
//   setOrders(
//     snapshot.docs.map((doc)=>({
//       id:doc.id,
//       data:doc.data()
//     }))
//   )
// });
// }else{
// setOrders([])
// }
// }, []);
//   return (
//     <LayOut>
//       <section className={classes.container}>
//         <div className={classes.orders__container}>
//           <h2>Your Orders</h2>
//           {orders?.length == 0 && <div style={{padding:"20px"}}>you don't have orders yet.</div>}
//           {/* ordered items */}
//           <div>{
//             orders?.map((eachOrder,i)=>{
//               return (
//                 <div key={i}>
//                   <hr />
//                   <p>Order ID: {eachOrder?.id} </p>
//                   {eachOrder?.data?.basket?.map((order) => (

//                       <ProductCard flex={true} product={order} key={order.id} />
//                     ))}
//                 </div>
//               );
//             })}

//           </div>
//         </div>
//       </section>
//     </LayOut>
//   );
// }

// export default Orders;
