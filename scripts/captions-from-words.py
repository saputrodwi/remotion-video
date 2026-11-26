# Dipakai LOKAL: konversi hasil ASR (faster-whisper/whisper) ke format @remotion/captions + koreksi ejaan ASR.
import json,sys,re
FIX={"benang":"benda","menyadaringnya":"menyadarinya","kebutulan":"kebetulan","membigungkan":"membingungkan","telur":"fakta","pelajari":"dipelajari"}
w=json.load(open(sys.argv[1]));out=[]
for x in w:
    t=x["text"]; core=re.sub(r"[^\w-]","",t.lower())
    if core=="di" and False: pass
    if core in FIX:
        rep=FIX[core]; t=re.sub(re.escape(core),rep,t,flags=re.I) if core in t.lower() else rep
        if t.strip() and not t.startswith(" ") and x["text"].startswith(" "): t=" "+t.strip()
        if core=="benang": t=t.replace("benda","Benda") if x["text"].strip()[0].isupper() else t
    x["text"]=t; out.append(x)
# "di pelajari" -> "dipelajari"
res=[]
for i,x in enumerate(out):
    if re.sub(r"\W","",x["text"].lower())=="di" and i+1<len(out) and re.sub(r"\W","",out[i+1]["text"].lower())=="dipelajari":
        out[i+1]["startMs"]=x["startMs"]; continue
    res.append(x)
json.dump(res,open(sys.argv[2],"w"),ensure_ascii=False,indent=1)
print(len(res))
