import cv2
import numpy as np
import sys

def detect_logo(logo_filename, image_filename):
    # Load the logo image
    logo_img = cv2.imread(logo_filename, 0)

    # Initialize SIFT detector
    sift = cv2.SIFT_create()

    # Detect keypoints and descriptors for the logo
    kp_logo, des_logo = sift.detectAndCompute(logo_img, None)

    # Load the image where you want to detect the logo
    image = cv2.imread(image_filename)

    # Detect keypoints and descriptors for the image
    kp_image, des_image = sift.detectAndCompute(image, None)

    # Initialize a FLANN matcher
    FLANN_INDEX_KDTREE = 1
    index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)

    # Match descriptors
    matches = flann.knnMatch(des_logo, des_image, k=2)

    # Ratio test to find good matches
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
