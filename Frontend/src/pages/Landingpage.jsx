import React from 'react'
import Navbar from '../components/Navbar'
import Hero from './Hero'
import ActorPage from './ActorPage'
import BillingProcessPage from './BillingProcessPage'
import Footer from '../components/Footer'

const Landingpage = () => {
  return (
    <div>
        <Navbar/>
        <Hero />
        <ActorPage />
        <BillingProcessPage />
        <Footer />
    </div>
  )
}

export default Landingpage
