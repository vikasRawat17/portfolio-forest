import { ZoneSensor } from './ZoneSensor'

export function ZoneManager() {
  return (
    <>
      <ZoneSensor id="cabin"     position={[ 0,  1,  0]}  size={[5, 3, 5]}  />
      <ZoneSensor id="waterfall" position={[ 0,  1, -45]} size={[6, 3, 6]}  />
      <ZoneSensor id="ruins"     position={[40,  1, -15]} size={[7, 3, 7]}  />
      <ZoneSensor id="grove"     position={[-35, 1, -20]} size={[6, 3, 6]}  />
      <ZoneSensor id="firefly"   position={[35,  1, 30]}  size={[6, 3, 6]}  />
      <ZoneSensor id="campfire"  position={[ 0,  1, 35]}  size={[5, 3, 5]}  />
    </>
  )
}
