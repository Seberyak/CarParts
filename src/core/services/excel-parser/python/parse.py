import json
import os

from main import path

parsedPath = os.path.join(path, "parsed")

partObject = {
    "oem": "",
    "description": "",
    "imageName": "",
    "price": 0
}


def save_image_from_row(idx, loader):
    image = loader.get('C{}'.format(idx))
    image.save(os.path.join(parsedPath, "images", "{}.png".format(idx)))
    image.close()


def write_to_json(file_name, data):
    with open(file_name, 'w') as outfile:
        json.dump(data, outfile, )


def parse_oem(row):
    text = row[0].value
    return text.splitlines()[2]


def parse_image_name(idx):
    return "{}.png".format(idx + 1)


def parse_part(row, idx):
    part = partObject
    part["oem"] = parse_oem(row)
    part["description"] = row[1].value
    part["imageName"] = parse_image_name(idx)
    part["price"] = row[3].value
    return part
