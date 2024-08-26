/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react";
import styles from "./InterviewProgress.module.scss";
import {
  Interviewer,
  InterviewProgress,
  ScheduledInterview,
  VisitedInterviewStage
} from "../types";
import { DateTime } from "luxon";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { ReactComponent as Check } from "../assets/check-regular.svg";
import { ReactComponent as Question } from "../assets/question-solid.svg";
import { ReactComponent as Times } from "../assets/times-regular.svg";
import { ReactComponent as Minus } from "../assets/minus-regular.svg";

export function InterviewProgressView({ data }: { data: InterviewProgress }) {
  return (
    <>
      <div className={styles.header}>
        <p>Stage</p>
        <p>Entered</p>
        <p>Time in Stage</p>
      </div>
      <section className={styles.container}>
        {data.visitedStages.map((s) => (
          <VisitedStageView key={s.id} data={s} />
        ))}
        {data.nextStage && <NextStageView data={data.nextStage} />}
      </section>
    </>
  );
}

/** Visited Stage Components */

export function VisitedStageView({ data }: { data: VisitedInterviewStage }) {
  const enteredAt = DateTime.fromISO(data.enteredAtIso);
  const leftAt = data.leftAtIso
    ? DateTime.fromISO(data.leftAtIso)
    : DateTime.now();

  return (
    <StageChrome className={styles.visited}>
      <StageHeader>
        <StageTitle>{data.interviewStage.title}</StageTitle>
        <div className={styles.entered}>
          {timeAgo.format(enteredAt.toJSDate())}
        </div>
        <div className={styles.time}>
          {Math.round(leftAt.diff(enteredAt).as("days"))} days
        </div>
      </StageHeader>
      {data.interviews &&
        data.interviews.map((i) => (
          <ScheduledInterviewView data={i} key={i.id} />
        ))}
    </StageChrome>
  );
}

export function ScheduledInterviewView({ data }: { data: ScheduledInterview }) {
  const startAt = DateTime.fromISO(data.startIso);
  const endAt = DateTime.fromISO(data.endIso);
  const isFuture = DateTime.now() < startAt;
  return (
    <InterviewChrome key={data.id} className={styles.scheduled}>
      <div>
        <InterviewTitle>{data.interview.title}</InterviewTitle>
        <p>
          {startAt.toLocaleString(DateTime.DATETIME_MED)} -{" "}
          {endAt.toLocaleString(DateTime.TIME_SIMPLE)}
        </p>
      </div>
      <div>
        {data.interviewers.map((i) => (
          <InterviewerView key={i.id} data={i} isFuture={isFuture} />
        ))}
      </div>
    </InterviewChrome>
  );
}

export function InterviewerView({
  data,
  isFuture
}: {
  data: Interviewer;
  isFuture: boolean;
}) {
  return (
    <div className={styles.interviewer}>
      <img src={data.user.profilePhotoUrl} />
      <div>{data.user.name}</div>
      {isFuture ? (
        <Rsvp rsvpStatus={data.rsvpStatus} />
      ) : (
        <Score score={data.score} />
      )}
    </div>
  );
}

export function Rsvp({
  rsvpStatus
}: {
  rsvpStatus: Interviewer["rsvpStatus"];
}) {
  let className = styles.unknown;
  let node = <Question />;

  switch (rsvpStatus) {
    case "accepted":
      className = styles.positive;
      node = <Check />;
      break;
    case "declined":
      className = styles.negative;
      node = <Times />;
      break;
    case "tenative":
      className = styles.warning;
      node = <Minus />;
      break;
  }

  return <div className={[styles.rsvp, className].join(" ")}>{node}</div>;
}

export function Score({ score }: { score: Interviewer["score"] }) {
  let className = styles.unknown;
  let node: React.ReactNode = score;

  switch (score) {
    case 4:
      className = styles.positive;
      break;
    case 3:
      className = styles.negative;
      break;
    case 2:
      className = styles.warning;
      break;
    case 1:
      className = styles.warning;
      break;
    default:
      node = <Question />;
  }

  return <div className={[styles.score, className].join(" ")}>{node}</div>;
}

/** Next Stage Components */

export function NextStageView({
  data
}: {
  data: NonNullable<InterviewProgress["nextStage"]>;
}) {
  return (
    <StageChrome>
      <StageHeader>
        <StageTitle>{data.interviewStage.title}</StageTitle>
      </StageHeader>
      {data.interviewSchedule &&
        data.interviewSchedule.map((interview) => (
          <InterviewChrome key={interview.id}>
            <InterviewTitle>{interview.title}</InterviewTitle>
          </InterviewChrome>
        ))}
    </StageChrome>
  );
}

/** Layout Components */

export function StageChrome({
  className,
  children
}: ChildrenProps & ClassNameProps) {
  return <div className={[styles.stage, className].join(" ")}>{children}</div>;
}

export function StageHeader({
  className,
  children
}: ChildrenProps & ClassNameProps) {
  return (
    <div className={[styles.stageHeader, className].join(" ")}>{children}</div>
  );
}

export function StageTitle({ children }: ChildrenProps) {
  return <h2 className={styles.stageTitle}>{children}</h2>;
}

export function InterviewChrome({
  className,
  children
}: ChildrenProps & ClassNameProps) {
  return (
    <div className={[styles.interview, className].join(" ")}>{children}</div>
  );
}

export function InterviewTitle({ children }: ChildrenProps) {
  return <h3 className={styles.interviewTitle}>{children}</h3>;
}

/** Utilities */

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

type ChildrenProps = { children?: React.ReactNode };
type ClassNameProps = { className?: string };
