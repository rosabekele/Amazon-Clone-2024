import React,{useContext,useState} from 'react';
import classes from './Payment.module.css';
import LayOut from '../../Components/LayOut/LayOut';
import { DataContext } from '../../Components/DataProvider/DataProvider';
import ProductCard from "../../Components/Product/ProductCard";
import {useStripe,useElements,CardElement} from "@stripe/react-stripe-js";
import CurrencyFormat from '../../Components/CurrencyFormat/CurrencyFormat';
import { axiosInstance } from '../../Api/axios';
import { ClipLoader } from 'react-spinners';
import { db } from "../../Utility/firebase";
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc } from "firebase/firestore";
function Payment() {
const [{ user,basket},dispatch] = useContext(DataContext);
console.log(user);


const totalItem = basket?.reduce((amount, item) => {
  return item.amount + amount;
}, 0);

const total = basket.reduce((amount, item) => {
  return item.price * item.amount + amount;
}, 0); 


const [cardError,setCardError] =useState(null);
const [processing, setProcessing] = useState(false)

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); 
const handleChange = (e)=> {
  // console.log(e);
  e?.error?.message? setCardError( e?. error?.message): setCardError("")
};

const handelPayment = async (e) => {
  e.preventDefault();

  try {
    setProcessing(true);

    // 1. Backend --> Obtain client secret
    const response = await axiosInstance({
      method: "POST",
      url: `/payment/create?total=${total * 100}`,
    });

    const clientSecret = response.data?.clientSecret;

    // 2. Confirm card payment on client-side
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    // 3. Save order to Firestore
    const ordersCollection = collection(db, "users", user.uid, "orders"); // Modular syntax
    const orderDoc = doc(ordersCollection, paymentIntent.id);
    await setDoc(orderDoc, {
      basket: basket,
      amount: paymentIntent.amount,
      created: paymentIntent.created,
    });

    // Clear basket and navigate
dispatch({type:"EMPTY_BASKET"});
    setProcessing(false);
    navigate("/orders", { state: { msg: "You have placed a new order!" } });
  } catch (error) {
    console.log("Payment error:", error);
    setProcessing(false);
  }
};


return (
    <LayOut>
      {/* header */}
      <div className={classes.Payment__header}>Checkout({totalItem}) items</div>
      {/* payment method */}
      <section className={classes.payment}>
        {/*address  */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>345 React Lane</div>
            <div>Auburn</div>
          </div>
        </div>
        <hr />
        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.payment__card__container}>
            <div className={classes.Payment__details}>
              <form onSubmit={handelPayment}>
                {/* error */}
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                {/* card element */}
                <CardElement onChange={handleChange} />
                {/* price */}
                <div className={classes.payment__price}>
                  <div>
                    <span style={{display: "flex",gap:"10px"}}>
                      <p> Total Order | </p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit"> 
                    {
                      processing? (
                        <div className={classes.loading}>
                          <ClipLoader color="gray" size={12}/>
                          <p>Please Wait ...</p>
                        </div>

                      ):"Pay Now "
                    }
                    
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Payment