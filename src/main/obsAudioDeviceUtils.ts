import { Input } from "@mui/material";
import { InputFactory } from "obs-studio-node";

class ObsAudioDevice {
  constructor (
    public id: string,
    public name: string,
  ) {};
};

/*
* getAudioDevices
*/
const getAudioDevices = (type: any, subtype: any): ObsAudioDevice[] => {
  const dummyDevice = InputFactory.create(type, subtype, { device_id: 'does_not_exist' });

  const srcs = InputFactory.getPublicSources();
    console.log(srcs.map(a => `${a.name} ${a.id} ${a.type}`));
  
    srcs.forEach(src => {
      let prop = src.properties.first();
      while(true) {
        console.log(`${prop.name} ${prop.value} ${prop.status} ${prop.description}`);
        prop = prop.next();
        if (!prop) break;
      }
    })

  console.log(type, subtype, dummyDevice.properties.get('device_id').details)
  const devices = dummyDevice.properties
    .get('device_id').details.items
    //@ts-ignore
    .map(({ name, value }) => new ObsAudioDevice(value, name));

  dummyDevice.release();

  return devices;
};

const getAvailableAudioInputDevices = () => {
  return getAudioDevices('wasapi_input_capture', 'mic-audio')
    .filter(v => v.id !== 'default');
};

const getAvailableAudioOutputDevices = () => {
  return getAudioDevices('wasapi_output_capture', 'desktop-audio')
    .filter(v => v.id !== 'default');
};

export {
  ObsAudioDevice,
  getAudioDevices,
  getAvailableAudioInputDevices,
  getAvailableAudioOutputDevices,
}
