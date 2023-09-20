import sys
import json
from konlpy.tag import Okt
from pykospacing import Spacing

def tokenize(text):
    okt = Okt()
    tokens = okt.morphs(text)
    return tokens

if __name__ == '__main__':
    for line in sys.stdin:
        spacing = Spacing()
        print(spacing(line))
        # input_text = json.loads(line)
        # tokenized_text = tokenize(input_text)
        # print(json.dumps(tokenized_text))
