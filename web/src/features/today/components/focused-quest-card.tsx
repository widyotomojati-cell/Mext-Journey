"use client";

import { useActionState, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, PencilLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialMentorReviewState, requestMentorReview } from "@/features/mentor/actions";

type Quest={theme:string;title:string;description:string;durationMinutes:number;rewardXp:number;evidenceLabel:string};
type Props={quest:Quest;assignmentId?:string;status?:"available"|"started"|"completed"|"missed";startAction?:(formData:FormData)=>void|Promise<void>;completeAction?:(formData:FormData)=>void|Promise<void>};

export function FocusedQuestCard({quest,assignmentId="",status="available",startAction,completeAction}:Props) {
 const [answer,setAnswer]=useState(""); const [reviewState,reviewAction]=useActionState(requestMentorReview,initialMentorReviewState);
 const started=status==="started",completed=status==="completed";
 return <article className="quest-card" aria-labelledby="quest-title">
  <div className="quest-card__topline"><span className="quest-number">Main quest</span><span className="quest-duration"><Clock3 size={16}/>{quest.durationMinutes} menit</span></div>
  <div className="quest-card__body"><p className="eyebrow text-primary-foreground/65">{quest.theme}</p><h2 id="quest-title" className="quest-title">{quest.title}</h2><p id="quest-description" className="quest-description">{quest.description}</p>
   <div className="quest-evidence"><PencilLine size={18}/><span><small>Evidence ringan</small><strong>{quest.evidenceLabel}</strong></span><CheckCircle2 className="ml-auto text-primary-foreground/45" size={19}/></div>
  </div>
  {started ? <div className="quest-card__form">
    <form action={reviewAction}><input type="hidden" name="assignmentId" value={assignmentId}/><label htmlFor="evidence-note" className="quest-form__label">{quest.evidenceLabel}</label><textarea id="evidence-note" name="evidenceNote" value={answer} onChange={e=>setAnswer(e.target.value)} required minLength={3} rows={3} placeholder="Tulis singkat dan jujur. Nggak perlu sempurna." className="quest-form__textarea"/>
    <div className="mentor-cta"><Button type="submit" variant="outline" className="rounded-xl">Minta review mentor · opsional</Button><small>Mentor menilai arah jawaban, bukan pengalaman personal lo.</small></div>
    {reviewState.status==="error"?<p className="mentor-message mentor-message--error">{reviewState.message}</p>:null}
    {reviewState.review?<div className="mentor-feedback"><p className="eyebrow">Feedback mentor</p><strong>{reviewState.review.verdict==="strong"?"Sudah cukup kuat":"Perlu dipertegas sedikit"}</strong><p>{reviewState.review.strengths.join(" · ")}</p><p><b>Fokus:</b> {reviewState.review.focusArea}</p><p><b>Upgrade:</b> {reviewState.review.suggestion}</p>{reviewState.review.followUpQuestion?<p><b>Next prompt:</b> {reviewState.review.followUpQuestion}</p>:null}</div>:null}</form>
    <form action={completeAction} className="quest-form__actions"><input type="hidden" name="assignmentId" value={assignmentId}/><input type="hidden" name="evidenceNote" value={answer}/><Button type="submit" size="lg" disabled={answer.trim().length<3} className="h-12 w-full rounded-xl bg-accent px-5 text-base font-bold text-accent-foreground sm:w-auto">Selesaikan quest +{quest.rewardXp} XP</Button><span className="quest-reward">Review tetap opsional—jawaban lo langsung tersimpan.</span></form>
   </div> : completed ? <div className="quest-card__complete" role="status"><span className="quest-complete__icon"><Sparkles size={20}/></span><span><strong>Quest selesai</strong><small>+{quest.rewardXp} XP masuk. Hari ini lo sudah hadir.</small></span></div> :
   <form action={startAction} className="quest-card__footer"><input type="hidden" name="assignmentId" value={assignmentId}/><Button type="submit" size="lg" disabled={status==="missed"} aria-describedby="quest-description" className="h-12 w-full justify-between rounded-xl bg-accent px-5 text-base font-bold text-accent-foreground sm:w-auto sm:min-w-56">{status==="missed"?"Quest sudah lewat":`Mulai quest ${quest.durationMinutes} menit`}<ArrowRight size={18}/></Button><span className="quest-reward">+{quest.rewardXp} XP setelah selesai</span></form>}
 </article>;
}