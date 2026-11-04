"""Render the original 12-second investigation opening as actual 3D motion footage.
Requires numpy, Pillow and ffmpeg. No source image or CSS animation is used.
"""
from pathlib import Path
import math, random, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
W,H,FPS,SECONDS=1280,720,24,12
OUT=Path(__file__).resolve().parents[1]/'assets'
OUT.mkdir(exist_ok=True)
BG=np.array([8,11,15.],float)
random.seed(31)
papers=[]
for i in range(76):
 side=-1 if i%2 else 1
 papers.append((np.array([side*random.uniform(3.0,10),random.uniform(-4.1,4.8),random.uniform(-5,29)]),random.uniform(-.65,.65),random.uniform(-.5,.5),random.uniform(-.5,.5),random.uniform(.8,1.65),random.random()*6.28))
nodes=[]
for layer,z in enumerate([40,49,58,68,80,94]):
 for j in range(7):
  a=j*math.tau/7+layer*.32
  nodes.append(np.array([math.cos(a)*(5+layer*.7),math.sin(a)*(3.1+layer*.2),z+math.sin(j)*2]))
trace=np.array([[0,-2.2,-15],[1,-1.8,0],[-1,-1.5,13],[0,-.7,29],[0,0,40],[-2,1,49],[1,0,58],[0,1,68],[2,0,80],[0,0,95]])
def rot(x=0,y=0,z=0):
 a,b,c,d,e,f=math.cos(x),math.sin(x),math.cos(y),math.sin(y),math.cos(z),math.sin(z)
 return np.array([[e,-f,0],[f,e,0],[0,0,1.]])@np.array([[c,0,d],[0,1,0],[-d,0,c]])@np.array([[1,0,0],[0,a,-b],[0,b,a]])
