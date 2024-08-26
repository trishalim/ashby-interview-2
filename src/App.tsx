import { InterviewProgressView } from "./components/InterviewProgress";
import styles from "./App.module.scss";
import { generateInterviewProgress } from "./generate";

export function App() {
  const interviewProgress = generateInterviewProgress();
  return (
    <div className={styles.app}>
      <div className={styles.center}>
        <h1>Interview Progress</h1>
        <InterviewProgressView data={interviewProgress} />
      </div>
    </div>
  );
}
