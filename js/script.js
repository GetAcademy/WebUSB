// document.getElementById('arduinoButton').onclick = function (event) {
//   alert('onClick!');
//   if (navigator.usb) {
//     talkToArduino();
//   } else {
//     alert('WebUSB not supported.');
//   }
// };

document.getElementById('arduinoButton').addEventListener('click', function (event) {
  if (navigator.usb) {
    talkToArduino();
  } else {
    alert('WebUSB not supported.');
  }
});

function wait(waitsecs){
  setTimeout(donothing(), 'waitsecs');
}

function donothing() {

}

async function talkToArduino() {
  try {
    navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
    .then(device => {
      // console.log(device.productName);      // "Arduino Micro"
      // console.log(device.manufacturerName); // "Arduino LLC"
      document.getElementById('targetA').innerHTML = 'Received: ' + device.productName + ", " + device.manufacturerName;
    })
    .catch(error => { 
      document.getElementById('targetA').innerHTML = 'Error: ' + error;
    });

    wait(5000);

    let device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] });
    await device.open(); // Begin a session.
    await device.selectConfiguration(1); // Select configuration #1 for the device.
    await device.claimInterface(2); // Request exclusive control over interface #2.
    await device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: 0x02
    });
  
    // Ready to receive data
    let result = device.transferIn(5, 64); // Waiting for 64 bytes of data from endpoint #5.
    let decoder = new TextDecoder();
    document.getElementById('targetB').innerHTML = 'Received: ' + decoder.decode(result.data);

  } catch (error) {
    document.getElementById('targetB').innerHTML = error;
  }
}

/*
document.addEventListener('DOMContentLoaded', async () => {
  let devices = await navigator.usb.getDevices();
  var list = "";
  devices.forEach(device => {
    list += device.productName + ", " + device.manufacturerName + "; ";
  });
  document.getElementById('targetC').innerHTML = list;
});
*/
