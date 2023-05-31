export default interface TopicBoard {
  attemptNum: number;
  average: number;
  correctNum: number;
  updatedAt: Date;
  topic: {
    titleTopic: string;
  };
}
