import { useEffect, useMemo, useState } from 'react';
import { PainterlyBanner } from './PainterlyBanner';
import { getMascot } from '@/lib/mascots';
import { useAuth } from '@/lib/auth/use-auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { SupabaseScheduleRepository } from '@/lib/data/supabase-schedule-repository';
import { getActiveScheduleForChild, getScheduleDay, SCHEDULE_DAYS, timeToMinutes, type HouseholdSchedules, type ScheduleDay } from '@/lib/summer-schedule';
import type { Child } from '@/lib/types';

interface ScheduleTabProps { kid: Child }
const INK='#3d2c1f', MUTE='#8a7866', BLUE='#0ea5e9';

export const ScheduleTab=({kid}:ScheduleTabProps)=>{
  const { household }=useAuth();
  const [selectedDay,setSelectedDay]=useState<ScheduleDay>(()=>getScheduleDay());
  const [schedules,setSchedules]=useState<HouseholdSchedules>([]);
  const [loading,setLoading]=useState(true);
  const [now,setNow]=useState(()=>new Date());
  const mascot=getMascot(kid.mascotId??kid.avatarAnimal);
  const today=getScheduleDay(now);
  const plan=getActiveScheduleForChild(schedules,kid.id);
  const items=(plan?.days[selectedDay]??[]).slice().sort((a,b)=>timeToMinutes(a.time)-timeToMinutes(b.time));

  useEffect(()=>{const timer=window.setInterval(()=>setNow(new Date()),60000);return()=>window.clearInterval(timer);},[]);
  useEffect(()=>{const supabase=getSupabaseClient();if(!household||!supabase){setLoading(false);return;}const repo=new SupabaseScheduleRepository(supabase);void repo.load(household.id).then(setSchedules).finally(()=>setLoading(false));},[household]);

  const timing=useMemo(()=>{if(selectedDay!==today)return{currentIndex:-1,nextIndex:-1};const minutes=now.getHours()*60+now.getMinutes();const nextIndex=items.findIndex(entry=>timeToMinutes(entry.time)>minutes);return{currentIndex:nextIndex===0?-1:nextIndex===-1?items.length-1:nextIndex-1,nextIndex};},[items,now,selectedDay,today]);
  const current=timing.currentIndex>=0?items[timing.currentIndex]:null;
  const next=timing.nextIndex>=0?items[timing.nextIndex]:null;

  return <div style={{height:'100%',overflowY:'auto',paddingBottom:88,background:'linear-gradient(180deg,#fff9f0 0%,#e0f2fe 100%)',fontFamily:"'Fredoka',system-ui,sans-serif",color:INK}}>
    <PainterlyBanner label={`${mascot.emoji} ${kid.name}'s`} title={plan?.name??'Schedule'} palette="purple" />
    <div style={{padding:'0 20px 28px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8}}>{SCHEDULE_DAYS.map(day=><button key={day} type="button" onClick={()=>setSelectedDay(day)} style={{border:day===selectedDay?`3px solid ${BLUE}`:'2px solid rgba(14,165,233,.14)',background:day===selectedDay?'#e0f2fe':'#fff',borderRadius:18,padding:'12px 4px',fontFamily:'inherit',color:day===selectedDay?'#0369a1':MUTE,cursor:'pointer'}}><div style={{fontSize:16,fontWeight:800}}>{day.slice(0,2).toUpperCase()}</div><div style={{fontSize:16,height:18}}>{day===today?'●':'·'}</div></button>)}</div>
      {loading?<div style={{padding:36,textAlign:'center',color:MUTE,fontSize:22}}>Loading schedule…</div>:!plan?<div style={{marginTop:22,padding:32,textAlign:'center',background:'#fff',borderRadius:26,color:MUTE}}><div style={{fontSize:48}}>📅</div><div style={{fontSize:24,fontWeight:700,color:INK,marginTop:10}}>No active schedule yet</div><div style={{fontSize:18,marginTop:6}}>A parent can create and assign one from Parent Schedules.</div></div>:<>
        {selectedDay===today&&<div style={{marginTop:18,borderRadius:24,background:'linear-gradient(135deg,#0ea5e9,#38bdf8)',color:'#fff',padding:'18px 20px',display:'flex',alignItems:'center',gap:18}}><div style={{fontSize:42}}>{current?.icon??next?.icon??'☀️'}</div><div style={{flex:1}}><div style={{fontSize:16,fontWeight:800,opacity:.78}}>{current?'NOW':'COMING UP'}</div><div style={{fontSize:26,fontWeight:700}}>{current?.title??next?.title??'Enjoy your day'}</div>{next&&<div style={{fontSize:17,opacity:.86,marginTop:3}}>Next: {next.title} at {next.time}</div>}</div></div>}
        <div style={{marginTop:20,background:'#fff',borderRadius:28,padding:'20px 16px',border:'2px solid rgba(14,165,233,.1)'}}><div style={{padding:'0 12px 14px',fontSize:18,fontWeight:800,color:'#0369a1',letterSpacing:'.08em',textTransform:'uppercase'}}>{selectedDay}'s timetable</div>{items.length===0?<div style={{padding:30,textAlign:'center',color:MUTE,fontSize:20}}>Nothing planned. Summer has officially won.</div>:<div style={{display:'flex',flexDirection:'column',gap:14}}>{items.map((entry,index)=>{const active=index===timing.currentIndex;return <div key={entry.id} style={{display:'grid',gridTemplateColumns:'92px 1fr',gap:14}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:800,color:active?'#0369a1':MUTE}}>{entry.time}</div><div style={{borderRadius:24,padding:'18px 20px',background:active?'#bae6fd':index%2===0?'#f0f9ff':'#fff9f0',border:active?`3px solid ${BLUE}`:'2px solid rgba(180,120,80,.06)',display:'flex',alignItems:'center',gap:18}}><div style={{fontSize:38,width:48,textAlign:'center'}}>{entry.icon}</div><div style={{flex:1}}><div style={{fontSize:26,fontWeight:700,lineHeight:1.2}}>{entry.title}</div>{entry.note&&<div style={{fontSize:18,color:MUTE,marginTop:5,lineHeight:1.3}}>{entry.note}</div>}</div></div></div>})}</div>}</div>
      </>}
    </div>
  </div>;
};