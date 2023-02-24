import { useContextValue } from "../services/ContextElement"
import styles from '../styles/components/Ring.module.css'
import { Aircraft } from "../types/Aircraft.types"
import { RingAircraft } from "./RingAircraft"
import { useEffect, useState } from 'react'
import { NextPage } from "next"

export const Ring:NextPage = () => {

  const { player } = useContextValue()

  const ellipseXRadius = 300
  const ellipseYRadius = 50
  const offsetX = 10
  const offsetY = 50

  const planetRadius = 100
  const planetColor = 'var(--super_dark_gray)'
  
  const [ aircrafts, setAircrafts ] = useState<Aircraft[]>()

  async function fetchAircrafts() {
    if (player?.aircrafts) setAircrafts(player.aircrafts)
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
        {/* FIXME: what is this for? */}
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
        
        
        {/* FIXME: this may cause lag */}
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