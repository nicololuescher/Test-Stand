/*
 * ESP32 Loadcell Test Stand
 * Author: Nicolo Lüscher
 * 2022
 */

#include <Arduino.h>
#include "HX711.h"
#include "soc/rtc.h"
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char *SSID = YOUR_SSID;
const char *PWD = YOUR_PASSWORD;

const char *mqttUser = YOUR_MQTT_USER;
const char *mqttPassword = YOUR_MQTT_PASSWORD;

char *mqttServer = YOUR_MQTT_SERVER;
int mqttPort = YOUR_MQTT_PORT;

// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = 16;
const int LOADCELL_SCK_PIN = 4;

char buff[8];

HX711 scale;

WiFiClient wifiClient;

void callback(char *topic, byte *payload, unsigned int length)
{
  // handle message arrived
}

PubSubClient client(mqttServer, mqttPort, callback, wifiClient);

void setupMQTT()
{
  Serial.println("Connecting to MQTT Server");
  if (client.connect("arduinoClient", mqttUser, mqttPassword))
  {
    Serial.println("Connected!");
    client.publish("Status", "ESP Connected!");
  }
  else
  {
    Serial.println("Connection Error!");
  }
}

void connectToWiFi()
{
  Serial.print("Connecting to ");

  WiFi.begin(SSID, PWD);
  Serial.println(SSID);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println("Connected.");
}

void setup()
{
  Serial.begin(115200);

  Serial.println("Initializing scale");
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  scale.set_scale(91.3);
  scale.tare(); // reset the scale to 0

  Serial.println("Initialization Complete!");
  connectToWiFi();
  setupMQTT();
}

void loop()
{
  dtostrf(scale.get_units(), 6, 2, buff);
  String output = "{\"time\": " + String(millis()) + ", \"data\": " + buff + "}";
  client.publish("reading", output.c_str());
}