def smooth(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
base_y,base_x=np.mgrid[:H,:W]
r=np.sqrt(((base_x-W*.53)/W)**2+((base_y-H*.48)/H)**2)
base=np.zeros((H,W,3),np.uint8)
for c,v in enumerate([11,16,22]):base[:,:,c]=np.clip(v*(1-r*.75)+np.exp(-((base_x-W*.65)**2/(W*.4)**2+(base_y-H*.48)**2/(H*.7)**2))*[6,8,12][c],0,255)

def frame(t):
 camz=-16+6.0*t-2.0*smooth((t-9.5)/2.5)
 cam=np.array([.5*math.sin(t*.6),.18*math.sin(t*.8),camz])
 camera=rot(.015*math.sin(t*.5),.015*math.sin(t*.65),.015*math.sin(t*.45))
 focal=790-45*smooth((t-6)/2)
 commands=[];glows=[]
 def project(points):
  a=(np.array(points)-cam)@camera
  if np.min(a[:,2])<.42:return None,None
  xy=np.column_stack([W/2+focal*a[:,0]/a[:,2],H/2-focal*a[:,1]/a[:,2]])
  return [tuple(p) for p in xy],float(a[:,2].mean())
 def col(color,z):
  fog=math.exp(-max(0,z-2)/68)
  return tuple(int(v) for v in np.clip(BG+(np.array(color)-BG)*fog,0,255))
 def poly(p,color):
  xy,z=project(p)
  if xy and min(x[0] for x in xy)<W+800 and max(x[0] for x in xy)>-800:commands.append((z,'p',xy,col(color,z),1))
 def line(p,color,width=1,glow=False):
  xy,z=project(p)
  if xy:
   item=(z,'l',xy,col(color,z),max(1,int(width*focal/max(z,6)/65)))
   commands.append(item)
   if glow:glows.append(item)
 def box(center,size,color,rotation=None):
  center=np.array(center);sx,sy,sz=np.array(size)/2
  pts=np.array([[-sx,-sy,-sz],[sx,-sy,-sz],[sx,sy,-sz],[-sx,sy,-sz],[-sx,-sy,sz],[sx,-sy,sz],[sx,sy,sz],[-sx,sy,sz]])
  if rotation is not None:pts=pts@rotation.T
  pts+=center
  for face,shade in [([0,1,2,3],1),([4,7,6,5],.45),([0,3,7,4],.57),([1,5,6,2],.72),([3,2,6,7],1.13),([0,4,5,1],.38)]:poly(pts[face],np.array(color)*shade)
  return pts
 # Deep perspective floor and structural light lanes.
 for x in range(-18,19,3):line([[x,-4.5,max(camz+1,-18)],[x,-4.5,110]],[27,41,51],1)
 for z in range(-15,111,4):
  if z>camz+1:line([[-20,-4.5,z],[20,-4.5,z]],[31,46,56],1)
 # Physical, tumbling ledger sheets. Ink lines move with their paper planes.
 for i,(pos,ax,ay,az,scale,phase) in enumerate(papers):
  if pos[2]<camz+.8:continue
  at=pos+np.array([.3*math.sin(t*.8+phase),.42*math.sin(t*.6+phase),0])
  R=rot(ax+.15*math.sin(t*.5+phase),ay+.24*math.sin(t*.4+phase),az+.16*math.sin(t*.65+phase))
  def local(a):return np.array(a)@R.T+at
  width,height=1.55*scale,2.35*scale
  box(at,[width,height,.035],[169,176,176] if i%4 else [223,210,181],R)
  # Header, ruled lines, margin and stamped red strip, fully in perspective.
  for j in range(8):
   yy=height*.35-j*height*.095
   end=width*(.31 if (i+j)%3 else .12)
   line(local([[-width*.34,yy,-.025],[end,yy,-.025]]),[61,70,73],1.5)
  line(local([[-width*.34,height*.44,-.027],[width*.34,height*.44,-.027]]),[230,82,63] if i%5==0 else [85,105,111],3)
  if i%5==0:
   p=local([[-width*.36,-height*.41,-.028],[width*.27,-height*.41,-.028],[width*.27,-height*.29,-.028],[-width*.36,-height*.29,-.028]])
   poly(p,[161,44,35])
 # A massive segmented, physically opening vault.
 vz=31;opening=1.67*smooth((t-4.25)/2.35)
 if camz<vz-.5:
  for j in range(96):
   a=j*math.tau/96;b=(j+1)*math.tau/96
   p=[[math.cos(a)*5.65,math.sin(a)*5.65,vz],[math.cos(b)*5.65,math.sin(b)*5.65,vz],[math.cos(b)*4.95,math.sin(b)*4.95,vz-.1],[math.cos(a)*4.95,math.sin(a)*4.95,vz-.1]]
   shade=.6+.4*max(0,math.cos(a+.7));poly(p,np.array([108,125,137])*shade)
   if j%4==0:line([p[2],p[3]],[234,91,62],2,True)
  hinge=np.array([-4.9,0,vz-.2]);R=rot(0,-opening,0)
  def door(p):return np.array(p)@R.T+hinge
  for j in range(72):
   a=j*math.tau/72;b=(j+1)*math.tau/72
   p=door([[4.9,0,0],[4.9+4.85*math.cos(a),4.85*math.sin(a),0],[4.9+4.85*math.cos(b),4.85*math.sin(b),0]])
   poly(p,[43+12*math.cos(a),55+14*math.cos(a),64+17*math.cos(a)])
  for rad in [4.65,4.43,3.8,1.0]:
   points=door([[4.9+rad*math.cos(a),rad*math.sin(a),-.045] for a in np.linspace(0,math.tau,90)])
   line(points,[120,139,147] if rad>2 else [210,211,194],2)
  for j in range(12):
   a=j*math.tau/12;cx=4.9+4.08*math.cos(a);cy=4.08*math.sin(a)
   poly(door([[cx-.13,cy-.13,-.05],[cx+.13,cy-.13,-.05],[cx+.13,cy+.13,-.05],[cx-.13,cy+.13,-.05]]),[189,192,181])
  for a in [t*.3,t*.3+math.pi/2]:line(door([[4.9-math.cos(a),-math.sin(a),-.1],[4.9+math.cos(a),math.sin(a),-.1]]),[226,219,197],5)
 # Account blocks and branching transfer rails behind the opening door.
 for i,p in enumerate(nodes):
  if p[2]<camz+1:continue
  p=p+np.array([0,.18*math.sin(t*.9+i),0]);R=rot(0,t*.06+i*.4,0)
  red=i%7==3
  pts=box(p,[.9,.9,.9],[99,42,33] if red else [28,61,75],R)
  for pair in [(0,1),(1,2),(2,3),(3,0),(0,4),(1,5),(2,6),(3,7),(4,5),(5,6),(6,7),(7,4)]:line(pts[list(pair)],[248,100,69] if red else [95,164,185],1.2,red)
  if i+7<len(nodes):line([p,nodes[i+7]],[94,47,38] if red else [34,70,86],1,red)
 # The one trace the camera follows; glowing pulse races forward in real 3D.
 for i in range(len(trace)-1):
  p0,p1=trace[i],trace[i+1]
  if p1[2]<camz+.8:continue
  a=p0.copy()
  if a[2]<camz+.8:a=p0+(p1-p0)*(camz+.8-p0[2])/(p1[2]-p0[2])
  line([a,p1],[211,64,43],2.3,True)
 pulsez=camz+9+5*math.sin(t*.65)**2
 for i in range(len(trace)-1):
  if trace[i,2]<=pulsez<trace[i+1,2]:
   k=(pulsez-trace[i,2])/(trace[i+1,2]-trace[i,2]);p=trace[i]+(trace[i+1]-trace[i])*k
   box(p,[.12,.12,.12],[255,177,119]);line([p-np.array([0,0,.5]),p],[255,140,90],6,True)
 im=Image.fromarray(base.copy());d=ImageDraw.Draw(im)
 for depth,kind,xy,color,width in sorted(commands,key=lambda x:-x[0]):
  if kind=='p':d.polygon(xy,fill=color)
  else:d.line(xy,fill=color,width=width,joint='curve')
 light=Image.new('RGB',(W,H));ld=ImageDraw.Draw(light)
 for depth,kind,xy,color,width in glows:ld.line(xy,fill=tuple(int(x*.7) for x in color),width=width+2,joint='curve')
 bloom=np.array(light.filter(ImageFilter.GaussianBlur(9)),dtype=float)
 result=np.array(im,dtype=float)+bloom*.65
 # Film vignette and editorial widescreen letterbox.
 vignette=np.clip(1-r*.5,.4,1)[...,None]
 fade=smooth(t/.7)*(1-smooth((t-11.35)/.65))
 result=np.clip(result*vignette*fade,0,255).astype(np.uint8)
 result[:34]=[5,7,9];result[-34:]=[5,7,9]
 return result
if __name__=='__main__':
 cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'opening-film.mp4')]
 p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for i in range(FPS*SECONDS):
  f=frame(i/FPS);p.stdin.write(f.tobytes())
  if i in [48,132,216]:Image.fromarray(f).save(OUT/f'opening-frame-{i}.jpg',quality=90)
  if i%48==0:print(f'Rendered {i}/{FPS*SECONDS}',flush=True)
 p.stdin.close();p.wait();assert p.returncode==0
 Image.fromarray(frame(5.7)).save(OUT/'opening-poster.jpg',quality=90)
 print('Finished',OUT/'opening-film.mp4',flush=True)
