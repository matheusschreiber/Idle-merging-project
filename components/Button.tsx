import { NextPage } from "next"

type ButtonObject = {
  text:string
}

export const Button:NextPage<ButtonObject> = (obj:ButtonObject) => {
  return <div>{obj.text}</div>
}