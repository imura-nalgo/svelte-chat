export interface Sender {
  displayName: string;
  uid: string;
}

export interface Message {
  text: string;
  sender: Sender;
  sent_at: string;
}