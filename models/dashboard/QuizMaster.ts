export default interface QuizMaster {
  id: string;
  name: string | null;
  createdAt: Date;
  topics: {
    id: number;
    titleTopic: string;
    level: string;
    timesTaken: number;
  }[];
  topicResults: {
    attemptNum: number;
    average: number;
    updatedAt: Date;
  }[];
}
