# go crops folder
# check index.txt to file
# if doesnt exist, create index.txt
# if exists, read index.txt
# resized all images not in index.txt to 500x500
# rename these images to {previous_name}_resized.jpg

import os
import sys
from PIL import Image
import glob
def resize_imgs():
    # go crops folder
    os.chdir(r'CropLink\assets_croplink\crops')
    # check index.txt to file
    if not os.path.exists('index.txt'):
        # if doesnt exist, create index.txt
        index = open('index.txt', 'w')
        index.close()
    # if exists, read index.txt
    index = open('index.txt', 'r')
    index_list = index.read().split('\n')
    index.close()
    # resized all images not in index.txt to 500x500
    image_names = []
    for file in os.listdir():
        # except for index.txt
        if file == 'index.txt':
            continue
        if file not in index_list:
            image_names.append(file)
            # create new image with 500x500
            img = Image.open(file)
            img = img.resize((500, 500))
            img.save(file[:-4] + '_resized.jpg')
    # update index.txt
    index = open('index.txt', 'w')
    for file in image_names:
        # write file name and new file name
        index.write(file + '\n')
        index.write(file[:-4] + '_resized.jpg\n')
    index.close()

if __name__ == '__main__':
    resize_imgs()