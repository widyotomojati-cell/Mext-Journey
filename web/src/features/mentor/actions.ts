"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MentorReviewState = {
  status: "idle" | "success" | "error";
  message?: string;
  review?: { verdict: "strong" | "refine"; strengths: string[]; focusArea: string; suggestion: string; followUpQuestion: string | null };
};

const initial: MentorReviewState = { status: "idle" };
export { initial as initialMentorReviewState };

export async function requestMentorReview(_: MentorReviewState, formData: FormData): Promise<MentorReviewState> {
  const assignmentId=String(formData.get("assignmentId")??"");
  const answer=String(formData.get("evidenceNote")??"").trim();
  if (!assignmentId || answer.length<3) return {status:"error",message:"Tulis jawaban minimal tiga karakter dulu."};
  if (!process.env.OPENAI_API_KEY) return {status:"error",message:"Mentor AI belum diaktifkan. Tambahkan OPENAI_API_KEY di Vercel dulu."};
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if (!userId) return {status:"error",message:"Sesi login lo sudah habis. Masuk lagi dulu ya."};
  const {data:assignment,error}=await supabase.from("daily_assignments").select("id, quest_definitions(title, theme, instructions, evidence_prompt)").eq("id",assignmentId).maybeSingle();
  if(error||!assignment) return {status:"error",message:"Quest tidak ditemukan."};
  const start=new Date(new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())+"T00:00:00+07:00").toISOString();
  const {count}=await supabase.from("mentor_review_events").select("*",{count:"exact",head:true}).eq("user_id",userId).gte("created_at",start);
  if((count??0)>=3) return {status:"error",message:"Batas 3 review mentor hari ini sudah terpakai. Besok lanjut lagi, ya."};
  const quest=Array.isArray(assignment.quest_definitions)?assignment.quest_definitions[0]:assignment.quest_definitions;
  const schema={type:"object",additionalProperties:false,required:["verdict","strengths","focus_area","suggestion","follow_up_question"],properties:{verdict:{type:"string",enum:["strong","refine"]},strengths:{type:"array",items:{type:"string"},maxItems:2},focus_area:{type:"string"},suggestion:{type:"string"},follow_up_question:{type:["string","null"]}}};
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.MEXT_MENTOR_MODEL??"gpt-5-mini",store:false,instructions:"Lo mentor MEXT Journey berbahasa Indonesia. Nilai kualitas jawaban: ketepatan menjawab prompt, spesifik, relevan ke tujuan riset/MEXT, dan langkah konkret. Jangan menghakimi pengalaman personal atau meminta bukti ulang. Jangan mengklaim fakta MEXT/lab benar tanpa sumber; bila ada klaim faktual, arahkan untuk verifikasi resmi. Beri feedback hangat, ringkas, dan actionable. Jangan tulis jawaban untuk pengguna.",input:`Quest: ${quest?.title??""}\nTema: ${quest?.theme??""}\nInstruksi: ${quest?.instructions??""}\nJawaban Dio: ${answer}`,text:{format:{type:"json_schema",name:"mentor_review",strict:true,schema}}})});
  if(!response.ok) return {status:"error",message:"Mentor belum bisa dihubungi. Coba sebentar lagi."};
  const payload=await response.json() as {output_text?:string;model?:string};
  try { const parsed=JSON.parse(payload.output_text??"{}") as {verdict:"strong"|"refine";strengths:string[];focus_area:string;suggestion:string;follow_up_question:string|null};
    const {error:saveError}=await supabase.from("mentor_reviews").upsert({user_id:userId,assignment_id:assignmentId,answer_snapshot:answer,verdict:parsed.verdict,strengths:parsed.strengths,focus_area:parsed.focus_area,suggestion:parsed.suggestion,follow_up_question:parsed.follow_up_question,model:payload.model??"gpt-5-mini"},{onConflict:"assignment_id"});
    if(saveError) throw saveError;
    await supabase.from("mentor_review_events").insert({user_id:userId,assignment_id:assignmentId});
    revalidatePath("/"); revalidatePath("/history");
    return {status:"success",review:{verdict:parsed.verdict,strengths:parsed.strengths,focusArea:parsed.focus_area,suggestion:parsed.suggestion,followUpQuestion:parsed.follow_up_question}};
  } catch { return {status:"error",message:"Feedback mentor belum terbaca rapi. Coba lagi ya."}; }
}