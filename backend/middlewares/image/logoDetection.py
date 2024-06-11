import cv2
import numpy as np
import sys

def detect_logo(logo_filename, image_filename):
    logo_img = cv2.imread(logo_filename, 0)
    sift = cv2.SIFT_create()
    
    des_logo = sift.detectAndCompute(logo_img, None)
    image = cv2.imread(image_filename)
    
    des_image = sift.detectAndCompute(image, None)
    FLANN_INDEX_KDTREE = 1
    
    index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
    search_params = dict(checks=50)
    
    flann = cv2.FlannBasedMatcher(index_params, search_params)
    matches = flann.knnMatch(des_logo, des_image, k=2)
    
    good_matches = []
    for m, n in matches:
        if m.distance < 0.7 * n.distance:
            good_matches.append(m)
            
    if len(good_matches) >= 10:
        return True
    else:
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 logoDetection.py <logo_filename> <image_filename>")
        sys.exit(1)
    logo_detected = detect_logo(sys.argv[1], sys.argv[2])
    print(logo_detected)
