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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player])
    
  function pickColor(level:number){
    switch (level){
      case 1:
        return "var(--aircraft_ring_1)"
      case 2:
        return "var(--aircraft_ring_2)"
      case 3:
        return "var(--aircraft_ring_3)"
      case 4:
        return "var(--aircraft_ring_4)"
      case 5:
        return "var(--aircraft_ring_5)"
      case 6:
        return "var(--aircraft_ring_6)"
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
          strokeDasharray={7}
          strokeWidth="1"
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
                velocity={a.level/5}
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