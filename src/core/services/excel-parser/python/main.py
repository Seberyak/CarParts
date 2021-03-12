import sys

import openpyxl
from pathlib import Path
from openpyxl_image_loader import SheetImageLoader
from parse import *

fileName = "data.xlsx"
path = os.path.join(Path(os.getcwd()).parent, "car-parts", "uploads", "excel-files")
filePath = os.path.join(path, fileName)


def main():
    wb_obj = openpyxl.load_workbook(filePath)
    sheet = wb_obj.active
    image_loader = SheetImageLoader(sheet)
    parts_list = []

    for i, row in enumerate(sheet.iter_rows()):
        # skip first row
        if i == 0:
            continue
        part = parse_part(row, i)
        save_image_from_row(i + 1, image_loader)
        parts_list.append(part)

    json_name = "parsed.json"
    print(json.dumps(parts_list))
    write_to_json(os.path.join(parsedPath, json_name), parts_list)
    wb_obj.close()


if __name__ == '__main__':
    main()
