import cv2
import numpy as np
import sys

def preprocess_image(image_filename):
    img = cv2.imread(image_filename, 0) # read the image
    if img is None:
        print(f"Error: Unable to read image '{image_filename}'. Check the file path.")
        return None
    blurred_img = cv2.GaussianBlur(img, (5, 5), 0) # apply Gaussian Blur to the image
    _, thresh_img = cv2.threshold(blurred_img, 50, 255, cv2.THRESH_BINARY)
    return thresh_img

def detect_logo(logo_filename, image_filename):
    logo_img = preprocess_image(logo_filename) # preprocess the logo
    if logo_img is None:
        return False

    image = preprocess_image(image_filename) # preprocess the image
    if image is None:
        return False

    orb = cv2.ORB_create() # Create an ORB object

    # Detect keypoints and compute the descriptors with ORB
    kp_logo, des_logo = orb.detectAndCompute(logo_img, None)
    kp_image, des_image = orb.detectAndCompute(image, None)

    # Ensure that descriptors are not None
    if des_logo is None or des_image is None:
        print("Error: Unable to compute descriptors.")
        return False

    # FLANN parameters for ORB
    FLANN_INDEX_LSH = 6
    index_params = dict(algorithm=FLANN_INDEX_LSH,
                        table_number=6,  # 12
                        key_size=12,     # 20
                        multi_probe_level=1)  # 2
    search_params = dict(checks=50)

    flann = cv2.FlannBasedMatcher(index_params, search_params)
    matches = flann.knnMatch(des_logo, des_image, k=2)  # k=2 means to find the 2 nearest neighbors

    # Apply the ratio test
    good_matches = []
    for match in matches:
        if len(match) == 2:  # ensure there are two matches
            m, n = match
            if m.distance < 0.75 * n.distance:
                good_matches.append(m)
                
    return len(good_matches) > 30

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 logoDetection.py <logo_filename> <image_filename>")
        sys.exit(1)
    logo_detected = detect_logo(sys.argv[1], sys.argv[2])
    print(logo_detected)
