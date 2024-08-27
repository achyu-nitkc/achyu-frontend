import sys
import cv2

args = sys.argv

filename =  args[1]

cascadeFile = "haarcascade_frontalface_default.xml"
clas = cv2.CascadeClassifier(cascadeFile)
img = cv2.imread(filename)

faceList = clas.detectMultiScale(img, scaleFactor=1.1, minSize=(30,30))

for x,y,w,h in faceList:
    face= img[y:y+h, x:x+w]
    small_pic = cv2.resize(face, (8,8))
    mosaic = cv2.resize(small_pic,(w,h))
    img[y:y+h, x:x+w]=mosaic

cv2.imwrite(filename,img)