import React,{useState} from 'react'
import fridge from './fridge.png'
import ReactPlayer from "react-player"
import './Home.css'


function Home()
{
    return(
        <div>
            <img id="fridge" src={fridge} alt="Fridge" />
            <h1 id="heading1">Why save food?</h1>
            <p>Food is something that unites.
            Your food is at its best when it’s on your plate, ready to be enjoyed. It’s perfect in your fridge, ready to be used, or stored in the freezer for another time. It’s at its worst when it’s in your bin.
  <br/>Saving food means saving money, but look at the bigger picture, too. Reducing food waste is good for the planet, as it helps slow down global warming.
  By using up every edible bit of your food, you’re doing your bit to look after the environment; imagine what we could achieve if we all make a change!
            </p>
            <ReactPlayer id="video" url="/video.mp4" controls={true}></ReactPlayer>     
          </div>
    )
}

export default Home