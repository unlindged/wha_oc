int redpin = 9;
int greenpin = 10;
int bluepin = 11;

int switch_up = 8;
int switch_down = 7;

int up_lastButtonState = HIGH;
int down_lastButtonState = HIGH;

int val = 0b000000;

void setup() {
  pinMode(redpin, OUTPUT);
  pinMode(greenpin, OUTPUT);
  pinMode(bluepin, OUTPUT);
  pinMode(switch_up, INPUT_PULLUP);
  pinMode(switch_down, INPUT_PULLUP);
  Serial.begin(9600);
}


void loop() {

  int up_reading = digitalRead(switch_up);
  int down_reading = digitalRead(switch_down);

  Serial.println(down_reading);

  if(up_reading != up_lastButtonState){
    delay(50);
    up_reading = digitalRead(switch_up);

    if(up_reading == LOW && up_lastButtonState == HIGH){
      Serial.println("Up pressed");
      val += 0b000010;
    }
  }

  if(down_reading != down_lastButtonState){
    delay(50);
    down_reading = digitalRead(switch_down);

    if(down_reading == LOW && down_lastButtonState == HIGH){
      Serial.println("Down pressed");
      val -= 0b000010;
    }
  }
  up_lastButtonState = up_reading;
  down_lastButtonState = down_reading;

  if(val < 0b000000){
    val = 0b000000;
  }
  if(val > 0b001110){
    val = 0b001110;
  }
  PORTB = val;
}