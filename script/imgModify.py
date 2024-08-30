import cv2
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os

class FileAddedHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return None
        else:
            print(f"[imgModify.py] detect change {event.src_path}")
            time.sleep(5)
            self.modAndRename()

    def modAndRename(self):
        path = "../public/images/"
        for filename in os.listdir(path):
            if not filename.startswith("mod-") and not filename.startswith("upload"):
                filepath = os.path.join(path,filename)
                print(f"[START] {filepath}")
                imgMod(filepath)
                mod_filename = os.path.join(path,f"mod-{filename}")
                os.rename(filepath,mod_filename)
                print(f"[END] {mod_filename}")
    
def imgMod(filename):
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

if __name__ == "__main__":
    path = "../public/images/"
    eventHandler = FileAddedHandler()
    observer = Observer()
    observer.schedule(eventHandler, path ,recursive=False)
    try:
        observer.start()
        print(f"monitoring {path}")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
    