import { NextPage } from "next";
import { useEffect, useState } from "react";

type circleProps = {
  start:number,
  velocity: number,
  color:string
}

export const RingAircraft:NextPage<circleProps> = (props:circleProps) => {

  const [ xi, setXi ] = useState<number>(props.start)
  const [ yi, setYi ] = useState<number>(0)

  const [ x, setX ] = useState<number>(360)
  const [ y, setY ] = useState<number>(60)

  const [ factor, setFactor ] = useState<number>(-1)
  const [ velocity, setVelocity ] = useState<number>(props.velocity)
  
  const framerate = 10 //iterations per second
  const ellipseXRadius = 300
  const ellipseYRadius = 50

  function ellipseEquation(x:number){
    return ((1 - ((x**2)/(ellipseXRadius**2))) * (ellipseYRadius**2)) ** (0.5)
  }
 
  useEffect(()=>{
    const loop = setInterval(() => {
      
      // console.log(`X: ${xi} Y: ${ellipseEquation(xi)} f: ${factor}`)
      let module = Math.abs(ellipseXRadius-Math.abs(velocity))
      if (velocity>0){
        if (xi>=module && factor>0) setFactor(-1)
        else if (xi<=-module && factor<0) setFactor(1)
      } else if (velocity<0){
        if (xi>=module && factor<0) setFactor(1)
        else if (xi<=-module && factor>0) setFactor(-1)
      }
      
      setYi(ellipseEquation(xi)*factor)
      setXi(xi+factor*velocity)

      setX(xi+ellipseXRadius+10)
      setY((ellipseEquation(xi)*factor)+ellipseYRadius+10)
    }, framerate);

    return () => clearInterval(loop);
  })
  
  return <circle cx={x} cy={y} r="10" fill={props.color}/>
}