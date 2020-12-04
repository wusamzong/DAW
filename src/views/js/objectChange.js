export function positionMove(object,vec){
  let pos = object.position
  pos.set(pos.x+vec.x,pos.y+vec.y,pos.z+vec.z)
}