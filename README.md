# Modular Test Stand

## What is this?
This is a simple and modular test rig to test hobby rocket motors. It is especially useful to measure homemade rocket motors and check their specs. It is constructed with a modular design in mind. This means that it can simply be converted to measure other forces for other tests.  
I'm neither a Physicist nor a Mechanical Engineer. I'm a Software Engineer. So take this with a grain of salt and feel free to make changes if necesarry.  
  
I just wanted to share my work in hopes that others may find it useful.

## Materials Needed (for my setup)
- ESP32 Microprocessor (NODEESP in my case)
- CZL601 (I have the 50kg version https://www.tinkerforge.com/en/shop/load-cell-50kg-czl601.html)
- HX711 Load Cell Amplifier (https://www.bastelgarage.ch/load-cell-amplifier-hx711-wiegesensor-24-bit)
- Soldering Iron and Jumper Cables
- A USB powerbank
- About 50cm of 20x20mm Aluminium Strut Profile
- 10x M5 T Nut for 20x20mm Strut Profile
- 10x M5x16mm Bolt
- 10x M5 Washer
- 2x M6x30mm Bolt
- 2x M6 Washer
- A 3D Printer
- Basic CAD Knwoledge to create Custom Adapters
- A Server running a MQTT Broker (Mosquitto)

## Prerequisite
You will need a MQTT Broker. [This](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-the-mosquitto-mqtt-messaging-broker-on-ubuntu-16-04) tutorial from DigitalOcean shows you how you can set up such a service.

## How to build
1. Connect the Load Cell and the Load Cell Amplifier according to the wiring diagram below. (GND - GND, DT - GPIO 16, SCK - GPIO 4, VCC - VCC, Red - E+, Yellow - E-, Black and White - A-, Blue - A+)
![wiring](https://i.imgur.com/BIgIiWY.png)

1. Cut 2 pieces from your aluminium extrusion. One about 25cm (lower Structure) and the second about 12cm (upper arm).

1. Print the STL files.

1. Assemble the Scale according to the picture .
![scale](https://i.imgur.com/yPdznoS.png)
![esp_container](https://i.imgur.com/IWyxWk0.png)

1. Secure the electronics with cable ties

1. Follow the "Calibrate the Scale" Step in [this](https://randomnerdtutorials.com/esp32-load-cell-hx711/#calibrate-load-cell) tutorial to get the calibration factor

1. Open up the teststand.ino file and fill in your information including the calibration factor in the scale.set_scale(factor). Upload the programm to your ESP32. I recommend you use a mobile hotspot for your wifi connection. This way you are not constrained by your local WIFI.

1. Open up index.html in your Webbrowser of choice (tested in Chrome) and connect your USB Powerbank to the ESP32.

1. Wait until the Scale connectos to the Webinterface.

1. If you see the Connected! prompt in your JS Console and you see data comming in, you are all set.

## How to use the Interface
![webinterface](https://i.imgur.com/4Opzy0A.png)
### Enable Graph
This checkbox toggles the Diagram

### Pause / Resume
This button pauses/resumes the datalogging.

### Reset
Clears the ouput. This has no effect on calibration.

### Zero
Zero the scale. E.g. takes the current reading as an offset.

### Tare
To be used in conjunction with Calibrate. Sets the empty weight of the scale. Remove everything on the scale and click "Tare" to start the calibration.

### Calibrate
You have to Tare the scale first. After that, set a known weight on the scale. Put the weight of the object in grams in the input field and click Calibrate. This is useful for when you exchange adapters so you dont have to re-calculate the calibration factor.

### Export Data
This will create a JSON file with all information about the measurement. This includes all variables that are used to calculate the output like zeroOffset and the calibration ratio.
