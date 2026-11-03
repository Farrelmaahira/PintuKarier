import app from "@/styles/app.module.css";

interface TranscriptItemProps {
  no: number;
  question: string;
  answer: string;
  duration: string;
}

export function TranscriptItem({ no, question, answer, duration }: TranscriptItemProps) {
  return (
    <li className={app.transcript}>
      <p className={app.ask}>
        <span className={app.who}>AI · P{no}</span>
        {question}
      </p>
      <p className={app.answer}>
        <span className={app.who}>Kandidat · {duration}</span>
        {answer}
      </p>
    </li>
  );
}
