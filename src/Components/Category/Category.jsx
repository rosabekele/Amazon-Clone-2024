import React from 'react'
import { categoryInfos } from "./catagoryFullInfos"
import CategoryCard from './CategoryCard'
import classes from './catagory.module.css'
function Category() {
  return (     
  <section className={classes.category__container}>
    {
    categoryInfos.map((infos,index)=>{
        return <CategoryCard data = {infos} key={index}/>
    })
}
  </section>
)
}

export default Category