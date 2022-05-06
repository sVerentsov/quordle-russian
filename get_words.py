from collections import defaultdict
import json
import sys

try: 
    from pymystem3 import Mystem
except ModuleNotFoundError:
    print("Mystem not found. Install with: \n\npip install pymystem3\n")
    sys.exit(1)

with open("lemma.num", encoding="cp1251") as f:
    lines = [l.strip().split() for l in f.readlines()]

words = [word for _, _, word, pos in lines if pos == 'noun' and len(word) == 5]

m = Mystem()

all_results = defaultdict(list)
sorted_results = []

IGNORED_TAGS = ['обсц', 'отч', 'фам', 'имя', 'сокр', 'гео']

for word in words: 
    result = m.analyze(word)
    for option in result[0]['analysis']:
        if option['gr'].startswith('S') and all(tag not in option['gr'] for tag in IGNORED_TAGS):
            word_analysis = option['gr']
            break
    else:
        continue
    sorted_results.append(word)
    all_results[word_analysis].append(word)

with open('words.json', 'w') as f:
    json.dump(sorted_results[:1030], f, ensure_ascii=False)
print("Saved to words.json")