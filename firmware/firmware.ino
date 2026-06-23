#include "PubSubClient.h"
#include "WakeOnLan.h"
#include "secrets.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <WiFiUDP.h>

// --- Configuration ---
const char *ssid = SECRET_SSID;
const char *portalUrl = SECRET_PORTAL_URL;
const char *mqttServer = "broker.emqx.io";
const int mqttPort = 1883;
const char *supabaseUrl = SECRET_SUPABASE_URL;
const char *supabaseKey = SECRET_SUPABASE_KEY;

// Device target (Based on your Agung-PC)
const char *targetMac = "E8:9C:25:75:7E:C7";

// Topic structure
String deviceId = "esp01_wol_01";
String cmdTopic = "nyalakanpc/" + deviceId + "/cmd";
String logTopic = "nyalakanpc/" + deviceId + "/logs";
String statusTopic = "nyalakanpc/" + deviceId + "/status";

WiFiClient espClient;
PubSubClient client(espClient);
WiFiUDP udp;
WakeOnLan WOL(udp);

void sendLog(String msg) {
  Serial.println(msg);
  if (client.connected()) {
    client.publish(logTopic.c_str(), msg.c_str());
  }
}

void triggerWake(const char *mac) {
  IPAddress ip = WiFi.localIP();
  IPAddress subnet = WiFi.subnetMask();
  IPAddress broadcast = WOL.calculateBroadcastAddress(ip, subnet);

  Serial.println("WOL Triggered for: " + String(mac));
  WOL.setBroadcastAddress(broadcast);
  WOL.sendMagicPacket(mac);
  WOL.setBroadcastAddress(IPAddress(255, 255, 255, 255));
  WOL.sendMagicPacket(mac);
  sendLog("Magic Packet Sent to " + String(mac));
}

// --- Supabase Cloud Communication ---
void syncWithSupabase() {
  if (WiFi.status() != WL_CONNECTED)
    return;

  WiFiClientSecure secureClient;
  secureClient.setInsecure();
  HTTPClient http;

  // 1. Send Heartbeat via RPC
  String heartbeatUrl = String(supabaseUrl) + "/rest/v1/rpc/heartbeat";
  http.begin(secureClient, heartbeatUrl);
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  http.addHeader("Content-Type", "application/json");

  String heartbeatPayload = "{\"device_mac\":\"" + String(targetMac) + "\"}";
  int heartCode = http.POST(heartbeatPayload);
  http.end();

  // 2. Check and Reset Wake Request via RPC (Atomic Operation)
  String wakeUrl = String(supabaseUrl) + "/rest/v1/rpc/check_and_reset_wake";
  http.begin(secureClient, wakeUrl);
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  http.addHeader("Content-Type", "application/json");

  int wakeCode =
      http.POST(heartbeatPayload); // uses same payload {device_mac:...}
  if (wakeCode > 0) {
    String res = http.getString();
    if (res == "true") {
      triggerWake(targetMac);
    }
  }
  http.end();
}

bool checkInternet() {
  HTTPClient http;
  http.begin(espClient, "http://connectivitycheck.gstatic.com/generate_204");
  int httpCode = http.GET();
  http.end();
  return (httpCode == 204);
}

void setupWiFi() {
  delay(10);
  WiFi.begin(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP: " + WiFi.localIP().toString());
}

void callback(char *topic, byte *payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++)
    message += (char)payload[i];
  if (message.startsWith("WAKE|"))
    triggerWake(message.substring(5).c_str());
}

unsigned long lastMqttRetry = 0;

void reconnect() {
  if (millis() - lastMqttRetry > 5000) {
    lastMqttRetry = millis();
    Serial.println("Attempting MQTT connection...");
    if (client.connect(deviceId.c_str(), statusTopic.c_str(), 1, true, "offline")) {
      Serial.println("MQTT Connected");
      client.subscribe(cmdTopic.c_str());
      client.publish(statusTopic.c_str(), "online", true); 
    }
  }
}

void setup() {
  Serial.begin(115200);
  setupWiFi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  client.setKeepAlive(15);
  WOL.setRepeat(10, 50);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) { 
    setupWiFi(); 
    return; 
  }
  
  if (!client.connected()) {
    reconnect();
  } else {
    client.loop();
  }
  
  static unsigned long lastCloudSync = 0;
  if (millis() - lastCloudSync > 5000) { // Sync Supabase every 5 seconds
    syncWithSupabase();
    lastCloudSync = millis();
  }
}
