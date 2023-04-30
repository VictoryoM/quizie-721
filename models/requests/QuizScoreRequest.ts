import Message from "./Message"

export default interface QuizScoreRequest {
  id: number;
  messages: Message[]
}
