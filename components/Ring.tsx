import { NextPage } from "next"

import styles from '../styles/components/Ring.module.css'
import { RingAircraft } from "./RingAircraft"

export const Ring:NextPage = () => {
  
  const ellipseXRadius = 300
  const ellipseYRadius = 50
    
  return(
    <div className={styles.container}>
      <svg>
        <ellipse cx={ellipseXRadius+10} cy={ellipseYRadius+10} rx={ellipseXRadius} ry={ellipseYRadius}
          stroke="#8D8DAA" 
          strokeLinecap="round"
          strokeDasharray={13}
          strokeWidth="4"
          fill="rgba(0,0,0,0)"/>
        
        <RingAircraft start={0} velocity={1} color="var(--light_white)"/>
        <RingAircraft start={50} velocity={-2} color="var(--redish)"/>
        <RingAircraft start={30} velocity={1.5} color="var(--light_gray)"/>
        <RingAircraft start={100} velocity={-1} color="var(--gray)"/>
        <RingAircraft start={200} velocity={0.5} color="var(--light_white)"/>
        <RingAircraft start={-150} velocity={2} color="var(--redish)"/>
      </svg>
    </div>
  )
}