import { NextPage } from "next"

import styles from '../styles/components/Ring.module.css'
import { RingAircraft } from "./RingAircraft"
import { Player } from "../types/Player.types"
import { useEffect, useState } from 'react'
import { handleListAircraft } from "../services/aircraft"
import { Aircraft } from "../types/Aircraft.types"

type RingObject = {
  player:Player
}

export const Ring:NextPage<RingObject> = ({player}) => {
  
  const ellipseXRadius = 300
  const ellipseYRadius = 50
  const offsetX = 10
  const offsetY = 50

  const planetRadius = 100
  const planetColor = 'var(--super_dark_gray)'
  
  const [ aircrafts, setAircrafts ] = useState<Aircraft[]>()

  async function fetchAircrafts() {
    const array = await handleListAircraft(player.id)
    setAircrafts(array)
  }

  useEffect(()=>{
    fetchAircrafts()
  }, [player])
    
  function pickColor(level:number){
    switch (level){
      case 1:
        return "var(--light_white)"
      case 2:
        return "var(--light_gray)"
      case 3:
        return "var(--gray)"
      case 4:
        return "var(--grayish_white)"
      case 5:
        return "var(--dark_white)"
      case 6:
        return "var(--redish)"
      default:
        return ""
    }
  }

  return(
    <div className={styles.container}>
      <svg>

        <defs>
          <clipPath id="cut-off-top">
            <rect x={ellipseXRadius-planetRadius+offsetX} y={ellipseYRadius+offsetY} width={planetRadius*2} height={planetRadius} />
          </clipPath>
        </defs>
        <circle cx={ellipseXRadius+offsetX} cy={ellipseYRadius+offsetY} r={planetRadius} clipPath="url(#cut-off-top)" fill={planetColor}/>

        <ellipse cx={ellipseXRadius+offsetX} cy={ellipseYRadius+offsetY} rx={ellipseXRadius} ry={ellipseYRadius}
          stroke="#8D8DAA" 
          strokeLinecap="round"
          strokeDasharray={13}
          strokeWidth="4"
          fill="rgba(0,0,0,0)"/>
        
        {
          aircrafts?.map((a,pos)=>{
            const randomStart = ellipseXRadius - Math.round(Math.random()*ellipseXRadius)
            return (
              a.id>0?
              <RingAircraft 
                key={pos}
                start={randomStart}
                velocity={Math.random()*2}
                color={pickColor(a.level)}/>
              :""
            )
          })
        }

        <defs>
          <clipPath id="cut-off-bottom">
            <rect x={ellipseXRadius-planetRadius+offsetX} y={0} width={planetRadius*2} height={planetRadius} />
          </clipPath>
        </defs>
        <circle cx={ellipseXRadius+offsetX} cy={ellipseYRadius+offsetY} r={planetRadius} clipPath="url(#cut-off-bottom)" fill={planetColor}/>


      </svg>

      
    </div>
  )
}